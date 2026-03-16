import type { ComponentType } from "react";
import { Activity, Lock, ShieldCheck } from "lucide-react";

function PrivacyItem({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[22px] border border-[#e5ebf4] bg-[#f9fbfe] px-5 py-5">
      <div className="flex items-center gap-4">
        <Icon className="h-5 w-5 shrink-0 text-[#91a0bd]" />
        <div>
          <p className="text-[16px] font-black text-[#0f274c]">{title}</p>
          <p className="text-[14px] font-medium text-[#6b7d99]">{description}</p>
        </div>
      </div>

      <div className="relative inline-flex h-7 w-12 shrink-0 items-center rounded-full bg-[#0e9e95]">
        <span className="inline-block h-5 w-5 translate-x-6 rounded-full bg-white" />
      </div>
    </div>
  );
}

export function LGPDSettings() {
  return (
    <div className="overflow-hidden rounded-[30px] border border-[#dfe6f2] bg-white shadow-[0_8px_24px_rgba(15,39,76,0.06)]">
      <div className="px-6 py-8 md:px-12 md:py-12">
        <div className="mb-10 flex flex-col gap-4 rounded-[28px] border border-[#c5f0dd] bg-[#effdf8] p-6 md:flex-row md:items-start md:p-8">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] bg-[#cbf7e5] text-[#00a56d]">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-[20px] font-black text-[#00684f] md:text-[22px]">Sua Clinica esta Protegida</h2>
            <p className="mt-2 max-w-4xl text-[15px] font-medium leading-8 text-[#00745d]">
              O OdontoFlow segue rigorosamente as diretrizes da Lei Geral de Protecao de Dados (LGPD). Todos os
              dados sensiveis dos pacientes sao criptografados e o acesso e auditado.
            </p>
          </div>
        </div>

        <h3 className="mb-5 text-[18px] font-black text-[#0f274c]">Controle de Privacidade</h3>

        <div className="space-y-4">
          <PrivacyItem
            title="Criptografia de Ponta-a-Ponta"
            description="Ativado para todos os prontuarios e exames."
            icon={Lock}
          />
          <PrivacyItem
            title="Logs de Auditoria"
            description="Registrar quem acessou cada dado de paciente."
            icon={Activity}
          />
        </div>
      </div>
    </div>
  );
}
