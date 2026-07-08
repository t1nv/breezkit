import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BreezkitMark } from "@/components/brand/logo";

const ONBOARDED_KEY = "bk-onboarded";

/** True when the profile still has the auto-generated name (email prefix) or none at all. */
export function needsOnboarding(displayName: string | null | undefined, email: string) {
  if (typeof localStorage !== "undefined" && localStorage.getItem(ONBOARDED_KEY)) return false;
  const autoName = email.split("@")[0];
  return !displayName || displayName.trim() === "" || displayName === autoName;
}

export function WelcomeDialog({ userId, email }: { userId: string; email: string }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(true);
  const [name, setName] = useState("");

  const save = useMutation({
    mutationFn: async () => {
      const clean = name.trim().slice(0, 100);
      if (!clean) throw new Error("Ingresá tu nombre para continuar.");
      const { error } = await supabase.from("profiles").upsert({ id: userId, display_name: clean });
      if (error) throw error;
    },
    onSuccess: () => {
      localStorage.setItem(ONBOARDED_KEY, "1");
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
      setOpen(false);
      confetti({
        particleCount: 90,
        spread: 65,
        origin: { y: 0.5 },
        colors: ["#D97757", "#C15F3C", "#D4A27F", "#AE5630"],
      });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "No se pudo guardar."),
  });

  const skip = () => {
    localStorage.setItem(ONBOARDED_KEY, "1");
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 grid place-items-center bg-black/40 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-elevated)]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="welcome-title"
          >
            <BreezkitMark className="h-11 w-11" />
            <h2 id="welcome-title" className="mt-5 font-display text-2xl font-bold text-foreground">
              ¡Bienvenido a <span className="text-primary italic">Breezkit</span>!
            </h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Tu asesor financiero personal con IA. Antes de empezar, contanos cómo te llamás para
              darte una experiencia más personal.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                save.mutate();
              }}
              className="mt-6 space-y-3"
            >
              <label htmlFor="welcome-name" className="block text-xs font-medium text-foreground">
                Tu nombre
              </label>
              <input
                id="welcome-name"
                autoFocus
                type="text"
                maxLength={100}
                placeholder="Ej: Valentino"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              />
              <button
                type="submit"
                disabled={save.isPending || !name.trim()}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-3 text-sm font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:active:scale-100"
              >
                {save.isPending ? "Guardando..." : "Comenzar"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <button
              onClick={skip}
              className="mt-4 w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Ahora no
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
