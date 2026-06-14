import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { type Goal, sanitizeText } from "./types";
import { GoalCard } from "./shared";

export function MetasTab({ userId, goals }: { userId: string; goals: Goal[] }) {
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [date, setDate] = useState("");

  const add = useMutation({
    mutationFn: async () => {
      const t = Number(target);
      const goalName = sanitizeText(name.trim(), 100);
      if (!goalName || !t || t <= 0) throw new Error("Datos inválidos");
      const { error } = await supabase.from("goals").insert({
        user_id: userId,
        name: goalName,
        target_amount: t,
        target_date: date || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Meta creada");
      setName("");
      setTarget("");
      setDate("");
      qc.invalidateQueries({ queryKey: ["goals", userId] });
    },
    onError: (e) => toast.error("Error al guardar los datos."),
  });

  const updateAmount = useMutation({
    mutationFn: async ({ id, current_amount }: { id: string; current_amount: number }) => {
      const { error } = await supabase
        .from("goals")
        .update({ current_amount, updated_at: new Date().toISOString() })
        .eq("id", id)
        .eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["goals", userId] }),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("goals").delete().eq("id", id).eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Meta eliminada");
      qc.invalidateQueries({ queryKey: ["goals", userId] });
    },
  });

  return (
    <section className="grid lg:grid-cols-[0.85fr_2.15fr] gap-6 md:gap-8">
      <div className="bg-card p-5 md:p-7 lg:col-span-1 h-fit">
        <h2 className="font-display text-2xl font-black">Nueva meta</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            add.mutate();
          }}
          className="mt-4 space-y-3"
        >
          <input
            maxLength={100}
            required
            placeholder="Ej: Viaje, Auto, Emergencia"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            type="number"
            min={1}
            required
            placeholder="Monto objetivo (PYG)"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="submit"
            disabled={add.isPending}
            className="w-full rounded-full bg-primary text-primary-foreground py-2.5 font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            Crear meta
          </button>
        </form>
      </div>

      <div className="lg:col-span-2 space-y-4">
        {goals.length === 0 && (
          <div className="bg-card p-8 text-center text-sm font-medium text-muted-foreground">
            Aún no tienes metas. Crea tu primera para empezar a hacer seguimiento.
          </div>
        )}
        {goals.map((g) => {
          const current = Number(g.current_amount);
          const target = Number(g.target_amount);
          const pct = Math.min(100, (current / target) * 100);
          const remaining = Math.max(0, target - current);
          const quickAmounts = [10000, 50000, 100000, 500000];
          return (
            <GoalCard
              key={g.id}
              goal={g}
              pct={pct}
              remaining={remaining}
              quickAmounts={quickAmounts}
              onAdd={(delta) => updateAmount.mutate({ id: g.id, current_amount: current + delta })}
              onSet={(value) =>
                updateAmount.mutate({ id: g.id, current_amount: Math.max(0, value) })
              }
              onDelete={() => del.mutate(g.id)}
              pending={updateAmount.isPending}
            />
          );
        })}
      </div>
    </section>
  );
}
