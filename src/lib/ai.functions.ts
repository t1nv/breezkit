import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { rateLimitApi } from "./rate-limit-middleware.server";

const inputSchema = z.object({
  message: z.string().trim().min(1).max(2000),
});

const SYSTEM_PROMPT = `Eres Breezkit, un asesor financiero digital amable, claro y profesional, especializado en finanzas personales (moneda por defecto PYG, pero adáptate a la moneda configurada por el usuario).

Tu rol:
- Analizar los datos del usuario (ingresos, gastos, ahorros, deudas, perfil de riesgo, meta, transacciones recientes).
- Recomendar acciones concretas: cómo ahorrar, reducir gastos, manejar deudas, e invertir según su perfil.
- Responder en español, breve y accionable.
- Si faltan datos en su perfil, indícale qué completar.
- No prometas rendimientos garantizados. Aclara que tus recomendaciones son educativas.

**Clasificación de conducta financiera (OBLIGATORIO):** En CADA respuesta, comienza con una línea exacta así:
\`> **Conducta financiera: [Conservadora | Moderada | Agresiva]** — <una frase justificándolo con sus datos>\`

Criterios para clasificar:
- **Conservadora**: tasa de ahorro ≥ 20%, deudas bajas o nulas (< 10% del ingreso), gasto estable, prioriza seguridad. Riesgo declarado bajo refuerza esto.
- **Moderada**: tasa de ahorro entre 5% y 20%, deudas manejables (< 30% del ingreso), gasto variable razonable, equilibra ahorro e inversión.
- **Agresiva**: tasa de ahorro < 5% o negativa, deudas altas (≥ 30% del ingreso), gasto variable alto, o asume mucho riesgo. También aplica si invierte fuerte aceptando volatilidad.

Si faltan datos suficientes, escribe \`Conducta financiera: Sin datos suficientes\` y pide qué completar.

Luego del análisis de conducta, da tu respuesta normal.

Formato: Usa markdown. Usa **negritas** para resaltar montos y conceptos clave, listas con viñetas o numeradas para pasos, y encabezados \`###\` para separar secciones cuando la respuesta sea larga.`;


const RATE_LIMIT_PER_HOUR = 30;

export const chatWithAdvisor = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth, rateLimitApi])
  .inputValidator((data) => inputSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return { error: "El servicio de IA no está configurado." } as const;
    }

    // Rate limit: count user messages in last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from("ai_messages")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("role", "user")
      .gte("created_at", oneHourAgo);

    if ((count ?? 0) >= RATE_LIMIT_PER_HOUR) {
      return { error: `Has alcanzado el límite de ${RATE_LIMIT_PER_HOUR} consultas por hora. Intenta más tarde.` } as const;
    }

    await supabase.from("ai_messages").insert({
      user_id: userId,
      role: "user",
      content: data.message,
    });

    // Load financial profile + recent transactions + goals
    const [{ data: fin }, { data: txs }, { data: goals }] = await Promise.all([
      supabase.from("financial_profiles").select("*").eq("user_id", userId).maybeSingle(),
      supabase
        .from("transactions")
        .select("type,amount,category,occurred_on")
        .eq("user_id", userId)
        .order("occurred_on", { ascending: false })
        .limit(20),
      supabase.from("goals").select("name,target_amount,current_amount,target_date").eq("user_id", userId),
    ]);

    const { data: history } = await supabase
      .from("ai_messages")
      .select("role,content")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
      .limit(20);

    const finSummary = fin
      ? `Perfil financiero (${fin.currency ?? "PYG"}):
- Ingreso mensual: ${fin.monthly_income ?? 0}
- Gastos fijos: ${fin.fixed_expenses ?? 0}
- Gastos variables: ${fin.variable_expenses ?? 0}
- Ahorro actual: ${fin.current_savings ?? 0}
- Deudas: ${fin.debts ?? 0}
- Perfil de riesgo: ${fin.risk_profile ?? "no definido"}
- Meta: ${fin.goal ?? "no definida"}`
      : "El usuario aún no ha completado su perfil financiero.";

    const txSummary = txs && txs.length > 0
      ? `\n\nÚltimas transacciones:\n${txs.map((t) => `- ${t.occurred_on} | ${t.type === "income" ? "+" : "-"}${t.amount} | ${t.category}`).join("\n")}`
      : "";

    const goalsSummary = goals && goals.length > 0
      ? `\n\nMetas activas:\n${goals.map((g) => `- ${g.name}: ${g.current_amount}/${g.target_amount}${g.target_date ? ` (para ${g.target_date})` : ""}`).join("\n")}`
      : "";

    const messages = [
      { role: "system", content: SYSTEM_PROMPT + "\n\n" + finSummary + txSummary + goalsSummary },
      ...(history ?? []).map((m) => ({ role: m.role, content: m.content })),
    ];

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        signal: controller.signal,
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages,
        }),
      });
      clearTimeout(timeout);

      if (!res.ok) {
        if (res.status === 429) return { error: "Has hecho muchas consultas seguidas. Espera un momento e intenta de nuevo." } as const;
        if (res.status === 402) return { error: "Se agotó el crédito del servicio de IA." } as const;
        return { error: `Error del servicio de IA (${res.status}).` } as const;
      }

      const json = await res.json();
      const reply: string = json?.choices?.[0]?.message?.content ?? "(sin respuesta)";

      await supabase.from("ai_messages").insert({
        user_id: userId,
        role: "assistant",
        content: reply,
      });

      return { reply } as const;
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") {
        return { error: "El servicio de IA tardó demasiado. Intenta de nuevo." } as const;
      }
      return { error: "No se pudo contactar al servicio de IA." } as const;
    }
  });

