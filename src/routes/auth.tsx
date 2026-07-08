import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { BreezkitMark } from "@/components/brand/logo";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { checkAuthRateLimit } from "@/lib/auth-check.server";
import confetti from "canvas-confetti";
import { Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/auth")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) throw redirect({ to: "/dashboard" });
  },
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<{ text: string; tone: "error" | "success" } | null>(null);
  const [emailNotConfirmed, setEmailNotConfirmed] = useState(false);
  const setError = (text: string | null) => setNotice(text ? { text, tone: "error" } : null);
  const setSuccess = (text: string) => setNotice({ text, tone: "success" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setEmailNotConfirmed(false);
    setLoading(true);
    try {
      const limit = await checkAuthRateLimit();
      if (limit.blocked) {
        throw new Error("rate_limit");
      }
      if (mode === "signup") {
        const displayName =
          name
            .replace(/<[^>]*>/g, "")
            .replace(/[<>]/g, "")
            .replace(/javascript:/gi, "")
            .replace(/on\w+=/gi, "")
            .trim()
            .slice(0, 100) || email.split("@")[0];
        const { error, data } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: displayName },
            emailRedirectTo: window.location.origin + "/dashboard",
          },
        });
        if (error) throw error;
        if (data.session) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#D97757", "#C15F3C", "#D4A27F", "#AE5630"],
          });
          navigate({ to: "/dashboard" });
          return;
        }
        setSuccess("Revisá tu bandeja de entrada y confirmá tu email para iniciar sesión.");
        return;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/dashboard" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      if (message.includes("Email not confirmed")) {
        setError("Revisa tu bandeja de entrada y confirma tu email.");
        setEmailNotConfirmed(true);
      } else if (message.includes("rate_limit")) {
        setError("Demasiados intentos. Espera unos minutos e intenta de nuevo.");
      } else {
        setError("Email o contraseña incorrectos.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError("Ingresá tu email primero.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/dashboard",
      });
      if (error) throw error;
      setSuccess("Te enviamos un email para restablecer tu contraseña.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al enviar el email.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!email) {
      setError("Ingresá tu email primero.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
      });
      if (error) throw error;
      setSuccess("Revisá tu bandeja de entrada. Te reenviamos el email de confirmación.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al reenviar el email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex"
      style={{ background: "var(--gradient-hero)" }}
    >
      <div className="hidden lg:flex flex-1 flex-col justify-between p-6 text-foreground">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link to="/" className="flex items-center gap-2 group">
            <motion.span whileHover={{ rotate: 8 }} className="inline-flex">
              <BreezkitMark className="h-8 w-8" />
            </motion.span>
            <span className="font-display font-bold text-lg">Breezkit</span>
          </Link>
        </motion.div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="font-display text-4xl font-bold leading-tight max-w-md text-foreground">
            Asesoría financiera con IA, pensada para vos.
          </h2>
          <p className="mt-4 text-muted-foreground max-w-md">
            Registra tus datos, conversa con tu asesor inteligente y recibe recomendaciones
            personalizadas de ahorro e inversión.
          </p>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-muted-foreground/70"
        >
          © 2026 Breezkit
        </motion.p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          <div className="mb-8 lg:hidden flex items-center gap-2">
            <BreezkitMark className="h-8 w-8" />
            <span className="font-display font-bold text-lg text-foreground">Breezkit</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            {mode === "signin" ? "Iniciar sesión" : "Crear cuenta"}
          </h1>
          <p className="mt-2 text-muted-foreground text-sm">
            {mode === "signin"
              ? "Bienvenido de vuelta."
              : "Empieza a tomar mejores decisiones financieras."}
          </p>

          <form onSubmit={submit} className="mt-8 space-y-3">
            {mode === "signup" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <input
                  type="text"
                  placeholder="Tu nombre"
                  maxLength={100}
                  autoComplete="name"
                  aria-label="Nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground"
                />
              </motion.div>
            )}
            <input
              type="email"
              required
              placeholder="tu@email.com"
              autoComplete="email"
              inputMode="email"
              aria-label="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                placeholder="Contraseña (mín. 8 caracteres)"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                spellCheck={false}
                autoCapitalize="off"
                aria-label="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                aria-pressed={showPassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {mode === "signin" && (
              <button
                type="button"
                onClick={handleResetPassword}
                className="text-xs text-muted-foreground hover:text-foreground underline-offset-2 hover:underline transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </button>
            )}

            {notice && (
              <motion.div
                role={notice.tone === "error" ? "alert" : "status"}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-sm rounded-xl px-4 py-2 space-y-2 border ${
                  notice.tone === "error"
                    ? "text-destructive bg-destructive/10 border-destructive/20"
                    : "text-success bg-success/10 border-success/20"
                }`}
              >
                <p>{notice.text}</p>
                {emailNotConfirmed && (
                  <button
                    type="button"
                    onClick={handleResendConfirmation}
                    className="text-xs font-medium underline underline-offset-2 hover:text-destructive/80 transition-colors"
                  >
                    Reenviar email de confirmación
                  </button>
                )}
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={!loading ? { scale: 1.01 } : {}}
              whileTap={!loading ? { scale: 0.99 } : {}}
              className="w-full rounded-xl bg-primary text-primary-foreground py-3 font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all disabled:opacity-50"
            >
              {loading
                ? mode === "signin"
                  ? "Iniciando sesión…"
                  : "Creando cuenta…"
                : mode === "signin"
                  ? "Iniciar sesión"
                  : "Crear cuenta"}
            </motion.button>
          </form>

          <p className="mt-6 text-sm text-muted-foreground text-center">
            {mode === "signin" ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
            <button
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="text-foreground font-medium hover:text-primary transition-colors"
            >
              {mode === "signin" ? "Crear una" : "Iniciar sesión"}
            </button>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
