import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { BackgroundDecor } from "@/components/landing/decor";
import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { StatsBar } from "@/components/landing/stats-bar";
import { UseCases } from "@/components/landing/use-cases";
import { Integrations } from "@/components/landing/integrations";
import { Security } from "@/components/landing/security";
import { Comparison } from "@/components/landing/comparison";
import { Pricing } from "@/components/landing/pricing";
import { DashboardPreview } from "@/components/landing/dashboard-preview";
import { FAQ } from "@/components/landing/faq";
import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Breezkit — Asesor Financiero con IA" },
      {
        name: "description",
        content:
          "Plataforma financiera con IA: controla tu dinero, ahorra inteligente e invierte segun tu perfil.",
      },
      { property: "og:title", content: "Breezkit — Asesor Financiero con IA" },
      {
        property: "og:description",
        content: "Decisiones financieras claras impulsadas por IA.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.98]);

  return (
    <div className="min-h-screen bg-background text-foreground antialiased overflow-x-hidden">
      <BackgroundDecor />
      <Header />
      <main>
        <motion.div style={{ opacity: heroOpacity, scale: heroScale }}>
          <Hero />
        </motion.div>
        <Features />
        <HowItWorks />
        <StatsBar />
        <UseCases />
        <Integrations />
        <Security />
        <Comparison />
        <Pricing />
        <DashboardPreview />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
