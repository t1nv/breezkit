export type Profile = { display_name: string | null };
export type Fin = {
  monthly_income: number | null;
  fixed_expenses: number | null;
  variable_expenses: number | null;
  current_savings: number | null;
  debts: number | null;
  risk_profile: string | null;
  goal: string | null;
  currency: string | null;
};
export type Tx = {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string | null;
  occurred_on: string;
};
export type Goal = {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  target_date: string | null;
};
export type Budget = {
  id: string;
  category: string;
  monthly_limit: number;
  description?: string | null;
};

export const CATEGORIES_EXPENSE = [
  "Comida",
  "Transporte",
  "Vivienda",
  "Servicios",
  "Salud",
  "Educación",
  "Ocio",
  "Compras",
  "Otros",
];
export const CATEGORIES_INCOME = [
  "Salario",
  "Freelance",
  "Ventas",
  "Inversiones",
  "Regalo",
  "Otros",
];
export const TAB_KEYS = [
  "resumen",
  "transacciones",
  "presupuestos",
  "metas",
  "perfil",
  "asesor",
  "empresa",
] as const;
export type TabKey = (typeof TAB_KEYS)[number];

export const TAB_LABEL: Record<TabKey, string> = {
  resumen: "Resumen",
  transacciones: "Transacciones",
  presupuestos: "Presupuestos",
  metas: "Metas",
  perfil: "Perfil",
  asesor: "Asesor IA",
  empresa: "Empresa",
};

export const TAB_HINT: Record<TabKey, string> = {
  resumen: "Visión general de tu mes: ingresos, gastos, ahorro y alertas.",
  transacciones: "Registra y revisa cada ingreso o gasto, con búsqueda y exportación.",
  presupuestos: "Define un tope mensual por categoría y recibí alertas al acercarte.",
  metas: "Objetivos de ahorro con progreso y aportes rápidos.",
  perfil: "Tus datos base + perfil de riesgo. La IA los usa para aconsejarte.",
  asesor: "Chatea con la IA, que conoce tu perfil, presupuestos y movimientos.",
  empresa: "Plan corporativo y herramientas para equipos.",
};

const CURRENCY_LOCALE: Record<string, string> = {
  PYG: "es-PY",
  USD: "en-US",
  EUR: "de-DE",
  BRL: "pt-BR",
  ARS: "es-AR",
};

export function getStoredCurrency(): string {
  if (typeof window === "undefined") return "PYG";
  return localStorage.getItem("breezkit-currency") ?? "PYG";
}

export function setStoredCurrency(currency: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("breezkit-currency", currency);
  }
}

export const fmtCurrency = (n: number, currency?: string) =>
  new Intl.NumberFormat(CURRENCY_LOCALE[currency ?? getStoredCurrency()] ?? "es-PY", {
    style: "currency",
    currency: currency ?? getStoredCurrency(),
    maximumFractionDigits: (currency ?? getStoredCurrency()) === "PYG" ? 0 : 2,
  }).format(n);

export const fmtPYG = (n: number) => fmtCurrency(n, getStoredCurrency());

export function sanitizeText(value: string, maxLen = 500): string {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .slice(0, maxLen);
}
