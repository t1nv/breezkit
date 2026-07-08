import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChevronLeft, Palette, User, Coins, Shield, Save, LogOut, Globe, Lock } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { SupportedLanguage } from "@/lib/i18n";
import { LANGUAGES, switchLanguage } from "@/lib/i18n";
import { Link, useNavigate } from "@tanstack/react-router";
import { setStoredCurrency, getStoredCurrency } from "@/components/dashboard/types";
import { useDarkMode } from "@/hooks/use-dark-mode";

export const Route = createFileRoute("/_authenticated/settings")({
  component: Settings,
});

const CURRENCIES = [
  { code: "PYG", label: "Guaraní (Gs)", symbol: "Gs" },
  { code: "USD", label: "Dólar ($)", symbol: "$" },
  { code: "EUR", label: "Euro (€)", symbol: "€" },
  { code: "BRL", label: "Real (R$)", symbol: "R$" },
  { code: "ARS", label: "Peso Argentino ($)", symbol: "$" },
] as const;

function Settings() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [currency, setCurrency] = useState(getStoredCurrency());
  const { dark, toggleDark } = useDarkMode();
  const { i18n } = useTranslation();
  const currentLang = (i18n.language?.split("-")[0] ?? "es") as SupportedLanguage;
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
      setEmail(data.user?.email ?? "");
    });
  }, []);

  useQuery({
    enabled: !!userId,
    queryKey: ["profile", userId],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", userId!)
        .maybeSingle();
      if (data?.display_name) setDisplayName(data.display_name);
      return data;
    },
  });

  useQuery({
    enabled: !!userId,
    queryKey: ["fin", userId],
    queryFn: async () => {
      const { data } = await supabase
        .from("financial_profiles")
        .select("currency")
        .eq("user_id", userId!)
        .maybeSingle();
      if (data?.currency) setCurrency(data.currency);
      return data;
    },
  });

  const saveProfile = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("profiles")
        .upsert({ id: userId, display_name: displayName });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
      toast.success("Perfil actualizado");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Error al guardar"),
  });

  const saveCurrency = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("financial_profiles")
        .upsert({ user_id: userId, currency });
      if (error) throw error;
    },
    onSuccess: () => {
      setStoredCurrency(currency);
      queryClient.invalidateQueries({ queryKey: ["fin", userId] });
      toast.success("Moneda actualizada");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Error al guardar"),
  });

  const changePassword = useMutation({
    mutationFn: async () => {
      if (newPassword.length < 8)
        throw new Error("La contraseña debe tener al menos 8 caracteres.");
      if (newPassword !== confirmPassword) throw new Error("Las contraseñas no coinciden.");
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
    },
    onSuccess: () => {
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Contraseña actualizada");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Error al cambiar la contraseña"),
  });

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background text-foreground"
    >
      <header className="border-b border-border/10 bg-background/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 md:px-8 h-14 flex items-center justify-between">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground truncate max-w-[160px]">{email}</span>
            <motion.button
              onClick={signOut}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="h-8 w-8 grid place-items-center rounded-lg border border-border/20 hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-8">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
            Configuración
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Personalizá tu experiencia en Breezkit
          </p>
        </div>

        {/* Profile */}
        <section className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center gap-3">
            <span className="h-9 w-9 rounded-lg bg-primary/10 grid place-items-center">
              <User className="h-5 w-5 text-primary" />
            </span>
            <div>
              <h2 className="font-semibold text-sm">Perfil</h2>
              <p className="text-xs text-muted-foreground">Tu nombre público en el dashboard</p>
            </div>
          </div>
          <div className="flex gap-3">
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Tu nombre"
              className="flex-1 rounded-lg border border-input bg-card px-4 py-2.5 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary/40 transition-colors"
            />
            <motion.button
              onClick={() => saveProfile.mutate()}
              disabled={saveProfile.isPending}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2.5 text-sm font-medium disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              Guardar
            </motion.button>
          </div>
        </section>

        {/* Currency */}
        <section className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center gap-3">
            <span className="h-9 w-9 rounded-lg bg-primary/10 grid place-items-center">
              <Coins className="h-5 w-5 text-primary" />
            </span>
            <div>
              <h2 className="font-semibold text-sm">Moneda</h2>
              <p className="text-xs text-muted-foreground">Moneda principal para tus finanzas</p>
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="flex-1 rounded-lg border border-input bg-card px-4 py-2.5 text-sm focus:outline-none focus:border-primary/40 transition-colors"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label}
                </option>
              ))}
            </select>
            <motion.button
              onClick={() => saveCurrency.mutate()}
              disabled={saveCurrency.isPending}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2.5 text-sm font-medium disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              Guardar
            </motion.button>
          </div>
        </section>

        {/* Theme */}
        <section className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center gap-3">
            <span className="h-9 w-9 rounded-lg bg-primary/10 grid place-items-center">
              <Palette className="h-5 w-5 text-primary" />
            </span>
            <div>
              <h2 className="font-semibold text-sm">Apariencia</h2>
              <p className="text-xs text-muted-foreground">Alterná entre tema claro y oscuro</p>
            </div>
          </div>
          <button
            onClick={toggleDark}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm hover:bg-muted transition-colors"
          >
            <span className="h-4 w-4">{dark ? "☀️" : "🌙"}</span>
            {dark ? "Modo claro" : "Modo oscuro"}
          </button>
        </section>

        {/* Language */}
        <section className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center gap-3">
            <span className="h-9 w-9 rounded-lg bg-primary/10 grid place-items-center">
              <Globe className="h-5 w-5 text-primary" />
            </span>
            <div>
              <h2 className="font-semibold text-sm">Idioma</h2>
              <p className="text-xs text-muted-foreground">Idioma de la interfaz</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => switchLanguage(lang.code)}
                className={`flex items-center gap-2.5 rounded-lg border px-4 py-2.5 text-sm transition-colors ${
                  currentLang === lang.code
                    ? "border-primary/40 bg-primary/5 text-foreground font-medium"
                    : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <span className="text-base leading-none">{lang.flag}</span>
                {lang.label}
              </button>
            ))}
          </div>
        </section>

        {/* Security */}
        <section className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center gap-3">
            <span className="h-9 w-9 rounded-lg bg-primary/10 grid place-items-center">
              <Lock className="h-5 w-5 text-primary" />
            </span>
            <div>
              <h2 className="font-semibold text-sm">Seguridad</h2>
              <p className="text-xs text-muted-foreground">Cambiá tu contraseña</p>
            </div>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              changePassword.mutate();
            }}
            className="space-y-3"
          >
            <input
              type="password"
              autoComplete="new-password"
              placeholder="Nueva contraseña (mín. 8 caracteres)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-lg border border-input bg-card px-4 py-2.5 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary/40 transition-colors"
            />
            <input
              type="password"
              autoComplete="new-password"
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg border border-input bg-card px-4 py-2.5 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary/40 transition-colors"
            />
            <button
              type="submit"
              disabled={changePassword.isPending || !newPassword || !confirmPassword}
              className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2.5 text-sm font-medium disabled:opacity-50 active:scale-[0.98] transition-all duration-200"
            >
              <Save className="h-4 w-4" />
              {changePassword.isPending ? "Guardando..." : "Actualizar contraseña"}
            </button>
          </form>
        </section>

        {/* Account */}
        <section className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center gap-3">
            <span className="h-9 w-9 rounded-lg bg-primary/10 grid place-items-center">
              <Shield className="h-5 w-5 text-primary" />
            </span>
            <div>
              <h2 className="font-semibold text-sm">Cuenta</h2>
              <p className="text-xs text-muted-foreground">Información de tu cuenta</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium">{email}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Moneda actual</span>
              <span className="font-medium">
                {CURRENCIES.find((c) => c.code === currency)?.label ?? currency}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Versión</span>
              <span className="font-medium">1.0.0</span>
            </div>
          </div>
        </section>
      </main>
    </motion.div>
  );
}
