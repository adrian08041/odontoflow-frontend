"use client";

import { useState } from "react";
import {
  BadgePercent,
  Building2,
  FileBadge2,
  MoreHorizontal,
  Pencil,
  Plus,
  ShieldPlus,
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

type AgreementType =
  | "Plano odontológico"
  | "Plano de saúde"
  | "Convênio corporativo"
  | "Parceria local";

type AgreementStatus = "Ativo" | "Em análise" | "Inativo";

type Agreement = {
  id: string;
  name: string;
  code: string;
  type: AgreementType;
  discount: string;
  status: AgreementStatus;
};

type AgreementFormState = {
  name: string;
  code: string;
  type: AgreementType;
  discount: string;
  status: AgreementStatus;
};

const INITIAL_AGREEMENTS: Agreement[] = [
  {
    id: "agreement-1",
    name: "Unimed Odonto",
    code: "UNI-001",
    type: "Plano odontológico",
    discount: "15",
    status: "Ativo",
  },
  {
    id: "agreement-2",
    name: "Bradesco Saúde",
    code: "BRA-014",
    type: "Plano de saúde",
    discount: "10",
    status: "Ativo",
  },
  {
    id: "agreement-3",
    name: "Clube Empresarial Paulista",
    code: "CEP-221",
    type: "Convênio corporativo",
    discount: "8",
    status: "Em análise",
  },
];

const EMPTY_FORM: AgreementFormState = {
  name: "",
  code: "",
  type: "Plano odontológico",
  discount: "10",
  status: "Ativo",
};

function getStatusClasses(status: AgreementStatus) {
  if (status === "Ativo") {
    return "bg-success-bg text-success-text border-success-border";
  }

  if (status === "Em análise") {
    return "bg-warning-bg text-warning-text border-warning-border";
  }

  return "bg-background-hover text-text-tertiary border-border-light";
}

export function ConveniosSettings() {
  const [agreements, setAgreements] = useState<Agreement[]>(INITIAL_AGREEMENTS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAgreementId, setEditingAgreementId] = useState<string | null>(null);
  const [form, setForm] = useState<AgreementFormState>(EMPTY_FORM);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingAgreementId(null);
  };

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }

    setDialogOpen(open);
  };

  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (agreement: Agreement) => {
    setEditingAgreementId(agreement.id);
    setForm({
      name: agreement.name,
      code: agreement.code,
      type: agreement.type,
      discount: agreement.discount,
      status: agreement.status,
    });
    setDialogOpen(true);
  };

  const toggleStatus = (agreementId: string) => {
    setAgreements((current) =>
      current.map((agreement) =>
        agreement.id === agreementId
          ? {
              ...agreement,
              status: agreement.status === "Ativo" ? "Inativo" : "Ativo",
            }
          : agreement,
      ),
    );
  };

  const handleSaveAgreement = () => {
    if (!form.name.trim() || !form.code.trim() || !form.discount.trim()) {
      toast.error("Preencha nome, código e desconto do convênio.");
      return;
    }

    if (editingAgreementId) {
      setAgreements((current) =>
        current.map((agreement) =>
          agreement.id === editingAgreementId
            ? {
                ...agreement,
                ...form,
              }
            : agreement,
        ),
      );
      toast.success("Convênio atualizado com sucesso!");
    } else {
      setAgreements((current) => [
        {
          id: `agreement-${Date.now()}`,
          ...form,
        },
        ...current,
      ]);
      toast.success("Convênio adicionado com sucesso!");
    }

    handleDialogChange(false);
  };

  return (
    <>
      <div className="w-full overflow-hidden rounded-[14px] border border-border-light bg-white p-4 shadow-sm sm:p-6 md:p-8">
        <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-[20px] font-bold leading-[28px] text-text-primary">
              Convênios Aceitos
            </h2>
            <p className="mt-1 text-[14px] font-medium text-text-tertiary">
              Organize os convênios cadastrados com código, tipo e desconto aplicado.
            </p>
          </div>
          <Button
            onClick={openCreateDialog}
            className="h-10 rounded-lg bg-brand-primary px-4 text-white shadow-sm hover:bg-brand-dark"
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Convênio
          </Button>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {agreements.map((agreement) => (
            <div
              key={agreement.id}
              className="rounded-[24px] border border-border-light bg-white p-5 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.02)] transition-colors hover:bg-background-card/40"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
                    <ShieldPlus className="h-7 w-7" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-[16px] font-semibold text-text-primary">
                        {agreement.name}
                      </h3>
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] ${getStatusClasses(agreement.status)}`}
                      >
                        {agreement.status}
                      </span>
                    </div>
                    <p className="mt-2 text-[13px] font-medium text-text-tertiary">
                      Convênio habilitado para atendimento da clínica.
                    </p>
                  </div>
                </div>

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
                      onClick={() => openEditDialog(agreement)}
                      className="cursor-pointer rounded-lg px-3 py-2 text-text-secondary"
                    >
                      <Pencil className="h-4 w-4" />
                      Editar cadastro
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => toggleStatus(agreement.id)}
                      className="cursor-pointer rounded-lg px-3 py-2 text-text-secondary"
                    >
                      <ShieldPlus className="h-4 w-4" />
                      {agreement.status === "Ativo" ? "Desativar convênio" : "Ativar convênio"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="min-w-0 rounded-2xl border border-border-light bg-background-card p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted">
                    Código
                  </p>
                  <p className="mt-2 flex min-w-0 items-start gap-2 text-[14px] font-semibold text-text-primary">
                    <FileBadge2 className="mt-0.5 h-4 w-4 shrink-0 text-text-muted" />
                    <span className="min-w-0 break-words">{agreement.code}</span>
                  </p>
                </div>

                <div className="min-w-0 rounded-2xl border border-border-light bg-background-card p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted">
                    Tipo
                  </p>
                  <p className="mt-2 flex min-w-0 items-start gap-2 text-[14px] font-semibold leading-5 text-text-primary">
                    <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-text-muted" />
                    <span className="min-w-0 break-words">{agreement.type}</span>
                  </p>
                </div>

                <div className="min-w-0 rounded-2xl border border-border-light bg-background-card p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted">
                    Desconto
                  </p>
                  <p className="mt-2 flex min-w-0 items-start gap-2 text-[14px] font-semibold text-text-primary">
                    <BadgePercent className="mt-0.5 h-4 w-4 shrink-0 text-text-muted" />
                    <span className="min-w-0 break-words">{agreement.discount}%</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent
          className="max-w-[820px] overflow-hidden rounded-[24px] border-none p-0 shadow-[0_30px_80px_rgba(var(--shadow-panel-rgb),0.22)]"
          showCloseButton={false}
        >
          <div className="sr-only">
            <DialogTitle>
              {editingAgreementId ? "Editar convênio" : "Novo convênio"}
            </DialogTitle>
            <DialogDescription>
              Formulário para cadastrar ou editar convênios aceitos pela clínica.
            </DialogDescription>
          </div>

          <div className="bg-[linear-gradient(135deg,var(--color-brand-teal)_0%,var(--color-brand-teal-soft)_100%)] px-6 py-8 text-white md:px-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-[16px] border border-white/20 bg-white/10">
                <ShieldPlus className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-[20px] font-bold">
                  {editingAgreementId ? "Editar Convênio" : "Cadastrar Convênio"}
                </h3>
                <p className="mt-1 text-[14px] text-white/85">
                  Preencha os dados de identificação do convênio.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8 bg-white px-6 py-8 md:px-8">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-text-muted">
                Identificação do Convênio
              </p>
              <h4 className="mt-2 text-[24px] font-bold text-text-primary">
                Configure o convênio aceito pela clínica
              </h4>
              <p className="mt-1 text-[14px] font-medium text-text-tertiary">
                Organize código, tipo, desconto e status em um cadastro visual mais claro.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="flex min-w-0 flex-col gap-2">
                <label className="text-[13px] font-semibold text-text-secondary">
                  Nome do convênio
                </label>
                <Input
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, name: event.target.value }))
                  }
                  placeholder="Ex: Unimed Odonto"
                  className="h-12 rounded-lg border-border-light bg-background-card/50 px-4 text-sm font-medium"
                />
              </div>

              <div className="flex min-w-0 flex-col gap-2">
                <label className="text-[13px] font-semibold text-text-secondary">
                  Código interno
                </label>
                <Input
                  value={form.code}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      code: event.target.value.toUpperCase(),
                    }))
                  }
                  placeholder="Ex: UNI-001"
                  className="h-12 rounded-lg border-border-light bg-background-card/50 px-4 text-sm font-medium"
                />
              </div>

              <div className="flex min-w-0 flex-col gap-2">
                <label className="text-[13px] font-semibold text-text-secondary">
                  Tipo
                </label>
                <Select
                  value={form.type}
                  onValueChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      type: value as AgreementType,
                    }))
                  }
                >
                  <SelectTrigger className="h-12 w-full rounded-lg border-border-light bg-background-card/50 px-4 text-sm font-medium text-text-primary">
                    <SelectValue placeholder="Selecione um tipo" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border-light">
                    <SelectItem value="Plano odontológico">Plano odontológico</SelectItem>
                    <SelectItem value="Plano de saúde">Plano de saúde</SelectItem>
                    <SelectItem value="Convênio corporativo">Convênio corporativo</SelectItem>
                    <SelectItem value="Parceria local">Parceria local</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex min-w-0 flex-col gap-2">
                <label className="text-[13px] font-semibold text-text-secondary">
                  Status
                </label>
                <Select
                  value={form.status}
                  onValueChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      status: value as AgreementStatus,
                    }))
                  }
                >
                  <SelectTrigger className="h-12 w-full rounded-lg border-border-light bg-background-card/50 px-4 text-sm font-medium text-text-primary">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border-light">
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Em análise">Em análise</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex min-w-0 flex-col gap-2 md:col-span-2">
                <label className="text-[13px] font-semibold text-text-secondary">
                  Desconto (%)
                </label>
                <Select
                  value={form.discount}
                  onValueChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      discount: value,
                    }))
                  }
                >
                  <SelectTrigger className="h-12 w-full rounded-lg border-border-light bg-background-card/50 px-4 text-sm font-medium text-text-primary">
                    <SelectValue placeholder="Selecione o desconto" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border-light">
                    <SelectItem value="5">5%</SelectItem>
                    <SelectItem value="8">8%</SelectItem>
                    <SelectItem value="10">10%</SelectItem>
                    <SelectItem value="12">12%</SelectItem>
                    <SelectItem value="15">15%</SelectItem>
                    <SelectItem value="20">20%</SelectItem>
                    <SelectItem value="25">25%</SelectItem>
                    <SelectItem value="30">30%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                onClick={handleSaveAgreement}
                className="h-10 rounded-lg bg-brand-primary px-6 text-sm font-semibold text-white hover:bg-brand-dark"
              >
                {editingAgreementId ? "Salvar alterações" : "Salvar convênio"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
