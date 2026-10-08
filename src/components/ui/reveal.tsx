"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Scroll-triggered reveal wrapper.
 * Uses IntersectionObserver to apply a CSS animation when the element enters the viewport.
 * Respects prefers-reduced-motion.
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
  threshold = 0.15,
  immediate = false,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
  /** Paint visible on first render. Use for above-the-fold content that must not wait for JS. */
  immediate?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(immediate);

  useEffect(() => {
    if (immediate) return;
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [immediate, threshold]);

  const delayClass =
    delay === 1
      ? "reveal-delay-1"
      : delay === 2
        ? "reveal-delay-2"
        : delay === 3
          ? "reveal-delay-3"
          : delay === 4
            ? "reveal-delay-4"
            : "";

  return (
    <div
      ref={ref}
      className={`${
        immediate ? "" : visible ? `reveal ${delayClass}` : "opacity-0"
      } ${className}`.trim()}
    >
      {children}
    </div>
  );
}
