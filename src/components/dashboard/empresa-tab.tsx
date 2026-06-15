import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { inputCls } from "./shared";

export function EmpresaTab() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ company: "", name: "", email: "", team_size: "", message: "" });
  const features = [
    {
      icon: "👥",
      title: "Equipos ilimitados",
      desc: "Sumá colaboradores, asigná roles y reportá por unidad de negocio.",
    },
    {
      icon: "📊",
      title: "Reportes consolidados",
      desc: "Visualiza flujo de caja, presupuestos y desvíos a nivel empresa.",
    },
    {
      icon: "🔐",
      title: "Seguridad empresarial",
      desc: "SSO, auditoría de accesos y respaldo diario de datos.",
    },
    {
      icon: "🤖",
      title: "IA dedicada",
      desc: "Modelos entrenados con tu industria y políticas internas.",
    },
    {
      icon: "📑",
      title: "Exportación contable",
      desc: "Conexión directa con sistemas contables y exportación a Excel/CSV.",
    },
    {
      icon: "🎯",
      title: "Onboarding asistido",
      desc: "Un especialista te ayuda a migrar e implementar Breezkit.",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from("contact_requests").insert({
        company: form.company.trim(),
        name: form.name.trim(),
        email: form.email.trim(),
        team_size: form.team_size,
        message: form.message.trim(),
      });
      if (error) throw error;
      setSent(true);
      toast.success("Solicitud enviada");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al enviar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-8">
      <div className="border-2 border-border bg-[var(--navy-deep)] text-white p-6 md:p-10 shadow-[10px_10px_0_var(--primary)]">
        <div className="inline-block border-2 border-white bg-primary text-primary-foreground text-xs font-black uppercase tracking-[0.18em] px-3 py-1">
          Plan Empresa
        </div>
        <h2 className="mt-5 font-display text-4xl md:text-6xl font-black leading-[0.92]">
          Lleva Breezkit a tu equipo o empresa.
        </h2>
        <p className="mt-4 text-sm md:text-base text-[#ffd9a3] max-w-2xl font-medium leading-relaxed">
          Centralizá las finanzas de tu negocio, dale visibilidad a tus equipos y aprovechá la IA
          contextual para tomar mejores decisiones.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((f) => (
          <div key={f.title} className="bg-card p-5">
            <div className="text-2xl">{f.icon}</div>
            <h3 className="mt-2 font-display text-xl font-black">{f.title}</h3>
            <p className="mt-1 text-sm font-medium text-muted-foreground leading-relaxed">
              {f.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-card p-6 md:p-8 max-w-3xl">
        <h3 className="font-display text-3xl font-black">Solicitar información</h3>
        <p className="text-sm font-medium text-muted-foreground mt-2">
          Contanos sobre tu empresa y un especialista te contactará en menos de 24 h.
        </p>
        {sent ? (
          <div className="mt-5 border-2 border-border bg-secondary text-secondary-foreground p-4 text-sm font-bold shadow-[5px_5px_0_var(--foreground)]">
            Solicitud recibida. Te contactaremos pronto.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 grid sm:grid-cols-2 gap-3">
            <input
              required
              placeholder="Empresa"
              className={inputCls}
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
            />
            <input
              required
              placeholder="Tu nombre"
              className={inputCls}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              required
              type="email"
              placeholder="Email corporativo"
              className={inputCls}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <select
              className={inputCls}
              value={form.team_size}
              onChange={(e) => setForm({ ...form, team_size: e.target.value })}
              required
            >
              <option value="" disabled>Tamaño del equipo</option>
              <option value="1-10">1-10</option>
              <option value="11-50">11-50</option>
              <option value="51-200">51-200</option>
              <option value="+200">+200</option>
            </select>
            <textarea
              placeholder="Contanos qué necesitás (opcional)"
              maxLength={500}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="sm:col-span-2 min-h-[80px] rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="submit"
              disabled={loading}
              className="sm:col-span-2 rounded-full bg-primary text-primary-foreground py-2.5 font-medium hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Enviando..." : "Enviar solicitud"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
