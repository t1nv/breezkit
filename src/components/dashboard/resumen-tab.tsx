import { useMemo } from "react";
import { motion } from "motion/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { WalletCards } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { type Tx, type Budget, type TabKey, fmtPYG } from "./types";
import { StatCard, AIInsightCard } from "./shared";

const COLORS = [
  "#D97757",
  "#AE5630",
  "#D4A27F",
  "#C9A227",
  "#7D9A6C",
  "#5B7B94",
  "#8A5A83",
  "#6B6A66",
  "#E5A084",
];

export function ResumenTab({
  income,
  totalExp,
  balance,
  savings,
  debts,
  savingsRate,
  txs,
  budgets,
  hasProfile,
  onGoTab,
  userId,
}: {
  income: number;
  totalExp: number;
  balance: number;
  savings: number;
  debts: number;
  savingsRate: number;
  txs: Tx[];
  budgets: Budget[];
  hasProfile: boolean;
  onGoTab: (t: TabKey) => void;
  userId: string;
}) {
  const qc = useQueryClient();
  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    txs
      .filter((t) => t.type === "expense" && t.occurred_on.startsWith(thisMonth))
      .forEach((t) => map.set(t.category, (map.get(t.category) ?? 0) + Number(t.amount)));
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [txs, thisMonth]);

  const last6 = useMemo(() => {
    const buckets: { month: string; income: number; expense: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleDateString("es-PY", { month: "short" });
      const items = txs.filter((t) => t.occurred_on.startsWith(key));
      const inc = items
        .filter((t) => t.type === "income")
        .reduce((s, t) => s + Number(t.amount), 0);
      const exp = items
        .filter((t) => t.type === "expense")
        .reduce((s, t) => s + Number(t.amount), 0);
      buckets.push({ month: label, income: inc, expense: exp });
    }
    return buckets;
  }, [txs]);

  const projection = useMemo(() => {
    const dayOfMonth = now.getDate();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const monthExp = txs
      .filter((t) => t.type === "expense" && t.occurred_on.startsWith(thisMonth))
      .reduce((s, t) => s + Number(t.amount), 0);
    const dailyAvg = dayOfMonth > 0 ? monthExp / dayOfMonth : 0;
    const projected = dailyAvg * daysInMonth;
    const remainingDays = daysInMonth - dayOfMonth;
    return { projected, monthExp, remainingDays, dailyAvg };
  }, [txs, thisMonth]);

  const budgetAlerts = useMemo(() => {
    const spentByCat = new Map(byCategory.map((b) => [b.name, b.value]));
    return budgets
      .map((b) => {
        const spent = Number(spentByCat.get(b.category) ?? 0);
        const limit = Number(b.monthly_limit);
        const pct = limit > 0 ? (spent / limit) * 100 : 0;
        return { category: b.category, spent, limit, pct };
      })
      .filter((b) => b.pct >= 80)
      .sort((a, b) => b.pct - a.pct);
  }, [budgets, byCategory]);

  const quickSpend = useMutation({
    mutationFn: async ({ amount, category }: { amount: number; category: string }) => {
      const { error } = await supabase.from("transactions").insert({
        user_id: userId,
        type: "expense",
        amount,
        category,
        occurred_on: new Date().toISOString().slice(0, 10),
      });
      if (error) throw error;
    },
    onSuccess: (_d, v) => {
      toast.success(`${v.category} ${fmtPYG(v.amount)} registrado`);
      qc.invalidateQueries({ queryKey: ["transactions", userId] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Error al guardar los datos."),
  });

  const QUICK_PRESETS: { category: string; emoji: string; amounts: number[] }[] = [
    { category: "Comida", emoji: "🍽️", amounts: [20000, 50000, 100000] },
    { category: "Transporte", emoji: "🚌", amounts: [5000, 15000, 30000] },
    { category: "Servicios", emoji: "💡", amounts: [50000, 150000, 300000] },
    { category: "Ocio", emoji: "🎉", amounts: [30000, 100000, 200000] },
  ];

  return (
    <>
      {!hasProfile && txs.length === 0 && (
        <section className="bk-panel bg-card p-5 md:p-7 lg:max-w-4xl">
          <h2 className="font-display text-2xl md:text-3xl font-black">Empecemos</h2>
          <p className="text-sm md:text-base font-medium text-muted-foreground mt-2">
            Para sacar el máximo provecho, completá tu perfil financiero y agregá tu primer
            movimiento.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => onGoTab("perfil")}
              className="bk-primary-action px-4 py-2 text-sm font-bold"
            >
              1. Completar perfil
            </button>
            <button
              onClick={() => onGoTab("transacciones")}
              className="rounded-xl border border-border bg-background px-4 py-2 text-sm font-bold"
            >
              2. Agregar movimiento
            </button>
            <button
              onClick={() => onGoTab("presupuestos")}
              className="rounded-xl border border-border bg-background px-4 py-2 text-sm font-bold"
            >
              3. Definir presupuestos
            </button>
          </div>
        </section>
      )}

      {budgetAlerts.length > 0 && (
        <section className="rounded-xl border border-border bg-[var(--primary)] text-primary-foreground p-5">
          <h2 className="font-display text-xl font-black mb-2">Alertas de presupuesto</h2>
          <ul className="space-y-1.5 text-sm">
            {budgetAlerts.map((b) => (
              <li key={b.category} className="flex items-center justify-between gap-3">
                <span className="truncate">
                  <span className="font-medium">{b.category}</span>
                  {" — "}
                  {fmtPYG(b.spent)} / {fmtPYG(b.limit)}
                </span>
                <span className="font-black">{b.pct.toFixed(0)}%</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="bk-stat-grid">
        <StatCard
          label="Ingreso mensual"
          value={fmtPYG(income)}
          tone="default"
          hint="Tu ingreso base del perfil más los ingresos registrados este mes."
        />
        <StatCard
          label="Gastos totales"
          value={fmtPYG(totalExp)}
          tone="warn"
          hint="Gastos fijos + variables del perfil, más gastos registrados este mes."
        />
        <StatCard
          label="Balance"
          value={fmtPYG(balance)}
          tone={balance >= 0 ? "good" : "bad"}
          hint="Ingreso menos gastos. Si está en rojo, este mes estás gastando más de lo que entra."
        />
        <StatCard
          label="Ahorro actual"
          value={fmtPYG(savings)}
          tone="default"
          hint="Dinero ya ahorrado/acumulado que cargaste en tu perfil."
        />
      </section>

      {hasProfile && txs.length > 0 && <AIInsightCard focus="resumen" label="Insight del mes" />}

      <section className="bk-panel bg-card p-5 md:p-7">
        <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
          <div>
            <h2 className="font-display text-2xl font-black">Registro rápido</h2>
            <p className="text-xs font-semibold text-muted-foreground">
              Toca un monto para registrarlo al instante (hoy).
            </p>
          </div>
          <button
            onClick={() => onGoTab("transacciones")}
            className="rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold"
          >
            Personalizar
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {QUICK_PRESETS.map((p) => (
            <div key={p.category} className="rounded-xl border border-border p-3 bg-background">
              <div className="text-xs font-semibold uppercase mb-2 flex items-center gap-1.5">
                <WalletCards className="h-4 w-4" aria-hidden />
                <span>{p.category}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {p.amounts.map((amt) => (
                  <motion.button
                    key={amt}
                    disabled={quickSpend.isPending}
                    onClick={() => quickSpend.mutate({ amount: amt, category: p.category })}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-xs rounded-xl border border-border bg-card px-2.5 py-1 font-bold disabled:opacity-50"
                  >
                    {amt >= 1000 ? `${(amt / 1000).toFixed(0)}k` : amt}
                  </motion.button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {projection.monthExp > 0 && projection.remainingDays > 0 && (
        <section className="bk-panel bg-card p-5 md:p-7">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h2 className="font-display text-2xl font-black">Proyección fin de mes</h2>
              <p className="text-xs font-semibold text-muted-foreground">
                Al ritmo actual ({fmtPYG(projection.dailyAvg)}/día), gastarías cerca de:
              </p>
            </div>
            <span
              className={`font-display text-2xl font-bold ${
                income > 0 && projection.projected > income ? "text-destructive" : "text-foreground"
              }`}
            >
              {fmtPYG(projection.projected)}
            </span>
          </div>
          {income > 0 && (
            <p className="mt-2 text-xs text-muted-foreground">
              {projection.projected > income
                ? `Te excederías por ${fmtPYG(projection.projected - income)} — frená un poco.`
                : `Quedaría libre aprox. ${fmtPYG(income - projection.projected)}.`}
            </p>
          )}
        </section>
      )}

      <section className="bk-panel bg-card p-5 md:p-7">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-display text-2xl font-black">Tasa de ahorro</h2>
            <p className="text-sm font-medium text-muted-foreground">
              Porcentaje de tu ingreso que queda libre cada mes.
            </p>
          </div>
          <span className="font-display text-2xl font-bold">{savingsRate.toFixed(0)}%</span>
        </div>
        <div className="h-4 w-full bg-muted rounded-xl border border-border overflow-hidden">
          <div
            className="h-full bk-progress-bar bk-progress-bar--orange"
            style={{ width: `${savingsRate}%` }}
          />
        </div>
        {debts > 0 && (
          <p className="mt-3 text-xs text-muted-foreground">
            Tienes {fmtPYG(debts)} en deudas — considera priorizar su pago.
          </p>
        )}
      </section>

      <section className="grid lg:grid-cols-2 gap-6">
        <div className="bk-panel bg-card p-5 md:p-7">
          <h3 className="font-display text-2xl font-black mb-1">Gastos del mes por categoría</h3>
          <p className="text-xs font-semibold text-muted-foreground mb-4">
            Basado en transacciones registradas.
          </p>
          {byCategory.length === 0 ? (
            <div className="h-[260px] flex items-center justify-center text-sm text-muted-foreground">
              Aún no registras gastos este mes.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={byCategory}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={(e) => e.name}
                >
                  {byCategory.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => fmtPYG(Number(v))} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bk-panel bg-card p-5 md:p-7">
          <h3 className="font-display text-2xl font-black mb-1">Últimos 6 meses</h3>
          <p className="text-xs font-semibold text-muted-foreground mb-4">Ingresos vs gastos.</p>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={last6}>
              <defs>
                <linearGradient id="gIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D97757" stopOpacity={0.55} />
                  <stop offset="95%" stopColor="#D97757" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF2200" stopOpacity={0.7} />
                  <stop offset="95%" stopColor="#FF2200" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis
                fontSize={11}
                tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v))}
              />
              <Tooltip formatter={(v) => fmtPYG(Number(v))} />
              <Area
                type="monotone"
                dataKey="income"
                stroke="#C15F3C"
                fill="url(#gIncome)"
                name="Ingresos"
              />
              <Area
                type="monotone"
                dataKey="expense"
                stroke="#FF2200"
                fill="url(#gExpense)"
                name="Gastos"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>
    </>
  );
}
