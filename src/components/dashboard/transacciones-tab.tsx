import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowDownRight, ArrowUpRight, Download, Edit3, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { type Tx, CATEGORIES_EXPENSE, CATEGORIES_INCOME, fmtPYG, sanitizeText } from "./types";
import { TxEditRow, exportTxsToCsv } from "./shared";

export function TransaccionesTab({ userId, txs }: { userId: string; txs: Tx[] }) {
  const qc = useQueryClient();
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Comida");
  const [description, setDescription] = useState("");
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");
  const [filterCat, setFilterCat] = useState<string>("all");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    setCategory(type === "income" ? "Salario" : "Comida");
  }, [type]);

  const add = useMutation({
    mutationFn: async () => {
      const amt = Number(amount);
      if (!amt || amt <= 0) throw new Error("El monto debe ser mayor a 0");
      if (amt > 1_000_000_000_000) throw new Error("Monto demasiado grande");
      if (date > today) throw new Error("La fecha no puede ser futura");
      const desc = sanitizeText(description.trim());
      if (desc.length < 3)
        throw new Error(
          "Agregá una descripción de al menos 3 caracteres.",
        );
      const { error } = await supabase.from("transactions").insert({
        user_id: userId,
        type,
        amount: amt,
        category,
        description: desc,
        occurred_on: date,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Transacción agregada");
      setAmount("");
      setDescription("");
      qc.invalidateQueries({ queryKey: ["transactions", userId] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Error al guardar los datos."),
  });

  const update = useMutation({
    mutationFn: async (patch: Partial<Tx> & { id: string }) => {
      const { id, ...rest } = patch;
      const { error } = await supabase.from("transactions").update(rest).eq("id", id).eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Actualizada");
      setEditingId(null);
      qc.invalidateQueries({ queryKey: ["transactions", userId] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Error al guardar los datos."),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("transactions").delete().eq("id", id).eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Eliminada");
      qc.invalidateQueries({ queryKey: ["transactions", userId] });
    },
  });

  const cats = type === "income" ? CATEGORIES_INCOME : CATEGORIES_EXPENSE;

  const filteredTxs = useMemo(() => {
    return txs.filter((t) => {
      if (filter !== "all" && t.type !== filter) return false;
      if (filterCat !== "all" && t.category !== filterCat) return false;
      return true;
    });
  }, [txs, filter, filterCat]);

  const allCats = useMemo(() => {
    const s = new Set<string>();
    txs.forEach((t) => s.add(t.category));
    return Array.from(s).sort();
  }, [txs]);

  return (
    <section className="grid lg:grid-cols-[0.9fr_2.1fr] gap-6 md:gap-8">
      <div className="bg-card p-5 md:p-7 lg:col-span-1 h-fit">
        <h2 className="font-display text-2xl font-black">Agregar movimiento</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            add.mutate();
          }}
          className="mt-4 space-y-3"
        >
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setType("expense")}
              className={`rounded-lg py-2 text-sm font-medium transition ${type === "expense" ? "bg-destructive/10 text-destructive border border-destructive/30" : "bg-muted text-muted-foreground"}`}
            >
              Gasto
            </button>
            <button
              type="button"
              onClick={() => setType("income")}
              className={`rounded-lg py-2 text-sm font-medium transition ${type === "income" ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30" : "bg-muted text-muted-foreground"}`}
            >
              Ingreso
            </button>
          </div>
          <input
            type="number"
            min={1}
            step="any"
            required
            placeholder="Monto (PYG)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {cats.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <input
            type="date"
            max={today}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            type="text"
            required
            minLength={3}
            maxLength={200}
            placeholder="Descripción (ej: Almuerzo con cliente)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="submit"
            disabled={add.isPending}
            className="w-full rounded-full bg-primary text-primary-foreground py-2.5 font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {add.isPending ? "Agregando..." : "Agregar"}
          </button>
        </form>
      </div>

      <div className="bg-card p-5 md:p-7 lg:col-span-1 lg:translate-y-8">
        <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
          <h2 className="font-display text-2xl font-black">Historial ({filteredTxs.length})</h2>
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as "all" | "income" | "expense")}
              className="text-xs rounded-full border border-border bg-background px-3 py-1.5"
            >
              <option value="all">Todos</option>
              <option value="income">Ingresos</option>
              <option value="expense">Gastos</option>
            </select>
            <select
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value)}
              className="text-xs rounded-full border border-border bg-background px-3 py-1.5"
            >
              <option value="all">Todas categorías</option>
              {allCats.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => exportTxsToCsv(filteredTxs)}
              disabled={filteredTxs.length === 0}
              className="text-xs border-2 border-border bg-background hover:bg-muted px-3 py-1.5 transition disabled:opacity-40 inline-flex items-center gap-1.5 font-bold"
            >
              <Download className="h-3.5 w-3.5" />
              CSV
            </button>
          </div>
        </div>
        {filteredTxs.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">
            No hay movimientos con esos filtros.
          </p>
        ) : (
          <ul className="divide-y divide-border max-h-[560px] overflow-y-auto -mx-2 pr-2">
            {filteredTxs.map((t) => (
              <li key={t.id} className="px-2 py-3">
                {editingId === t.id ? (
                  <TxEditRow
                    tx={t}
                    today={today}
                    onCancel={() => setEditingId(null)}
                    onSave={(patch) => update.mutate({ id: t.id, ...patch })}
                    pending={update.isPending}
                  />
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`bk-move-mark ${
                          t.type === "income" ? "bk-move-mark--income" : "bk-move-mark--expense"
                        }`}
                      >
                        {t.type === "income" ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4" />
                        )}
                      </span>
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">
                          {t.category}
                          {t.description ? ` · ${t.description}` : ""}
                        </div>
                        <div className="text-xs text-muted-foreground">{t.occurred_on}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <span
                        className={`text-sm font-semibold mr-1 ${t.type === "income" ? "text-emerald-600" : "text-destructive"}`}
                      >
                        {t.type === "income" ? "+" : "-"}
                        {fmtPYG(Number(t.amount))}
                      </span>
                      <button
                        onClick={() => setEditingId(t.id)}
                        className="bk-ghost-icon"
                        aria-label="Editar"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`¿Eliminar ${t.category} de ${fmtPYG(Number(t.amount))}?`))
                            del.mutate(t.id);
                        }}
                        className="bk-ghost-icon hover:text-destructive"
                        aria-label="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
