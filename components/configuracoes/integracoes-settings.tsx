import { MessageCircle, Zap, CreditCard, ExternalLink, Plus, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const integrations = [
    {
        name: "WhatsApp (UAZAPI)",
        description: "Envio automático de lembretes e confirmações.",
        status: "CONECTADO",
        icon: MessageCircle,
        color: "text-success-text",
        connected: true,
    },
    {
        name: "n8n Automation",
        description: "Integração de fluxos de trabalho e dados.",
        status: "CONECTADO",
        icon: Zap,
        color: "text-danger-text",
        connected: true,
    },
    {
        name: "Gateway de Pagamento",
        description: "Processamento de cartões e boletos direto no app.",
        status: "PENDENTE",
        icon: CreditCard,
        color: "text-blue-500",
        connected: false,
    },
];

export function IntegracoesSettings() {
    return (
        <div className="bg-white rounded-[14px] border border-border-light shadow-sm p-4 sm:p-6 md:p-8 w-full overflow-hidden">
            <div className="mb-6 md:mb-8">
                <h2 className="text-[18px] sm:text-[20px] font-bold text-text-primary leading-[28px]">
                    Ecossistema de Integrações
                </h2>
                <p className="text-[14px] text-text-tertiary font-medium mt-1">
                    Conecte o OdontoFlow com as suas ferramentas favoritas.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {integrations.map((integration, idx) => {
                    const Icon = integration.icon;

                    return (
                        <div
                            key={idx}
                            className="flex flex-col border border-border-light rounded-[24px] p-6 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.02)] transition-shadow bg-white"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className={cn("w-[52px] h-[52px] rounded-full border border-border-light flex items-center justify-center bg-white shadow-sm", integration.color)}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <span
                                    className={cn(
                                        "flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider",
                                        integration.connected
                                            ? "bg-success-bg text-success-text border-success-border"
                                            : "bg-amber-50 text-amber-600 border-amber-100"
                                    )}
                                >
                                    {integration.connected ? <CheckCircle2 className="w-[14px] h-[14px]" /> : <AlertCircle className="w-[14px] h-[14px]" />}
                                    {integration.status}
                                </span>
                            </div>
                            <h3 className="text-[18px] font-bold text-text-primary mb-1">
                                {integration.name}
                            </h3>
                            <p className="text-[14px] font-medium text-text-tertiary mb-6 flex-1 line-clamp-2">
                                {integration.description}
                            </p>
                            <Button variant="outline" className="w-full rounded-full border-border-light text-[13px] font-semibold text-text-secondary hover:bg-background-card">
                                Configurar Integração
                                <ExternalLink className="w-[14px] h-[14px] ml-2 text-text-muted" />
                            </Button>
                        </div>
                    );
                })}

                {/* Marketplace Card Placeholder */}
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-border-light rounded-[24px] p-6 bg-background-card/50 hover:bg-background-card transition-colors cursor-pointer text-center min-h-[268px]">
                    <div className="w-[52px] h-[52px] bg-background-hover rounded-full flex items-center justify-center mb-6">
                        <Plus className="w-6 h-6 text-text-muted" />
                    </div>
                    <h3 className="text-[18px] font-bold text-text-muted mb-1">
                        Explorar Marketplace
                    </h3>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                        Breve: Novas conexões
                    </p>
                </div>
            </div>
        </div>
    );
}