export const getChatHistory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth, rateLimitApi])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data } = await supabase
      .from("ai_messages")
      .select("id,role,content,created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
      .limit(100);
    return { messages: data ?? [] };
  });

export const clearChat = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth, rateLimitApi])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    await supabase.from("ai_messages").delete().eq("user_id", userId);
    return { success: true };
  });

/**
 * Insight contextual corto para mostrar en tarjetas del dashboard.
 * No persiste en historial. Lee perfil + últimos movimientos + presupuestos.
 */
export const getAIInsight = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth, rateLimitApi])
  .inputValidator((data) =>
    z.object({
      focus: z.enum(["resumen", "presupuestos", "metas", "gastos_categoria"]),
      category: z.string().max(60).optional(),
    }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) return { insight: "" } as const;

    const [{ data: fin }, { data: txs }, { data: budgets }, { data: goals }] = await Promise.all([
      supabase.from("financial_profiles").select("*").eq("user_id", userId).maybeSingle(),
      supabase.from("transactions").select("type,amount,category,occurred_on,description").eq("user_id", userId).order("occurred_on", { ascending: false }).limit(40),
      supabase.from("category_budgets").select("category,monthly_limit").eq("user_id", userId),
      supabase.from("goals").select("name,target_amount,current_amount").eq("user_id", userId),
    ]);

    const ctx = `Perfil: ingreso ${fin?.monthly_income ?? 0} PYG, gastos fijos ${fin?.fixed_expenses ?? 0}, ahorro ${fin?.current_savings ?? 0}, deudas ${fin?.debts ?? 0}, riesgo ${fin?.risk_profile ?? "moderado"}, meta "${fin?.goal ?? "sin definir"}".
Presupuestos: ${(budgets ?? []).map(b => `${b.category}=${b.monthly_limit}`).join(", ") || "ninguno"}.
Últimas tx: ${(txs ?? []).slice(0, 15).map(t => `${t.occurred_on} ${t.type === "income" ? "+" : "-"}${t.amount} ${t.category}`).join("; ") || "ninguna"}.
Metas: ${(goals ?? []).map(g => `${g.name} ${g.current_amount}/${g.target_amount}`).join("; ") || "ninguna"}.`;

    const focusPrompt = {
      resumen: "Da UN insight financiero breve (máx 2 frases, 35 palabras) basado en los datos. Empieza con un emoji. Sé concreto con números.",
      presupuestos: "Da UN consejo accionable (máx 2 frases) sobre los presupuestos del usuario y dónde está cerca del límite.",
      metas: "Da UN consejo de máx 2 frases para que el usuario avance más rápido en sus metas según su capacidad real.",
      gastos_categoria: `Comenta brevemente (máx 2 frases) el gasto en la categoría "${data.category}" según el perfil de riesgo del usuario. Sé directo.`,
    }[data.focus];

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        signal: controller.signal,
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-lite",
          messages: [
            { role: "system", content: `Eres Breezkit. ${focusPrompt}\n\nContexto del usuario:\n${ctx}` },
            { role: "user", content: "Dame el insight." },
          ],
        }),
      });
      clearTimeout(timeout);
      if (!res.ok) return { insight: "" } as const;
      const json = await res.json();
      return { insight: (json?.choices?.[0]?.message?.content ?? "").trim() } as const;
    } catch {
      return { insight: "" } as const;
    }
  });
