import { MoreHorizontal, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const teamMembers = [
  {
    name: "Dra. Ana Silva",
    status: "ativo no sistema",
    role: "Administrador",
    initials: "AS",
    accent: "bg-[linear-gradient(135deg,#e8fbf7_0%,#ffffff_100%)] text-[#0e9e95]",
    badge: "bg-[#e7faf5] text-[#0e9e95]",
  },
  {
    name: "Dr. Lucas Ferraz",
    status: "ativo no sistema",
    role: "Dentista",
    initials: "LF",
    accent: "bg-[linear-gradient(135deg,#eef3ff_0%,#ffffff_100%)] text-[#5970ff]",
    badge: "bg-[#eff1ff] text-[#5970ff]",
  },
  {
    name: "Mariana Santos",
    status: "ativo no sistema",
    role: "Recepcionista",
    initials: "MS",
    accent: "bg-[linear-gradient(135deg,#fff4e9_0%,#ffffff_100%)] text-[#ff9800]",
    badge: "bg-[#fff4e5] text-[#ff9800]",
  },
];

export function EquipeSettings() {
  return (
    <div className="overflow-hidden rounded-[30px] border border-[#dfe6f2] bg-white shadow-[0_8px_24px_rgba(15,39,76,0.06)]">
      <div className="flex flex-col justify-between gap-5 border-b border-[#eef2f8] px-6 py-8 md:flex-row md:items-center md:px-12">
        <div>
          <h2 className="text-[20px] font-black text-[#0f274c] md:text-[22px]">Gestao de Equipe</h2>
          <p className="mt-1 text-[15px] font-medium text-[#5f7091]">Controle os usuarios e niveis de acesso ao sistema.</p>
        </div>
        <Button className="h-11 rounded-[16px] bg-[#0e9e95] px-6 text-[15px] font-bold text-white shadow-[0_12px_24px_rgba(14,158,149,0.22)] hover:bg-[#0c8d85]">
          <UserPlus className="mr-2 h-4 w-4" />
          Novo Usuario
        </Button>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[720px]">
          <div className="grid grid-cols-[1.5fr_1fr_110px] gap-4 border-b border-[#eef2f8] px-6 py-5 text-[12px] font-black uppercase tracking-[0.16em] text-[#93a0bd] md:px-12">
            <span>Colaborador</span>
            <span>Cargo / Permissao</span>
            <span className="text-right">Acoes</span>
          </div>

          {teamMembers.map((member) => (
            <div key={member.name} className="grid grid-cols-[1.5fr_1fr_110px] gap-4 border-b border-[#f1f4f9] px-6 py-6 last:border-b-0 md:px-12">
              <div className="flex items-center gap-4">
                <Avatar className={`h-12 w-12 border border-[#e1e8f2] ${member.accent}`}>
                  <AvatarFallback className={`text-sm font-black ${member.accent}`}>{member.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-[16px] font-black text-[#0f274c]">{member.name}</p>
                  <p className="text-[14px] font-medium text-[#6b7d99]">{member.status}</p>
                </div>
              </div>

              <div className="flex items-center">
                <span className={`rounded-full px-3 py-1 text-[12px] font-black uppercase tracking-[0.06em] ${member.badge}`}>
                  {member.role}
                </span>
              </div>

              <div className="flex items-center justify-end">
                <button type="button" className="rounded-full p-2 text-[#a6b1c5] transition hover:bg-[#f5f8fc] hover:text-[#5f7091]">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
