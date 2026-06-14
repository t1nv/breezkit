import { useState } from "react";
import { toast } from "sonner";
import { inputCls } from "./shared";

export function EmpresaTab() {
  const [sent, setSent] = useState(false);
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
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
              toast.success("Solicitud enviada");
            }}
            className="mt-5 grid sm:grid-cols-2 gap-3"
          >
            <input required placeholder="Empresa" className={inputCls} />
            <input required placeholder="Tu nombre" className={inputCls} />
            <input required type="email" placeholder="Email corporativo" className={inputCls} />
            <select className={inputCls} defaultValue="">
              <option value="" disabled>
                Tamaño del equipo
              </option>
              <option>1-10</option>
              <option>11-50</option>
              <option>51-200</option>
              <option>+200</option>
            </select>
            <textarea
              placeholder="Contanos qué necesitás (opcional)"
              maxLength={500}
              className="sm:col-span-2 min-h-[80px] rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="submit"
              className="sm:col-span-2 rounded-full bg-primary text-primary-foreground py-2.5 font-medium hover:opacity-90 transition"
            >
              Enviar solicitud
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
