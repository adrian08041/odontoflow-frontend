"use client";

import { useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  Mail,
  MoreHorizontal,
  Pencil,
  Phone,
  Trash2,
  UserPlus,
  UsersRound,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type TeamRole =
  | "Administrador"
  | "Dentista"
  | "Recepcionista"
  | "Auxiliar"
  | "Financeiro";

type TeamStatus = "Ativo" | "Inativo";

type TeamMember = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: TeamRole;
  status: TeamStatus;
  avatar: string;
};

type TeamFormState = {
  name: string;
  email: string;
  phone: string;
  role: TeamRole;
  status: TeamStatus;
};

const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  {
    id: "team-1",
    name: "Dra. Ana Silva",
    email: "ana.silva@odontoflow.com",
    phone: "(11) 99876-1122",
    role: "Administrador",
    status: "Ativo",
    avatar: "https://i.pravatar.cc/150?u=ana-silva",
  },
  {
    id: "team-2",
    name: "Dr. Lucas Ferraz",
    email: "lucas.ferraz@odontoflow.com",
    phone: "(11) 99712-3310",
    role: "Dentista",
    status: "Ativo",
    avatar: "https://i.pravatar.cc/150?u=lucas-ferraz",
  },
  {
    id: "team-3",
    name: "Mariana Santos",
    email: "mariana.santos@odontoflow.com",
    phone: "(11) 98765-0918",
    role: "Recepcionista",
    status: "Ativo",
    avatar: "https://i.pravatar.cc/150?u=mariana-santos",
  },
];

const EMPTY_FORM: TeamFormState = {
  name: "",
  email: "",
  phone: "",
  role: "Recepcionista",
  status: "Ativo",
};

function getStatusClasses(status: TeamStatus) {
  if (status === "Ativo") {
    return "bg-success-bg text-success-text border-success-border";
  }

  return "bg-background-hover text-text-tertiary border-border-light";
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
  }

  return (parts[0] ?? "").slice(0, 2).toUpperCase();
}

