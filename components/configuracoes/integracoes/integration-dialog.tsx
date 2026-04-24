"use client";

import { Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { IntegrationCategory, IntegrationFormState } from "./integration-types";

type IntegrationDialogProps = {
  open: boolean;
  editingIntegrationId: string | null;
  form: IntegrationFormState;
  onOpenChange: (open: boolean) => void;
  onFormChange: (form: IntegrationFormState) => void;
  onSave: () => void;
};

export function IntegrationDialog({
  open,
  editingIntegrationId,
  form,
  onOpenChange,
  onFormChange,
  onSave,
}: IntegrationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                  onChange={(event) => onFormChange({ ...form, name: event.target.value })}
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
                    onFormChange({ ...form, category: value as IntegrationCategory })
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
                onChange={(event) => onFormChange({ ...form, endpoint: event.target.value })}
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
                  onFormChange({ ...form, description: event.target.value })
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
              onClick={() => onOpenChange(false)}
              className="h-10 rounded-lg border-border-light px-6 text-sm font-semibold text-text-secondary"
            >
              Cancelar
            </Button>
            <Button
              onClick={onSave}
              className="h-10 rounded-lg bg-brand-primary px-6 text-sm font-semibold text-white hover:bg-brand-dark"
            >
              {editingIntegrationId ? "Salvar alterações" : "Salvar integração"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
