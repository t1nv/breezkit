import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { type Fin } from "./types";
import { Field, inputCls } from "./shared";

export function PerfilTab({
  userId,
  fin,
  displayName,
}: {
  userId: string;
  fin: Fin;
  displayName: string;
}) {
  const qc = useQueryClient();
  const [form, setForm] = useState<Fin>(fin);
  const [name, setName] = useState(displayName);

  useEffect(() => {
    setForm(fin);
  }, [fin]);
  useEffect(() => {
    setName(displayName);
  }, [displayName]);

  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("financial_profiles").upsert({
        user_id: userId,
        ...form,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      if (name && name !== displayName) {
        const { error: e2 } = await supabase
          .from("profiles")
          .update({
            display_name: name,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);
        if (e2) throw e2;
      }
    },
    onSuccess: () => {
      toast.success("Perfil actualizado");
      qc.invalidateQueries({ queryKey: ["fin", userId] });
      qc.invalidateQueries({ queryKey: ["profile", userId] });
    },
    onError: (e) => toast.error("Error al guardar los datos."),
  });

  const num = (k: keyof Fin) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value === "" ? 0 : Number(e.target.value) });

  return (
    <section className="bg-card p-5 md:p-8 max-w-4xl">
      <h2 className="font-display text-3xl font-black">Tu perfil financiero</h2>
      <p className="mt-2 text-sm font-medium text-muted-foreground">
        Estos datos se usan como base para los cálculos y las recomendaciones de la IA.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate();
        }}
        className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3"
      >
        <Field label="Nombre" className="sm:col-span-2">
          <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="Ingreso mensual base (PYG)">
          <input
            type="number"
            min={0}
            className={inputCls}
            value={form.monthly_income ?? 0}
            onChange={num("monthly_income")}
          />
        </Field>
        <Field label="Ahorro actual (PYG)">
          <input
            type="number"
            min={0}
            className={inputCls}
            value={form.current_savings ?? 0}
            onChange={num("current_savings")}
          />
        </Field>
        <Field label="Gastos fijos mensuales (PYG)">
          <input
            type="number"
            min={0}
            className={inputCls}
            value={form.fixed_expenses ?? 0}
            onChange={num("fixed_expenses")}
          />
        </Field>
        <Field label="Gastos variables est. (PYG)">
          <input
            type="number"
            min={0}
            className={inputCls}
            value={form.variable_expenses ?? 0}
            onChange={num("variable_expenses")}
          />
        </Field>
        <Field label="Deudas totales (PYG)">
          <input
            type="number"
            min={0}
            className={inputCls}
            value={form.debts ?? 0}
            onChange={num("debts")}
          />
        </Field>
        <Field label="Perfil de riesgo">
          <select
            className={inputCls}
            value={form.risk_profile ?? "moderado"}
            onChange={(e) => setForm({ ...form, risk_profile: e.target.value })}
          >
            <option value="conservador">Conservador</option>
            <option value="moderado">Moderado</option>
            <option value="agresivo">Agresivo</option>
          </select>
        </Field>
        <Field label="Meta financiera principal" className="sm:col-span-2">
          <input
            className={inputCls}
            maxLength={200}
            placeholder="Ej: Ahorrar para un auto en 2 años"
            value={form.goal ?? ""}
            onChange={(e) => setForm({ ...form, goal: e.target.value })}
          />
        </Field>
        <div className="sm:col-span-2 mt-2">
          <button
            type="submit"
            disabled={save.isPending}
            className="w-full sm:w-auto rounded-full bg-primary text-primary-foreground px-8 py-2.5 font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {save.isPending ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>
    </section>
  );
}
