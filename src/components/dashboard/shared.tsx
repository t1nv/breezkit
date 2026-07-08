import { useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-muted/60 rounded-md ${className}`} aria-hidden="true" />;
}

export function StatCardSkeleton() {
  return (
    <div className="bg-card p-4 md:p-6 min-h-[142px] flex flex-col justify-between">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-8 w-32 mt-5" />
    </div>
  );
}
import confetti from "canvas-confetti";
import { getAIInsight } from "@/lib/ai.functions";
import { fmtPYG, CATEGORIES_EXPENSE, CATEGORIES_INCOME, type Tx } from "./types";

export const inputCls =
  "w-full border border-input bg-background px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-0";

export function StatCard({
  label,
  value,
  tone,
  hint,
}: {
  label: string;
  value: string;
  tone: "default" | "good" | "bad" | "warn";
  hint?: string;
}) {
  const toneClass =
    tone === "good"
      ? "text-[var(--secondary)]"
      : tone === "bad"
        ? "text-destructive"
        : tone === "warn"
          ? "text-[var(--orange-glow)]"
          : "text-foreground";
  return (
    <motion.div
      whileHover={{ y: -7 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 360, damping: 24 }}
      className="bk-stat-card bg-card p-4 md:p-6 min-h-[142px] flex flex-col justify-between"
    >
      <div className="flex items-center gap-1.5">
        <div className="text-[10px] md:text-xs text-muted-foreground uppercase font-black tracking-[0.16em]">
          {label}
        </div>
        {hint && <InfoTooltip text={hint} />}
      </div>
      <div
        className={`mt-5 font-display text-2xl md:text-4xl font-black leading-none ${toneClass}`}
      >
        {value}
      </div>
    </motion.div>
  );
}

export function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="text-[11px] font-black uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

export function InfoTooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-flex">
      <button
        type="button"
        aria-label="Más información"
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="inline-flex items-center justify-center w-4 h-4 bg-muted text-[10px] font-black text-muted-foreground hover:bg-primary hover:text-primary-foreground transition"
      >
        ?
      </button>
      {open && (
        <span
          role="tooltip"
          className="absolute z-50 left-1/2 -translate-x-1/2 top-full mt-1.5 w-56 bg-popover text-popover-foreground rounded-xl border border-border px-3 py-2 text-xs leading-relaxed"
        >
          {text}
        </span>
      )}
    </span>
  );
}

export function AIInsightCard({
  focus,
  category,
  label = "Insight de la IA",
}: {
  focus: "resumen" | "presupuestos" | "metas" | "gastos_categoria";
  category?: string;
  label?: string;
}) {
  const fn = useServerFn(getAIInsight);
  const q = useQuery({
    queryKey: ["ai-insight", focus, category ?? ""],
    queryFn: () => fn({ data: { focus, category } }),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  const insight = q.data?.insight?.trim();
  return (
    <div className="rounded-xl border border-border bg-primary p-4">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-xs font-semibold text-primary-foreground uppercase tracking-[0.18em]">
          {label}
        </span>
        <InfoTooltip text="La IA analiza tu perfil, presupuestos y movimientos para darte una sugerencia corta y accionable." />
      </div>
      {q.isLoading || q.isFetching ? (
        <p className="text-xs text-muted-foreground italic">Analizando tus datos…</p>
      ) : insight ? (
        <p className="text-sm leading-relaxed">{insight}</p>
      ) : (
        <p className="text-xs text-muted-foreground">
          Agregá más datos para recibir un consejo personalizado.
        </p>
      )}
    </div>
  );
}

export function GoalCard({
  goal,
  pct,
  remaining,
  quickAmounts,
  onAdd,
  onSet,
  onDelete,
  pending,
}: {
  goal: { name: string; current_amount: number; target_amount: number; target_date: string | null };
  pct: number;
  remaining: number;
  quickAmounts: number[];
  onAdd: (delta: number) => void;
  onSet: (value: number) => void;
  onDelete: () => void;
  pending: boolean;
}) {
  const [amount, setAmount] = useState("");
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(String(goal.current_amount));

  const submitAdd = () => {
    const v = Number(amount);
    if (v > 0) {
      onAdd(v);
      setAmount("");
    }
  };

  return (
    <div className="bg-card p-5 md:p-6">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <h3 className="font-display text-xl font-black truncate">{goal.name}</h3>
          <p className="text-xs text-muted-foreground">
            {fmtPYG(Number(goal.current_amount))} / {fmtPYG(Number(goal.target_amount))}
            {goal.target_date ? ` · para ${goal.target_date}` : ""}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Faltan <span className="font-medium text-foreground">{fmtPYG(remaining)}</span> ·{" "}
            {pct.toFixed(0)}% completado
          </p>
        </div>
        <button
          onClick={onDelete}
          aria-label="Eliminar meta"
          className="bk-ghost-icon hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="h-3 w-full bg-muted border border-border overflow-hidden mb-4">
        <div
          className="h-full bk-progress-bar bk-progress-bar--orange"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {quickAmounts.map((amt) => (
          <motion.button
            key={amt}
            type="button"
            onClick={() => onAdd(amt)}
            disabled={pending}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-xs rounded-full border border-border bg-background hover:bg-muted px-2.5 py-1 transition-colors disabled:opacity-50"
          >
            +{fmtPYG(amt)}
          </motion.button>
        ))}
        {remaining > 0 && (
          <motion.button
            type="button"
            onClick={() => {
              onAdd(remaining);
              confetti({
                particleCount: 80,
                spread: 60,
                origin: { y: 0.5 },
                colors: ["#D97757", "#C15F3C", "#D4A27F", "#AE5630"],
              });
            }}
            disabled={pending}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-xs rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 px-2.5 py-1 transition-colors disabled:opacity-50"
          >
            Completar meta
          </motion.button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="number"
          min={0}
          inputMode="numeric"
          placeholder="Otro monto"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              submitAdd();
            }
          }}
          className="flex-1 rounded-lg border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          type="button"
          onClick={submitAdd}
          disabled={pending || !amount}
          className="rounded-lg bg-primary text-primary-foreground px-3 py-1.5 text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
        >
          Agregar
        </button>
      </div>

      <div className="mt-2">
        {editing ? (
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="flex-1 rounded-lg border border-input bg-background px-3 py-1.5 text-sm"
            />
            <button
              type="button"
              disabled={pending}
              onClick={() => {
                onSet(Number(editValue) || 0);
                setEditing(false);
              }}
              className="text-xs rounded-lg bg-secondary text-secondary-foreground px-2.5 py-1.5 hover:opacity-90"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setEditValue(String(goal.current_amount));
              }}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setEditValue(String(goal.current_amount));
              setEditing(true);
            }}
            className="text-xs text-muted-foreground hover:text-foreground underline-offset-2 hover:underline"
          >
            Corregir monto ahorrado
          </button>
        )}
      </div>
    </div>
  );
}

export function TxEditRow({
  tx,
  today,
  onCancel,
  onSave,
  pending,
}: {
  tx: Tx;
  today: string;
  onCancel: () => void;
  onSave: (patch: {
    amount: number;
    category: string;
    description: string | null;
    occurred_on: string;
  }) => void;
  pending: boolean;
}) {
  const [amount, setAmount] = useState(String(tx.amount));
  const [category, setCategory] = useState(tx.category);
  const [description, setDescription] = useState(tx.description ?? "");
  const [date, setDate] = useState(tx.occurred_on);
  const cats = tx.type === "income" ? CATEGORIES_INCOME : CATEGORIES_EXPENSE;
  const submit = () => {
    const amt = Number(amount);
    if (!amt || amt <= 0) return toast.error("Monto inválido");
    if (date > today) return toast.error("Fecha futura no permitida");
    onSave({ amount: amt, category, description: description.trim() || null, occurred_on: date });
  };
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 items-center">
      <input
        type="number"
        min={1}
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="rounded-lg border border-input bg-background px-2 py-1.5 text-sm col-span-1"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="rounded-lg border border-input bg-background px-2 py-1.5 text-sm col-span-1"
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
        className="rounded-lg border border-input bg-background px-2 py-1.5 text-sm col-span-1"
      />
      <input
        type="text"
        maxLength={200}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descripción"
        className="rounded-lg border border-input bg-background px-2 py-1.5 text-sm col-span-2 md:col-span-1"
      />
      <div className="flex items-center gap-1 col-span-2 md:col-span-1 justify-end">
        <button
          type="button"
          onClick={submit}
          disabled={pending}
          className="text-xs rounded-lg bg-primary text-primary-foreground px-2.5 py-1.5 hover:opacity-90 disabled:opacity-50"
        >
          Guardar
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-xs text-muted-foreground hover:text-foreground px-2"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

export function sanitizeCsvField(value: string): string {
  if (/^[=+\-@\t]/.test(value)) {
    return `'${value.replace(/"/g, '""')}`;
  }
  return value.replace(/"/g, '""');
}

export function exportTxsToCsv(txs: Tx[]) {
  const header = ["Fecha", "Tipo", "Categoria", "Monto", "Descripcion"];
  const rows = txs.map((t) => [
    t.occurred_on,
    t.type === "income" ? "Ingreso" : "Gasto",
    sanitizeCsvField(t.category),
    String(t.amount),
    sanitizeCsvField(t.description ?? ""),
  ]);
  const csv = [header, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `transacciones_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success("CSV descargado");
}
