import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const convenios = [
  { name: "Unimed", icon: "U", status: "Ativo", code: "UNI-001", type: "Plano de Saude", discount: "15%", active: true, bg: "bg-[#0cca8a]", statusClass: "bg-[#e8faf2] text-[#0e9e95]" },
  { name: "Bradesco Saude", icon: "B", status: "Ativo", code: "BRA-002", type: "Plano de Saude", discount: "10%", active: true, bg: "bg-[#ff3651]", statusClass: "bg-[#e8faf2] text-[#0e9e95]" },
  { name: "Amil", icon: "A", status: "Ativo", code: "AMI-003", type: "Plano de Saude", discount: "12%", active: true, bg: "bg-[#5b74ff]", statusClass: "bg-[#e8faf2] text-[#0e9e95]" },
  { name: "SulAmerica", icon: "S", status: "Ativo", code: "SUL-004", type: "Plano de Saude", discount: "8%", active: true, bg: "bg-[#ff7a00]", statusClass: "bg-[#e8faf2] text-[#0e9e95]" },
  { name: "Porto Seguro", icon: "P", status: "Inativo", code: "POR-005", type: "Plano de Saude", discount: "10%", active: false, bg: "bg-[#7f52ff]", statusClass: "bg-[#f1f4f8] text-[#7b8aa8]" },
];

export function ConveniosSettings() {
  return (
    <div className="overflow-hidden rounded-[30px] border border-[#dfe6f2] bg-white shadow-[0_8px_24px_rgba(15,39,76,0.06)]">
      <div className="flex flex-col justify-between gap-5 border-b border-[#eef2f8] px-6 py-8 md:flex-row md:items-center md:px-12">
        <div>
          <h2 className="text-[20px] font-black text-[#0f274c] md:text-[22px]">Convenios Aceitos</h2>
          <p className="mt-1 text-[15px] font-medium text-[#5f7091]">Gerencie os planos de saude e convenios da clinica.</p>
        </div>
        <Button className="h-11 rounded-[16px] bg-[#0e9e95] px-6 text-[15px] font-bold text-white shadow-[0_12px_24px_rgba(14,158,149,0.22)] hover:bg-[#0c8d85]">
          <Plus className="mr-2 h-4 w-4" />
          Novo Convenio
        </Button>
      </div>

      <div className="space-y-4 px-6 py-8 md:px-12">
        {convenios.map((item) => (
          <div key={item.code} className="flex flex-col gap-4 rounded-[24px] border border-[#dfe6f2] bg-white px-6 py-5 shadow-[0_3px_10px_rgba(15,39,76,0.03)] md:flex-row md:items-center">
            <div className={`flex h-14 w-14 items-center justify-center rounded-[18px] text-[18px] font-black text-white shadow-[0_10px_20px_rgba(15,39,76,0.08)] ${item.bg}`}>
              {item.icon}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-[16px] font-black text-[#0f274c]">{item.name}</h3>
                <span className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] ${item.statusClass}`}>
                  {item.status}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-x-8 gap-y-2 text-[14px]">
                <div>
                  <span className="font-black uppercase tracking-[0.12em] text-[#93a0bd]">Codigo:</span>
                  <span className="ml-2 font-bold text-[#0f274c]">{item.code}</span>
                </div>
                <div>
                  <span className="font-black uppercase tracking-[0.12em] text-[#93a0bd]">Tipo:</span>
                  <span className="ml-2 font-bold text-[#0f274c]">{item.type}</span>
                </div>
                <div>
                  <span className="font-black uppercase tracking-[0.12em] text-[#93a0bd]">Desconto:</span>
                  <span className="ml-2 font-bold text-[#0e9e95]">{item.discount}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
