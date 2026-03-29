"use client";

import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  end: number;
  duration?: number;
  suffix?: string;
  className?: string;
  formatBR?: boolean;
}

function formatNumber(n: number, br: boolean) {
  if (!br) return String(n);
  return n.toLocaleString("pt-BR");
}

export function CountUp({
  end,
  duration = 2.2,
  suffix = "",
  className,
  formatBR = false,
}: CountUpProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;

          const startTime = performance.now();
          const durationMs = duration * 1000;

          function tick(now: number) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / durationMs, 1);
            // ease-out quart for smoother deceleration
            const eased = 1 - Math.pow(1 - progress, 4);
            setCount(Math.round(eased * end));

            if (progress < 1) {
              requestAnimationFrame(tick);
            }
          }

          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <span ref={ref} className={className}>
      {formatNumber(count, formatBR)}
      {suffix}
    </span>
  );
}
