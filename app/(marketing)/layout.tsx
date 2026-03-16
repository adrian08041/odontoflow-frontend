import Link from "next/link";
import { Phone } from "lucide-react";

const navLinks = [
  { label: "Inicio", href: "#inicio" },
  { label: "Servicos", href: "#servicos" },
  { label: "Equipe", href: "#equipe" },
  { label: "Depoimentos", href: "#depoimentos" },
  { label: "Contato", href: "#contato" },
];

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#fcfdfd]">
      <header className="sticky top-0 z-50 border-b border-[#e6edf2] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5 lg:px-8">
          <Link href="#inicio" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0e9e95] text-white shadow-[0_10px_20px_rgba(14,158,149,0.22)]">
              <span className="text-lg font-black">O</span>
            </div>
            <span className="text-3xl font-black tracking-tight text-[#0c1d46]">
              Odonto<span className="text-[#0e9e95]">Clinic</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} className="text-base font-semibold text-[#0c1d46] transition hover:text-[#0e9e95]">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-8 lg:flex">
            <div className="flex items-center gap-3 text-[#0e9e95]">
              <Phone className="h-5 w-5" />
              <span className="text-lg font-bold text-[#0c1d46]">(11) 99999-9999</span>
            </div>
            <Link href="/login" className="text-base font-bold text-[#0c1d46] transition hover:text-[#0e9e95]">
              Faca login
            </Link>
            <Link
              href="/cadastro"
              className="inline-flex items-center justify-center rounded-full bg-[#0e9e95] px-7 py-3 text-base font-extrabold text-white shadow-[0_12px_24px_rgba(14,158,149,0.22)] transition hover:bg-[#0c8c84]"
            >
              Agendar Consulta
            </Link>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-[#e6edf2] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-center lg:flex-row lg:px-8 lg:text-left">
          <p className="text-sm font-medium text-[#6b7a93]">© 2026 OdontoClinic. Todos os direitos reservados.</p>
          <div className="flex items-center gap-6 text-sm font-semibold text-[#6b7a93]">
            <Link href="#inicio" className="hover:text-[#0e9e95]">
              Voltar ao topo
            </Link>
            <Link href="#contato" className="hover:text-[#0e9e95]">
              Fale conosco
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
