"use client";

import { useState } from "react";
import {
  Building2,
  Clock3,
  Globe,
  Layers3,
  ShieldCheck,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ClinicaSettings } from "@/components/configuracoes/clinica-settings";
import { EquipeSettings } from "@/components/configuracoes/equipe-settings";
import { HorariosSettings } from "@/components/configuracoes/horarios-settings";
import { ConveniosSettings } from "@/components/configuracoes/convenios-settings";
import { IntegracoesSettings } from "@/components/configuracoes/integracoes-settings";
import { LGPDSettings } from "@/components/configuracoes/lgpd-settings";

const menuItems = [
  { id: "clinica", label: "Clinica", icon: Building2 },
  { id: "equipe", label: "Equipe", icon: Users },
  { id: "horarios", label: "Horarios", icon: Clock3 },
  { id: "convenios", label: "Convenios", icon: Layers3 },
  { id: "integracoes", label: "Integracoes", icon: Globe },
  { id: "lgpd", label: "LGPD", icon: ShieldCheck },
];

export function SettingsContent() {
  const [activeTab, setActiveTab] = useState("clinica");

  const renderContent = () => {
    switch (activeTab) {
      case "clinica":
        return <ClinicaSettings />;
      case "equipe":
        return <EquipeSettings />;
      case "horarios":
        return <HorariosSettings />;
      case "convenios":
        return <ConveniosSettings />;
      case "integracoes":
        return <IntegracoesSettings />;
      case "lgpd":
        return <LGPDSettings />;
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 px-1 py-2 min-w-0">
      <h1 className="text-[28px] font-black tracking-tight text-[#0f274c]">Configuracoes</h1>

      <div className="flex flex-col items-start gap-8 xl:flex-row">
        <aside className="w-full xl:w-[260px] xl:shrink-0">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "flex items-center gap-3 rounded-[18px] px-5 py-4 text-left text-[15px] font-bold transition-all",
                    isActive
                      ? "bg-[#0e9e95] text-white shadow-[0_14px_28px_rgba(14,158,149,0.22)]"
                      : "text-[#6f7f9b] hover:bg-white hover:text-[#0f274c]"
                  )}
                >
                  <Icon className={cn("h-5 w-5", isActive ? "text-white" : "text-[#7485a5]")} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="w-full min-w-0 flex-1">{renderContent()}</div>
      </div>
    </div>
  );
}
