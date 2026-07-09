import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

export function BackgroundDecor() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const blobA = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, 120]);
  const blobB = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, -120]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "var(--gradient-soft)" }} />
      <motion.div
        style={{ y: blobA }}
        className="absolute -top-48 left-1/4 h-[500px] w-[500px] rounded-full bg-[#D97757]/10 blur-[150px]"
      />
      <motion.div
        style={{ y: blobB }}
        className="absolute -bottom-48 right-1/4 h-[400px] w-[400px] rounded-full bg-[#D4A27F]/10 blur-[120px]"
      />
    </div>
  );
}
