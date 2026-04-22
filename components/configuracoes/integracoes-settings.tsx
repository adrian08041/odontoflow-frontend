"use client";

import { useState } from "react";
import {
  Bot,
  CheckCircle2,
  CreditCard,
  ExternalLink,
  Link2,
  MessageCircle,
  MoreHorizontal,
  Pencil,
  PlugZap,
  Plus,
  Unplug,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type IntegrationCategory =
  | "Comunicação"
  | "Automação"
  | "Financeiro"
  | "Atendimento";

type Integration = {
  id: string;
  name: string;
  description: string;
  category: IntegrationCategory;
  endpoint: string;
  connected: boolean;
  status: "Conectado" | "Pendente";
  iconName: "message" | "automation" | "payment" | "assistant";
  color: string;
};

type IntegrationFormState = {
  name: string;
  description: string;
  category: IntegrationCategory;
  endpoint: string;
};

const INITIAL_INTEGRATIONS: Integration[] = [
  {
    id: "integration-1",
    name: "WhatsApp (UAZAPI)",
    description: "Envio automático de lembretes e confirmações para pacientes.",
    category: "Comunicação",
    endpoint: "https://api.uazapi.com/v1/odontoflow",
    connected: true,
    status: "Conectado",
    iconName: "message",
    color: "text-success-text",
  },
  {
    id: "integration-2",
    name: "n8n Automations",
    description: "Fluxos internos para eventos de agenda, cadastro e pós-consulta.",
    category: "Automação",
    endpoint: "https://n8n.odontoflow.com/webhook/entrada",
    connected: true,
    status: "Conectado",
    iconName: "automation",
    color: "text-danger-text",
  },
  {
    id: "integration-3",
    name: "Gateway de Pagamento",
    description: "Cobranças via cartão, PIX e conciliação financeira da clínica.",
    category: "Financeiro",
    endpoint: "https://payments.odontoflow.com/api",
    connected: false,
    status: "Pendente",
    iconName: "payment",
    color: "text-warning-text",
  },
];

const EMPTY_FORM: IntegrationFormState = {
  name: "",
  description: "",
  category: "Comunicação",
  endpoint: "",
};

function getIntegrationIcon(iconName: Integration["iconName"]) {
  if (iconName === "message") return MessageCircle;
  if (iconName === "automation") return Bot;
  if (iconName === "payment") return CreditCard;
  return PlugZap;
}

function getCategoryBadge(category: IntegrationCategory) {
  if (category === "Comunicação") return "bg-success-bg text-success-text border-success-border";
  if (category === "Automação") return "bg-danger-bg text-danger-text border-danger-border";
  if (category === "Financeiro") return "bg-warning-bg text-warning-text border-warning-border";
  return "bg-background-hover text-text-tertiary border-border-light";
}

export function IntegracoesSettings() {
  const [integrations, setIntegrations] = useState<Integration[]>(INITIAL_INTEGRATIONS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingIntegrationId, setEditingIntegrationId] = useState<string | null>(null);
  const [form, setForm] = useState<IntegrationFormState>(EMPTY_FORM);

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      setEditingIntegrationId(null);
      setForm(EMPTY_FORM);
    }

    setDialogOpen(open);
  };

  const openCreateDialog = () => {
    setEditingIntegrationId(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEditDialog = (integration: Integration) => {
    setEditingIntegrationId(integration.id);
    setForm({
      name: integration.name,
      description: integration.description,
      category: integration.category,
      endpoint: integration.endpoint,
    });
    setDialogOpen(true);
  };

  const toggleConnection = (integrationId: string) => {
    setIntegrations((current) =>
      current.map((integration) =>
        integration.id === integrationId
          ? {
              ...integration,
              connected: !integration.connected,
              status: integration.connected ? "Pendente" : "Conectado",
            }
          : integration,
      ),
    );
  };

  const handleSaveIntegration = () => {
    if (!form.name.trim() || !form.description.trim() || !form.endpoint.trim()) {
      toast.error("Preencha nome, descrição e endpoint da integração.");
      return;
    }

    if (editingIntegrationId) {
      setIntegrations((current) =>
        current.map((integration) =>
          integration.id === editingIntegrationId
            ? {
                ...integration,
                ...form,
              }
            : integration,
        ),
      );
      toast.success("Integração atualizada com sucesso!");
    } else {
      setIntegrations((current) => [
        {
          id: `integration-${Date.now()}`,
          connected: false,
          status: "Pendente",
          iconName: form.category === "Financeiro" ? "payment" : form.category === "Automação" ? "automation" : "assistant",
          color:
            form.category === "Financeiro"
              ? "text-warning-text"
              : form.category === "Automação"
                ? "text-danger-text"
                : "text-brand-primary",
          ...form,
        },
        ...current,
      ]);
      toast.success("Integração adicionada com sucesso!");
    }

    handleDialogChange(false);
  };

  return (
    <>
      <div className="w-full overflow-hidden rounded-[14px] border border-border-light bg-white p-4 shadow-sm sm:p-6 md:p-8">
        <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-[20px] font-bold leading-[28px] text-text-primary">
              Ecossistema de Integrações
            </h2>
            <p className="mt-1 text-[14px] font-medium text-text-tertiary">
              Centralize conexões com comunicação, automação e serviços financeiros.
            </p>
          </div>
          <Button
            onClick={openCreateDialog}
            className="h-10 rounded-lg bg-brand-primary px-4 text-white shadow-sm hover:bg-brand-dark"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nova Integração
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {integrations.map((integration) => {
            const Icon = getIntegrationIcon(integration.iconName);

            return (
              <div
                key={integration.id}
                className="flex flex-col rounded-[24px] border border-border-light bg-white p-6 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.02)]"
              >
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div className={cn("flex h-[52px] w-[52px] items-center justify-center rounded-full border border-border-light bg-white shadow-sm", integration.color)}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.08em]",
                        integration.connected
                          ? "border-success-border bg-success-bg text-success-text"
                          : "border-warning-border bg-warning-bg text-warning-text",
                      )}
                    >
                      <CheckCircle2 className="h-[14px] w-[14px]" />
                      {integration.status}
                    </span>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-text-muted hover:text-text-secondary"
                        >
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-48 rounded-xl border-border-light"
                      >
                        <DropdownMenuItem
                          onClick={() => openEditDialog(integration)}
                          className="cursor-pointer rounded-lg px-3 py-2 text-text-secondary"
                        >
                          <Pencil className="h-4 w-4" />
                          Editar integração
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => toggleConnection(integration.id)}
                          className="cursor-pointer rounded-lg px-3 py-2 text-text-secondary"
                        >
                          {integration.connected ? <Unplug className="h-4 w-4" /> : <PlugZap className="h-4 w-4" />}
                          {integration.connected ? "Desconectar" : "Conectar"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-[18px] font-bold text-text-primary">
                      {integration.name}
                    </h3>
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] ${getCategoryBadge(integration.category)}`}
                    >
                      {integration.category}
                    </span>
                  </div>
                  <p className="mt-2 text-[14px] font-medium text-text-tertiary">
                    {integration.description}
                  </p>
                </div>

                <div className="mt-6 rounded-2xl border border-border-light bg-background-card p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted">
                    Endpoint / Origem
                  </p>
                  <p className="mt-2 break-all text-[14px] font-medium text-text-secondary">
                    {integration.endpoint}
                  </p>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button
                    variant="outline"
                    className="h-10 flex-1 rounded-full border-border-light text-[13px] font-semibold text-text-secondary hover:bg-background-card"
                  >
                    Configurar Integração
                    <ExternalLink className="ml-2 h-[14px] w-[14px] text-text-muted" />
                  </Button>
                  <Button
                    onClick={() => toggleConnection(integration.id)}
                    className={cn(
                      "h-10 flex-1 rounded-full text-[13px] font-semibold text-white shadow-sm",
                      integration.connected
                        ? "bg-danger-text hover:bg-danger-text/90"
                        : "bg-brand-primary hover:bg-brand-dark",
                    )}
                  >
                    {integration.connected ? "Desconectar" : "Conectar"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent
          className="max-w-[680px] overflow-hidden rounded-[24px] border-none p-0 shadow-[0_30px_80px_rgba(var(--shadow-panel-rgb),0.22)]"
          showCloseButton={false}
        >
          <div className="sr-only">
            <DialogTitle>
              {editingIntegrationId ? "Editar integração" : "Nova integração"}
            </DialogTitle>
            <DialogDescription>
              Formulário para cadastrar ou editar integrações do sistema.
            </DialogDescription>
          </div>

          <div className="bg-[linear-gradient(135deg,var(--color-brand-teal)_0%,var(--color-brand-teal-soft)_100%)] px-6 py-6 text-white md:px-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-[16px] border border-white/20 bg-white/10">
                <Link2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-[20px] font-bold">
                  {editingIntegrationId ? "Editar Integração" : "Cadastrar Integração"}
                </h3>
                <p className="mt-1 text-[14px] text-white/85">
                  Registre o nome, a categoria e a origem da conexão.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6 bg-white px-6 py-7 md:px-8">
            <div className="grid gap-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-text-secondary">
                    Nome da integração
                  </label>
                  <Input
                    value={form.name}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, name: event.target.value }))
                    }
                    placeholder="Ex: Agenda via WhatsApp"
                    className="h-11 rounded-lg border-border-light bg-background-card/50 px-4 text-sm font-medium"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-text-secondary">
                    Categoria
                  </label>
                  <Select
                    value={form.category}
                    onValueChange={(value) =>
                      setForm((current) => ({
                        ...current,
                        category: value as IntegrationCategory,
                      }))
                    }
                  >
                    <SelectTrigger className="h-11 w-full rounded-lg border-border-light bg-background-card/50 px-4 text-sm font-medium text-text-primary">
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border-light">
                      <SelectItem value="Comunicação">Comunicação</SelectItem>
                      <SelectItem value="Automação">Automação</SelectItem>
                      <SelectItem value="Financeiro">Financeiro</SelectItem>
                      <SelectItem value="Atendimento">Atendimento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-semibold text-text-secondary">
                  Endpoint ou URL
                </label>
                <Input
                  value={form.endpoint}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, endpoint: event.target.value }))
                  }
                  placeholder="https://api.exemplo.com/webhook"
                  className="h-11 rounded-lg border-border-light bg-background-card/50 px-4 text-sm font-medium"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-semibold text-text-secondary">
                  Descrição
                </label>
                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, description: event.target.value }))
                  }
                  placeholder="Descreva o papel dessa integração na rotina da clínica."
                  className="min-h-[120px] rounded-lg border border-border-light bg-background-card/50 px-4 py-3 text-sm font-medium text-text-primary outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-border-light bg-background-card p-5">
              <p className="text-[14px] font-semibold text-text-primary">
                Gestão visual pronta para o frontend
              </p>
              <p className="mt-1 text-[13px] font-medium text-text-tertiary">
                O fluxo permite cadastrar, editar, conectar e desconectar integrações
                no padrão visual do restante das configurações.
              </p>
            </div>

            <div className="flex flex-col gap-3 border-t border-border-light pt-6 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                onClick={() => handleDialogChange(false)}
                className="h-10 rounded-lg border-border-light px-6 text-sm font-semibold text-text-secondary"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSaveIntegration}
                className="h-10 rounded-lg bg-brand-primary px-6 text-sm font-semibold text-white hover:bg-brand-dark"
              >
                {editingIntegrationId ? "Salvar alterações" : "Salvar integração"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