export function EquipeSettings() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(INITIAL_TEAM_MEMBERS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [form, setForm] = useState<TeamFormState>(EMPTY_FORM);

  const totalActiveMembers = useMemo(
    () => teamMembers.filter((member) => member.status === "Ativo").length,
    [teamMembers],
  );

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingMemberId(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (member: TeamMember) => {
    setEditingMemberId(member.id);
    setForm({
      name: member.name,
      email: member.email,
      phone: member.phone,
      role: member.role,
      status: member.status,
    });
    setDialogOpen(true);
  };

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }

    setDialogOpen(open);
  };

  const handleSaveMember = () => {
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      toast.error("Preencha nome, e-mail e telefone da equipe.");
      return;
    }

    if (editingMemberId) {
      setTeamMembers((current) =>
        current.map((member) =>
          member.id === editingMemberId
            ? {
                ...member,
                ...form,
              }
            : member,
        ),
      );
      toast.success("Cadastro da equipe atualizado com sucesso!");
    } else {
      setTeamMembers((current) => [
        {
          id: `team-${Date.now()}`,
          avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(form.email)}`,
          ...form,
        },
        ...current,
      ]);
      toast.success("Novo funcionário adicionado com sucesso!");
    }

    handleDialogChange(false);
  };

  const handleDeleteMember = (memberId: string) => {
    setTeamMembers((current) => current.filter((member) => member.id !== memberId));
    toast.success("Funcionário removido com sucesso!");
  };

  return (
    <>
      <div className="w-full overflow-hidden rounded-[14px] border border-border-light bg-white p-4 shadow-sm sm:p-6 md:p-8">
        <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-[20px] font-bold leading-[28px] text-text-primary">
              Gestão de Equipe
            </h2>
            <p className="mt-1 text-[14px] font-medium text-text-tertiary">
              Cadastre funcionários, organize cargos e mantenha o time alinhado.
            </p>
          </div>
          <Button
            onClick={openCreateDialog}
            className="h-10 rounded-lg bg-brand-primary px-4 text-white shadow-sm hover:bg-brand-dark"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Adicionar Funcionário
          </Button>
        </div>

        <div className="mb-6 grid gap-4 md:mb-8 md:grid-cols-2">
          <div className="rounded-2xl border border-border-light bg-background-card p-5">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-text-muted">
              Total na Equipe
            </p>
            <p className="mt-2 text-[24px] font-bold text-text-primary">
              {teamMembers.length}
            </p>
          </div>
          <div className="rounded-2xl border border-border-light bg-background-card p-5">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-text-muted">
              Ativos no Sistema
            </p>
            <p className="mt-2 text-[24px] font-bold text-success-text">
              {totalActiveMembers}
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-border-light">
          <Table className="min-w-[760px] text-left">
            <TableHeader>
              <TableRow className="border-b border-border-light bg-background-card hover:bg-background-card">
                <TableHead className="h-auto px-6 py-4 text-[13px] font-semibold text-text-tertiary">
                  Colaborador
                </TableHead>
                <TableHead className="h-auto px-6 py-4 text-[13px] font-semibold text-text-tertiary">
                  Contato
                </TableHead>
                <TableHead className="h-auto px-6 py-4 text-[13px] font-semibold text-text-tertiary">
                  Cargo
                </TableHead>
                <TableHead className="h-auto px-6 py-4 text-[13px] font-semibold text-text-tertiary">
                  Status
                </TableHead>
                <TableHead className="h-auto px-6 py-4 text-right text-[13px] font-semibold text-text-tertiary">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamMembers.map((member) => (
                <TableRow
                  key={member.id}
                  className="border-b border-border-light transition-colors hover:bg-background-card/50 last:border-0"
                >
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-11 w-11 border border-border-light">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="bg-brand-primary text-white">
                          {getInitials(member.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-[14px] font-semibold text-text-primary">
                          {member.name}
                        </span>
                        <span className="text-[13px] text-text-tertiary">
                          Cadastro interno da equipe
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex flex-col gap-1.5 text-[13px] text-text-secondary">
                      <span className="inline-flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 text-text-muted" />
                        {member.email}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-text-muted" />
                        {member.phone}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-[14px] font-medium text-text-secondary">
                    {member.role}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${getStatusClasses(member.status)}`}
                    >
                      {member.status}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
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
                          onClick={() => openEditDialog(member)}
                          className="cursor-pointer rounded-lg px-3 py-2 text-text-secondary"
                        >
                          <Pencil className="h-4 w-4" />
                          Editar cadastro
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteMember(member.id)}
                          className="cursor-pointer rounded-lg px-3 py-2 text-danger-text focus:text-danger-text"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remover funcionário
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent
          className="max-w-[820px] overflow-hidden rounded-[24px] border-none p-0 shadow-[0_30px_80px_rgba(var(--shadow-panel-rgb),0.22)]"
          showCloseButton={false}
        >
          <div className="sr-only">
            <DialogTitle>
              {editingMemberId ? "Editar funcionário" : "Adicionar funcionário"}
            </DialogTitle>
            <DialogDescription>
              Formulário para cadastrar ou editar membros da equipe.
            </DialogDescription>
          </div>

          <div className="bg-[linear-gradient(135deg,var(--color-brand-teal)_0%,var(--color-brand-teal-soft)_100%)] px-6 py-8 text-white md:px-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-[16px] border border-white/20 bg-white/10">
                <UsersRound className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-[20px] font-bold">
                  {editingMemberId ? "Editar Funcionário" : "Adicionar Funcionário"}
                </h3>
                <p className="mt-1 text-[14px] text-white/85">
                  Mantenha o cadastro da equipe atualizado no OdontoFlow.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8 bg-white px-6 py-8 md:px-8">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-text-muted">
                Dados do Funcionário
              </p>
              <h4 className="mt-2 text-[24px] font-bold text-text-primary">
                Preencha o cadastro da equipe
              </h4>
              <p className="mt-1 text-[14px] font-medium text-text-tertiary">
                Organize os dados principais do colaborador no mesmo padrão do restante da
                clínica.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="flex min-w-0 flex-col gap-2">
                <label className="text-[13px] font-semibold text-text-secondary">
                  Nome completo
                </label>
                <Input
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, name: event.target.value }))
                  }
                  placeholder="Ex: Fernanda Souza"
                  className="h-12 rounded-lg border-border-light bg-background-card/50 px-4 text-sm font-medium"
                />
              </div>

              <div className="flex min-w-0 flex-col gap-2">
                <label className="text-[13px] font-semibold text-text-secondary">
                  E-mail corporativo
                </label>
                <Input
                  value={form.email}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, email: event.target.value }))
                  }
                  placeholder="nome@odontoflow.com"
                  className="h-12 rounded-lg border-border-light bg-background-card/50 px-4 text-sm font-medium"
                />
              </div>

              <div className="flex min-w-0 flex-col gap-2">
                <label className="text-[13px] font-semibold text-text-secondary">
                  Telefone
                </label>
                <Input
                  value={form.phone}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, phone: event.target.value }))
                  }
                  placeholder="(11) 99999-9999"
                  className="h-12 rounded-lg border-border-light bg-background-card/50 px-4 text-sm font-medium"
                />
              </div>

              <div className="flex min-w-0 flex-col gap-2">
                <label className="text-[13px] font-semibold text-text-secondary">
                  Cargo
                </label>
                <Select
                  value={form.role}
                  onValueChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      role: value as TeamRole,
                    }))
                  }
                >
                  <SelectTrigger className="h-12 w-full min-w-0 rounded-lg border-border-light bg-background-card/50 px-4 text-sm font-medium text-text-primary">
                    <SelectValue placeholder="Selecione um cargo" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border-light">
                    <SelectItem value="Administrador">Administrador</SelectItem>
                    <SelectItem value="Dentista">Dentista</SelectItem>
                    <SelectItem value="Recepcionista">Recepcionista</SelectItem>
                    <SelectItem value="Auxiliar">Auxiliar</SelectItem>
                    <SelectItem value="Financeiro">Financeiro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex min-w-0 flex-col gap-2 md:col-span-2">
                <label className="text-[13px] font-semibold text-text-secondary">
                  Status
                </label>
                <Select
                  value={form.status}
                  onValueChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      status: value as TeamStatus,
                    }))
                  }
                >
                  <SelectTrigger className="h-12 w-full min-w-0 rounded-lg border-border-light bg-background-card/50 px-4 text-sm font-medium text-text-primary">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border-light">
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
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
                onClick={handleSaveMember}
                className="h-10 rounded-lg bg-brand-primary px-6 text-sm font-semibold text-white hover:bg-brand-dark"
              >
                <BriefcaseBusiness className="h-4 w-4" />
                {editingMemberId ? "Salvar alterações" : "Salvar funcionário"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
