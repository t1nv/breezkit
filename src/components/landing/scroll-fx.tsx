import { useRef, type CSSProperties, type ReactNode, type RefObject } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

/**
 * Scroll-linked y offset for an element, scrubbed over its own trip through
 * the viewport (enter at the bottom → leave at the top). Mirrors the design's
 * `data-parallax` behavior; disabled under prefers-reduced-motion.
 */
export function useParallax(ref: RefObject<HTMLElement | null>, distance: number) {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  return useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [-distance, distance]);
}

/** Decorative blur blob that drifts vertically as its section scrolls by. */
export function ParallaxBlob({
  distance,
  className,
  style,
}: {
  distance: number;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const y = useParallax(ref, distance);
  return <motion.div ref={ref} aria-hidden className={className} style={{ ...style, y }} />;
}

/**
 * Scrubbed entrance: the block scales up from slightly shrunken/tilted to
 * full size as it approaches the middle of the viewport, tied to scroll
 * position rather than time. `strong` deepens the effect (hero-scale blocks).
 */
export function ExpandOnScroll({
  strong = false,
  className,
  children,
}: {
  strong?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.96", "start 0.42"] });
  const factor = strong ? 1.35 : 1;
  const scale = useTransform(scrollYProgress, [0, 1], [Math.max(0.6, 1 - 0.1 * factor), 1]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [8 * factor, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.72, 1]);

  if (reduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        scale,
        rotateX,
        opacity,
        transformPerspective: 1400,
        transformOrigin: "50% 15%",
        willChange: "transform",
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Pointer-follow 3D tilt (the hero card cluster). Returns spring-smoothed
 * rotation values plus the handlers to attach on the tracking area.
 */
export function useTilt(areaRef: RefObject<HTMLElement | null>) {
  const reduced = useReducedMotion();
  const rotateY = useSpring(0, { stiffness: 150, damping: 22 });
  const rotateX = useSpring(0, { stiffness: 150, damping: 22 });

  const onPointerMove = (e: React.PointerEvent) => {
    const area = areaRef.current;
    if (!area || reduced || e.pointerType !== "mouse") return;
    const r = area.getBoundingClientRect();
    rotateY.set(((e.clientX - r.left) / r.width - 0.5) * 10);
    rotateX.set(-((e.clientY - r.top) / r.height - 0.5) * 8);
  };
  const onPointerLeave = () => {
    rotateY.set(0);
    rotateX.set(0);
  };

  return { rotateX, rotateY, onPointerMove, onPointerLeave };
}

/** Scrub progress of a section from "top hits viewport top" to "bottom hits top". */
export function useSectionExit(ref: RefObject<HTMLElement | null>): MotionValue<number> {
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  return scrollYProgress;
}
