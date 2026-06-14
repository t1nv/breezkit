import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { LogOut, Moon, Sun } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Profile, Fin, TabKey } from "@/components/dashboard/types";
import { TAB_KEYS, TAB_LABEL, TAB_HINT } from "@/components/dashboard/types";
import { ResumenTab } from "@/components/dashboard/resumen-tab";
import { TransaccionesTab } from "@/components/dashboard/transacciones-tab";
import { PresupuestosTab } from "@/components/dashboard/presupuestos-tab";
import { MetasTab } from "@/components/dashboard/metas-tab";
import { PerfilTab } from "@/components/dashboard/perfil-tab";
import { ChatPanel } from "@/components/dashboard/chat-panel";
import { EmpresaTab } from "@/components/dashboard/empresa-tab";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [tab, setTab] = useState<TabKey>("resumen");
  const [dark, setDark] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
      setEmail(data.user?.email ?? "");
    });
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const profileQ = useQuery({
    enabled: !!userId,
    queryKey: ["profile", userId],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", userId!)
        .maybeSingle();
      return (data ?? { display_name: null }) as Profile;
    },
  });

  const finQ = useQuery({
    enabled: !!userId,
    queryKey: ["fin", userId],
    queryFn: async () => {
      const { data } = await supabase
        .from("financial_profiles")
        .select(
          "monthly_income,fixed_expenses,variable_expenses,current_savings,debts,risk_profile,goal,currency",
        )
        .eq("user_id", userId!)
        .maybeSingle();
      return (data ?? {
        monthly_income: 0,
        fixed_expenses: 0,
        variable_expenses: 0,
        current_savings: 0,
        debts: 0,
        risk_profile: "moderado",
        goal: "",
        currency: "PYG",
      }) as Fin;
    },
  });

  const txQ = useQuery({
    enabled: !!userId,
    queryKey: ["transactions", userId],
    queryFn: async () => {
      const { data } = await supabase
        .from("transactions")
        .select("id,type,amount,category,description,occurred_on")
        .eq("user_id", userId!)
        .order("occurred_on", { ascending: false })
        .limit(200);
      return (data ?? []) as import("@/components/dashboard/types").Tx[];
    },
  });

  const goalsQ = useQuery({
    enabled: !!userId,
    queryKey: ["goals", userId],
    queryFn: async () => {
      const { data } = await supabase
        .from("goals")
        .select("id,name,target_amount,current_amount,target_date")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false });
      return (data ?? []) as import("@/components/dashboard/types").Goal[];
    },
  });

  const budgetsQ = useQuery({
    enabled: !!userId,
    queryKey: ["budgets", userId],
    queryFn: async () => {
      const { data } = await supabase
        .from("category_budgets")
        .select("id,category,monthly_limit,description")
        .eq("user_id", userId!)
        .order("category");
      return (data ?? []) as import("@/components/dashboard/types").Budget[];
    },
  });

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error("Sign out failed", e);
    }
    navigate({ to: "/auth" });
  };

  const fin = finQ.data;
  const txs = txQ.data ?? [];
  const goals = goalsQ.data ?? [];
  const budgets = budgetsQ.data ?? [];
  const name = profileQ.data?.display_name ?? email.split("@")[0];

  const incomeBaseline = Number(fin?.monthly_income ?? 0);
  const expBaseline = Number(fin?.fixed_expenses ?? 0) + Number(fin?.variable_expenses ?? 0);

  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const monthTx = txs.filter((t) => t.occurred_on.startsWith(thisMonth));
  const monthIncome = monthTx
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + Number(t.amount), 0);
  const monthExpense = monthTx
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + Number(t.amount), 0);

  const income = incomeBaseline + monthIncome;
  const totalExp = expBaseline + monthExpense;
  const balance = income - totalExp;
  const savings = Number(fin?.current_savings ?? 0);
  const debts = Number(fin?.debts ?? 0);
  const savingsRate = income > 0 ? Math.max(0, Math.min(100, (balance / income) * 100)) : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="bk-dashboard"
    >
      <header className="bk-topbar sticky top-0 z-30">
        <div className="max-w-[1500px] mx-auto px-4 md:px-8 py-4 md:py-5 flex items-center justify-between gap-3">
          <Link to="/" className="group flex items-center gap-3 shrink-0">
            <motion.span
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="bk-brand-mark h-8 w-8"
            />
            <span className="font-display text-xl md:text-2xl font-black text-foreground">Breezkit</span>
          </Link>
          <div className="flex items-center gap-2 text-sm">
            <motion.button
              onClick={toggleDark}
              aria-label="Cambiar tema"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bk-icon-action"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </motion.button>
            <span className="hidden md:block bg-background border-2 border-border px-3 py-2 font-medium truncate max-w-[260px] shadow-[4px_4px_0_var(--foreground)] text-foreground">
              {email}
            </span>
            <motion.button
              onClick={signOut}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="bk-danger-action inline-flex items-center gap-2 px-4 py-2 font-bold"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Salir</span>
            </motion.button>
          </div>
        </div>
        <div
          className="max-w-[1500px] mx-auto px-4 md:px-8 flex gap-2 overflow-x-auto pt-1"
          role="tablist"
        >
          {TAB_KEYS.map((k) => (
            <motion.button
              key={k}
              role="tab"
              aria-selected={tab === k}
              title={TAB_HINT[k]}
              onClick={() => setTab(k)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              layout
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={`bk-tab px-4 py-3 text-xs md:text-sm font-extrabold uppercase whitespace-nowrap ${
                tab === k ? "" : "hover:bg-background/80"
              }`}
            >
              {TAB_LABEL[k]}
            </motion.button>
          ))}
        </div>
      </header>

      <main className="max-w-[1500px] mx-auto px-4 md:px-8 py-8 md:py-12 space-y-8 md:space-y-10">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="bk-page-intro max-w-5xl"
        >
          <div className="inline-flex border-2 border-border bg-primary px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] shadow-[4px_4px_0_var(--foreground)]">
            {TAB_LABEL[tab]}
          </div>
          <h1 className="mt-5 font-display text-4xl md:text-7xl font-black leading-[0.88]">
            Hola, <span className="text-[var(--orange-glow)]">{name}</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base md:text-lg font-medium leading-relaxed text-muted-foreground">
            {TAB_HINT[tab]}
          </p>
        </motion.section>

        {tab === "resumen" && (
          <ResumenTab
            income={income}
            totalExp={totalExp}
            balance={balance}
            savings={savings}
            debts={debts}
            savingsRate={savingsRate}
            txs={txs}
            budgets={budgets}
            hasProfile={!!fin && Number(fin.monthly_income) > 0}
            onGoTab={setTab}
            userId={userId ?? ""}
          />
        )}
        {tab === "transacciones" && userId && <TransaccionesTab userId={userId} txs={txs} />}
        {tab === "presupuestos" && userId && (
          <PresupuestosTab userId={userId} budgets={budgets} txs={txs} />
        )}
        {tab === "metas" && userId && <MetasTab userId={userId} goals={goals} />}
        {tab === "perfil" && userId && fin && (
          <PerfilTab userId={userId} fin={fin} displayName={profileQ.data?.display_name ?? ""} />
        )}
        {tab === "asesor" && <ChatPanel />}
        {tab === "empresa" && <EmpresaTab />}
      </main>
    </motion.div>
  );

  // dummy to silence ts about qc unused if tabs short-circuit
  void qc;
}
