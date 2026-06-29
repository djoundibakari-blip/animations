"use client";

import { useEffect, useRef, ReactNode } from "react";

type Variant = "sr" | "sr-fade" | "sr-line" | "sr-clip" | "sr-counter";

export default function ScrollReveal({
  children,
  variant = "sr",
  delay = 0,
  className = "",
}: {
  children?: ReactNode;
  variant?: Variant;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("in");
          io.unobserve(el);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -48px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${variant} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {variant === "sr-clip" ? (
        <span className="clip-inner">{children}</span>
      ) : (
        children
      )}
    </div>
  );
}
