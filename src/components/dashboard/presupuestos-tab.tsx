import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { type Budget, type Tx, CATEGORIES_EXPENSE, fmtPYG, sanitizeText } from "./types";

export function PresupuestosTab({
  userId,
  budgets,
  txs,
}: {
  userId: string;
  budgets: Budget[];
  txs: Tx[];
}) {
  const qc = useQueryClient();
  const [category, setCategory] = useState(CATEGORIES_EXPENSE[0]);
  const [limit, setLimit] = useState("");
  const [budgetDesc, setBudgetDesc] = useState("");

  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const spentByCat = useMemo(() => {
    const map = new Map<string, number>();
    txs
      .filter((t) => t.type === "expense" && t.occurred_on.startsWith(thisMonth))
      .forEach((t) => map.set(t.category, (map.get(t.category) ?? 0) + Number(t.amount)));
    return map;
  }, [txs, thisMonth]);

  const used = new Set(budgets.map((b) => b.category));
  const availableCategories = CATEGORIES_EXPENSE.filter((c) => !used.has(c));

  useEffect(() => {
    if (availableCategories.length > 0 && !availableCategories.includes(category)) {
      setCategory(availableCategories[0]);
    }
  }, [availableCategories, category]);

  const upsert = useMutation({
    mutationFn: async () => {
      const v = Number(limit);
      if (!v || v <= 0) throw new Error("Monto inválido");
      const desc = sanitizeText(budgetDesc.trim());
      if (desc.length < 10)
        throw new Error(
          "Agregá una descripción específica (mín 10 caracteres). Ej: 'Tope para delivery y restaurantes'",
        );
      const { error } = await supabase
        .from("category_budgets")
        .upsert(
          { user_id: userId, category, monthly_limit: v, description: desc },
          { onConflict: "user_id,category" },
        );
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Presupuesto guardado");
      setLimit("");
      setBudgetDesc("");
      qc.invalidateQueries({ queryKey: ["budgets", userId] });
    },
    onError: (e) => toast.error("Error al guardar los datos."),
  });

  const updateLimit = useMutation({
    mutationFn: async ({ id, monthly_limit }: { id: string; monthly_limit: number }) => {
      const { error } = await supabase
        .from("category_budgets")
        .update({ monthly_limit, updated_at: new Date().toISOString() })
        .eq("id", id)
        .eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["budgets", userId] }),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("category_budgets").delete().eq("id", id).eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Presupuesto eliminado");
      qc.invalidateQueries({ queryKey: ["budgets", userId] });
    },
  });

  return (
    <section className="grid lg:grid-cols-[0.9fr_2.1fr] gap-6 md:gap-8">
      <div className="bg-card p-5 md:p-7 lg:col-span-1 h-fit">
        <h2 className="font-display text-2xl font-black">Nuevo presupuesto</h2>
        <p className="text-xs font-semibold text-muted-foreground mt-1">
          Define cuánto querés gastar como máximo cada mes por categoría.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            upsert.mutate();
          }}
          className="mt-4 space-y-3"
        >
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={availableCategories.length === 0}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {availableCategories.length === 0 ? (
              <option>Ya cubriste todas las categorías</option>
            ) : (
              availableCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))
            )}
          </select>
          <input
            type="number"
            min={1}
            inputMode="numeric"
            placeholder="Límite mensual (PYG)"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            type="text"
            required
            minLength={10}
            maxLength={200}
            placeholder="Descripción (mín 10 caracteres)"
            value={budgetDesc}
            onChange={(e) => setBudgetDesc(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="submit"
            disabled={upsert.isPending || availableCategories.length === 0}
            className="w-full rounded-full bg-primary text-primary-foreground py-2.5 font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {upsert.isPending ? "Guardando..." : "Crear presupuesto"}
          </button>
        </form>
      </div>

      <div className="lg:col-span-2 space-y-3">
        {budgets.length === 0 && (
          <div className="bg-card p-8 text-center text-sm font-medium text-muted-foreground">
            Aún no tenés presupuestos. Empezá creando uno para tu categoría más cara (Comida,
            Vivienda, Ocio…).
          </div>
        )}
        {budgets.map((b) => {
          const spent = Number(spentByCat.get(b.category) ?? 0);
          const lim = Number(b.monthly_limit);
          const pct = lim > 0 ? Math.min(100, (spent / lim) * 100) : 0;
          const over = spent > lim;
          const tone = over ? "bg-destructive" : pct >= 80 ? "bg-amber-500" : "bg-emerald-500";
          return (
            <div key={b.id} className="bg-card p-5 md:p-6">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <h3 className="font-display text-xl font-black">{b.category}</h3>
                  <p className="text-xs text-muted-foreground">
                    {fmtPYG(spent)} de {fmtPYG(lim)}
                    {over
                      ? ` · ${fmtPYG(spent - lim)} por encima`
                      : ` · queda ${fmtPYG(lim - spent)}`}
                  </p>
                </div>
                <button
                  onClick={() => del.mutate(b.id)}
                  aria-label="Eliminar"
                  className="text-muted-foreground hover:text-destructive text-lg leading-none"
                >
                  ×
                </button>
              </div>
              <div className="h-3 w-full bg-muted border border-border overflow-hidden mb-3">
                <div
                  className={`h-full bk-progress-bar ${tone}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  defaultValue={lim}
                  onBlur={(e) => {
                    const v = Number(e.target.value);
                    if (v > 0 && v !== lim) updateLimit.mutate({ id: b.id, monthly_limit: v });
                  }}
                  className="w-32 rounded-lg border border-input bg-background px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <span className="text-xs text-muted-foreground">
                  Editá el límite y salí del campo para guardar
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
