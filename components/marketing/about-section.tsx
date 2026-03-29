import { Check } from "lucide-react";
import { highlights } from "@/components/marketing/landing-data";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";
import { CountUp } from "@/components/marketing/count-up";

export function AboutSection() {
  return (
    <section id="sobre" className="bg-[var(--color-surface-canvas-soft)] py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <ScrollReveal direction="left">
          <div className="relative">
            <div className="overflow-hidden rounded-[2rem] bg-[var(--color-surface-muted)] shadow-[0_22px_48px_rgba(var(--shadow-marketing-rgb),0.10)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&auto=format&fit=crop&q=80"
                alt="Dentista sorrindo em consultório moderno"
                className="h-[430px] w-full object-cover"
              />
            </div>
          </div>
        </ScrollReveal>

        <div>
          <ScrollReveal direction="right">
            <h2 className="text-3xl font-black leading-tight text-[var(--color-ink-strong)] md:text-4xl">
              Por que escolher a OdontoFlow?
            </h2>
            <p className="mt-5 text-lg leading-8 text-[var(--color-text-section)]">
              Combinamos tecnologia de ponta com um ambiente acolhedor para
              proporcionar a melhor experiência odontológica possível.
            </p>
          </ScrollReveal>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {highlights.map((item, index) => (
              <ScrollReveal key={item} delay={index * 100} direction="right">
                <div className="flex items-center gap-4 rounded-2xl bg-white/90 p-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-surface-highlight)] text-[var(--color-brand-teal)]">
                    <Check className="h-5 w-5" />
                  </div>
                  <span className="text-base font-bold text-[var(--color-ink-strong)]">
                    {item}
                  </span>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal delay={200}>
            <div className="mt-12 border-t border-[var(--color-border-marketing)] pt-10">
              <div className="grid gap-8 sm:grid-cols-3">
                <div className="text-center">
                  <p className="text-4xl font-extrabold text-[var(--color-brand-teal)]">
                    <CountUp end={10} suffix="+" />
                  </p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-text-muted-alt)]">
                    Anos de Experiência
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-extrabold text-[var(--color-brand-teal)]">
                    <CountUp end={5000} suffix="+" formatBR />
                  </p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-text-muted-alt)]">
                    Pacientes Felizes
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-extrabold text-[var(--color-brand-teal)]">
                    <CountUp end={15000} suffix="+" formatBR />
                  </p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-text-muted-alt)]">
                    Procedimentos
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
