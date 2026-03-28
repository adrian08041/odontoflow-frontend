import { teamMembers } from "@/components/marketing/landing-data";
import { SectionTitle } from "@/components/marketing/section-title";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";

export function TeamSection() {
  return (
    <section id="equipe" className="bg-[var(--color-surface-section-alt)] py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal>
          <SectionTitle title="Nossa Equipe" />
        </ScrollReveal>
        <div className="grid gap-6 lg:grid-cols-3">
          {teamMembers.map((member, index) => (
            <ScrollReveal key={member.name} delay={index * 150}>
              <article className="h-full rounded-[2rem] border border-[var(--color-border-marketing)] bg-white p-8 text-center shadow-[0_10px_30px_rgba(var(--shadow-marketing-rgb),0.05)] transition hover:-translate-y-1 hover:shadow-[0_18px_34px_rgba(var(--shadow-marketing-rgb),0.08)]">
                <div className="mx-auto h-32 w-32 overflow-hidden rounded-full shadow-[0_8px_24px_rgba(var(--shadow-marketing-rgb),0.12)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="mt-8 text-4xl font-extrabold tracking-tight text-[var(--color-ink-strong)]">
                  {member.name}
                </h3>
                <p className="mt-3 text-sm font-black uppercase tracking-[0.28em] text-[var(--color-brand-teal)]">
                  {member.specialty} | {member.register}
                </p>
                <p className="mt-6 text-lg leading-8 text-[var(--color-text-soft)]">
                  {member.quote}
                </p>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
