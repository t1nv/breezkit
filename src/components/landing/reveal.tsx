import { useLayoutEffect, useRef, type ElementType, type ReactNode, type Ref } from "react";

/**
 * Scroll-reveal that never gates content visibility on JS:
 * SSR HTML ships fully visible; on mount, only elements still below the
 * viewport get the hidden state before being observed, so above-the-fold
 * content never flashes and crawlers/no-JS visitors see everything.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top <= window.innerHeight * 0.95) return;

    el.classList.add("is-pending");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.remove("is-pending");
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

export function Reveal({
  as: Tag = "div",
  delay = 0,
  className = "",
  children,
}: {
  as?: ElementType;
  delay?: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <Tag
      ref={ref as Ref<HTMLDivElement>}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [&.is-pending]:opacity-0 [&.is-pending]:translate-y-6 ${className}`}
    >
      {children}
    </Tag>
  );
}
