"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  Check,
  Eye,
  IdCard,
  Loader2,
  PencilLine,
  Phone,
  Plus,
  Search,
  ShieldPlus,
  Trash2,
  UserRound,
  X,
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
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";
import { patientSchema, type PatientFormData } from "@/lib/schemas/patient-schema";
import type { PageResponse, Patient } from "@/lib/types";

const PHONE_PREFIX = "(55) ";
const STEPS = ["Identificação", "Contato", "Revisão"];
const EMPTY_FORM: PatientFormData = {
  name: "",
  cpf: "",
  phone: PHONE_PREFIX,
  insurance: "",
};

const fieldClass =
  "h-12 rounded-[16px] border-[var(--color-border-soft)] bg-[var(--color-surface-panel)] text-[15px] shadow-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-teal)]/30";

const statusClassMap: Record<string, string> = {
  Ativo: "bg-success-bg text-success-text",
  Pendente: "bg-warning-bg text-warning-text",
};

const formatCpf = (cpf: string) => {
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11) return cpf;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
};

const formatDate = (date?: string) => {
  if (!date) return "-";

  try {
    return new Date(`${date}T00:00:00`).toLocaleDateString("pt-BR");
  } catch {
    return date;
  }
};

const formatCpfInput = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;

  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
};

const formatPhoneInput = (value: string) => {
  const digits = value.replace(/\D/g, "").replace(/^55/, "").slice(0, 11);
  const ddd = digits.slice(0, 2);
  const number = digits.slice(2);

  if (!digits) return PHONE_PREFIX;
  if (digits.length <= 2) return `${PHONE_PREFIX}${digits}`;
  if (number.length <= 4) return `${PHONE_PREFIX}${ddd} ${number}`;
  if (number.length <= 8) return `${PHONE_PREFIX}${ddd} ${number.slice(0, 4)}-${number.slice(4)}`;

  return `${PHONE_PREFIX}${ddd} ${number.slice(0, 5)}-${number.slice(5)}`;
};

function StepDot({
  active,
  done,
  value,
}: {
  active: boolean;
  done: boolean;
  value: number;
}) {
  return (
    <div
      className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-black ${
        active
          ? "bg-white text-[var(--color-brand-teal)]"
          : done
            ? "bg-white/25 text-white"
            : "bg-white/15 text-white/60"
      }`}
    >
      {done ? <Check className="h-5 w-5" /> : value}
    </div>
  );
}

export function PatientsSection() {
  const router = useRouter();
  const formContentRef = useRef<HTMLDivElement | null>(null);

  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [insuranceFilter, setInsuranceFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("name,asc");
  const [insurances, setInsurances] = useState<string[]>([]);
  const [step, setStep] = useState(1);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [deletingPatientId, setDeletingPatientId] = useState<string | null>(null);

  const {
    register,
    control,
    formState: { errors, isSubmitting },
    reset,
    trigger,
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: EMPTY_FORM,
  });

  const watchedName = useWatch({ control, name: "name" });
  const watchedCpf = useWatch({ control, name: "cpf" });
  const watchedPhone = useWatch({ control, name: "phone" });
  const watchedInsurance = useWatch({ control, name: "insurance" });

  const startIndex = page * 20 + 1;
  const endIndex = Math.min((page + 1) * 20, totalElements);
  const dialogTitle = editingPatient ? "Editar Paciente" : "Novo Paciente";
  const dialogDescription = editingPatient
    ? "Revise as informações e ajuste o cadastro do paciente."
    : "Cadastre os dados principais do paciente com mais organização.";
  const submitLabel = step < 3 ? "Próximo" : editingPatient ? "Salvar Alterações" : "Salvar Paciente";

  const selectedStatusBadgeClass = useMemo(
    () =>
      editingPatient?.status
        ? statusClassMap[editingPatient.status] ?? "bg-danger-bg text-danger-text"
        : "bg-[var(--color-brand-teal)] text-white",
    [editingPatient],
  );

  const fetchInsurances = useCallback(async () => {
    try {
      const data = await api<string[]>("/patients/insurances");
      setInsurances(Array.isArray(data) ? data : []);
    } catch {
      setInsurances([]);
    }
  }, []);

  const fetchPatients = useCallback(async () => {
    setIsLoading(true);

    try {
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : "";
      const insuranceParam = insuranceFilter ? `&insurance=${encodeURIComponent(insuranceFilter)}` : "";
      const statusParam = statusFilter ? `&status=${encodeURIComponent(statusFilter)}` : "";

      const data = await api<PageResponse<Patient>>(
        `/patients?page=${page}&size=20&sort=${sortBy}${searchParam}${insuranceParam}${statusParam}`,
      );

      setPatients(Array.isArray(data?.content) ? data.content : []);
      setTotalPages(typeof data?.totalPages === "number" ? data.totalPages : 0);
      setTotalElements(typeof data?.totalElements === "number" ? data.totalElements : 0);
    } catch {
      toast.error("Erro ao carregar pacientes");
    } finally {
      setIsLoading(false);
    }
  }, [insuranceFilter, page, search, sortBy, statusFilter]);

  useEffect(() => {
    void fetchInsurances();
  }, [fetchInsurances]);

  useEffect(() => {
    void fetchPatients();
  }, [fetchPatients]);

  useEffect(() => {
    setPage(0);
  }, [search]);

  useEffect(() => {
    formContentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const resetDialogState = useCallback(() => {
    setStep(1);
    setEditingPatient(null);
    reset(EMPTY_FORM);
  }, [reset]);

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      resetDialogState();
    }

    setIsDialogOpen(open);
  };

  const openCreateDialog = () => {
    resetDialogState();
    setIsDialogOpen(true);
  };

  const openEditDialog = (patient: Patient) => {
    setEditingPatient(patient);
    setStep(1);
    reset({
      name: patient.name ?? "",
      cpf: formatCpfInput(patient.cpf ?? ""),
      phone: formatPhoneInput(patient.phone ?? ""),
      insurance: patient.insurance ?? "",
    });
    setIsDialogOpen(true);
  };

  const goToNextStep = async () => {
    if (step === 1) {
      const isValid = await trigger(["name", "cpf"]);
      if (isValid) setStep(2);
      return false;
    }

    if (step === 2) {
      const isValid = await trigger(["phone"]);
      if (isValid) setStep(3);
      return false;
    }

    return true;
  };

  const submitPatient = async (data: PatientFormData) => {
    const payload = {
      name: data.name,
      cpf: data.cpf,
      phone: data.phone,
      insurance: data.insurance || null,
    };

    try {
      if (editingPatient) {
        await api<Patient>(`/patients/${editingPatient.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        toast.success("Paciente atualizado com sucesso!");
      } else {
        await api<Patient>("/patients", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast.success("Paciente adicionado com sucesso!");
      }

      handleDialogChange(false);
      await Promise.all([fetchPatients(), fetchInsurances()]);
    } catch (error: unknown) {
      const apiError = error as { message?: string };
      toast.error(
        apiError.message ||
          (editingPatient ? "Erro ao atualizar paciente" : "Erro ao criar paciente"),
      );
    }
  };

  const handlePrimaryAction = async () => {
    if (step < 3) {
      await goToNextStep();
      return;
    }

    const isValid = await trigger(["name", "cpf", "phone"]);
    if (!isValid) return;

    await submitPatient({
      name: watchedName ?? "",
      cpf: watchedCpf ?? "",
      phone: watchedPhone ?? "",
      insurance: watchedInsurance ?? "",
    });
  };

  const handleDeletePatient = async (patient: Patient) => {
    const shouldDelete = window.confirm(
      `Deseja excluir o paciente ${patient.name}? Essa ação remove o cadastro da lista ativa.`,
    );

    if (!shouldDelete) return;

    setDeletingPatientId(patient.id);

    try {
      await api<void>(`/patients/${patient.id}`, {
        method: "DELETE",
      });

      toast.success("Paciente excluído com sucesso!");
      await Promise.all([fetchPatients(), fetchInsurances()]);
    } catch (error: unknown) {
      const apiError = error as { message?: string };
      toast.error(apiError.message || "Erro ao excluir paciente");
    } finally {
      setDeletingPatientId(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-4 px-4 pb-4 pt-2 sm:px-6 md:space-y-6 md:pb-8 lg:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-[24px] font-bold leading-[32px] text-text-primary">Pacientes</h1>
          <p className="mt-0.5 text-[14px] font-medium text-text-tertiary">
            Gerencie o histórico e informações dos seus pacientes.
          </p>
        </div>

        <Button
          onClick={openCreateDialog}
          className="h-11 w-full rounded-[8px] bg-brand-dark px-5 font-semibold text-white shadow-sm hover:bg-brand-dark sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Paciente
        </Button>

        <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
          <DialogContent
            showCloseButton={false}
            className="flex max-h-[90vh] w-[calc(100vw-24px)] max-w-[760px] flex-col overflow-hidden rounded-[26px] border-none p-0 shadow-[0_30px_80px_rgba(var(--shadow-panel-rgb),0.28)]"
          >
            <div className="sr-only">
              <DialogTitle>{dialogTitle}</DialogTitle>
              <DialogDescription>
                Formulário em etapas para cadastrar ou editar um paciente.
              </DialogDescription>
            </div>

            <div className="bg-[linear-gradient(135deg,var(--color-brand-teal)_0%,var(--color-brand-teal-soft)_100%)] px-4 py-6 text-white sm:px-6 sm:py-7 md:px-8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-[14px] border border-white/20 bg-white/10">
                    <UserRound className="h-6 w-6" />
                  </div>

                  <div>
                    <h2 className="text-[20px] font-black">{dialogTitle}</h2>
                    <p className="mt-1 text-[14px] text-white/85">{dialogDescription}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDialogChange(false)}
                  aria-label="Fechar"
                  className="rounded-full p-2 hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 text-center sm:mt-8 sm:gap-3">
                {[1, 2, 3].map((item, index) => (
                  <div key={item} className="flex items-center gap-2 sm:gap-3">
                    <div className="flex flex-col items-center gap-2">
                      <StepDot active={step === item} done={step > item} value={item} />
                      <span className="text-[11px] font-bold sm:text-[12px]">{STEPS[index]}</span>
                    </div>

                    {index < 2 ? <div className="h-0.5 w-8 bg-white/30 sm:w-14" /> : null}
                  </div>
                ))}
              </div>
            </div>

            <form
              onSubmit={(event) => event.preventDefault()}
              className="flex min-h-0 flex-1 flex-col bg-white"
            >
              <div ref={formContentRef} className="min-h-0 flex-1 overflow-y-auto">
                {step === 1 ? (
                  <div className="space-y-6 px-4 py-6 sm:px-6 sm:py-8 md:px-8">
                    <div>
                      <h3 className="text-[18px] font-black text-[var(--color-ink-panel)]">
                        Informações Básicas
                      </h3>
                      <p className="mt-2 text-[15px] font-medium text-[var(--color-text-caption)]">
                        Comece com a identificação principal do paciente.
                      </p>
                    </div>

                    <div>
                      <label className="mb-2 block text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">
                        Nome completo *
                      </label>
                      <div className="relative">
                        <UserRound className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-icon-muted)]" />
                        <Input
                          {...register("name")}
                          placeholder="Ex: Ana Carolina Silva"
                          className={`${fieldClass} pl-11`}
                        />
                      </div>
                      {errors.name ? (
                        <span className="mt-2 block text-xs text-danger-text">{errors.name.message}</span>
                      ) : null}
                    </div>

                    <div>
                      <label className="mb-2 block text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">
                        CPF *
                      </label>
                      <div className="relative">
                        <IdCard className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-icon-muted)]" />
                        <Controller
                          name="cpf"
                          control={control}
                          render={({ field }) => (
                            <Input
                              value={field.value}
                              onChange={(event) => field.onChange(formatCpfInput(event.target.value))}
                              placeholder="123.456.789-00"
                              inputMode="numeric"
                              className={`${fieldClass} pl-11`}
                            />
                          )}
                        />
                      </div>
                      {errors.cpf ? (
                        <span className="mt-2 block text-xs text-danger-text">{errors.cpf.message}</span>
                      ) : null}
                    </div>
                  </div>
                ) : null}

                {step === 2 ? (
                  <div className="space-y-6 px-4 py-6 sm:px-6 sm:py-8 md:px-8">
                    <div>
                      <h3 className="text-[18px] font-black text-[var(--color-ink-panel)]">
                        Contato e Convênio
                      </h3>
                      <p className="mt-2 text-[15px] font-medium text-[var(--color-text-caption)]">
                        Complete as informações para facilitar o atendimento.
                      </p>
                    </div>

                    <div>
                      <label className="mb-2 block text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">
                        Telefone *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-icon-muted)]" />
                        <Controller
                          name="phone"
                          control={control}
                          render={({ field }) => (
                            <Input
                              value={field.value}
                              onChange={(event) => field.onChange(formatPhoneInput(event.target.value))}
                              placeholder="(55) 34 99668-8345"
                              inputMode="numeric"
                              className={`${fieldClass} pl-11`}
                            />
                          )}
                        />
                      </div>
                      {errors.phone ? (
                        <span className="mt-2 block text-xs text-danger-text">{errors.phone.message}</span>
                      ) : null}
                    </div>

                    <div>
                      <label className="mb-2 block text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">
                        Convênio
                      </label>
                      <div className="relative">
                        <ShieldPlus className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-icon-muted)]" />
                        <Input
                          {...register("insurance")}
                          placeholder="Ex: Unimed, Bradesco, Particular"
                          className={`${fieldClass} pl-11`}
                        />
                      </div>
                    </div>
                  </div>
                ) : null}

                {step === 3 ? (
                  <div className="space-y-6 px-4 py-6 sm:px-6 sm:py-8 md:px-8">
                    <div>
                      <h3 className="text-[18px] font-black text-[var(--color-ink-panel)]">
                        Revisão do Cadastro
                      </h3>
                      <p className="mt-2 text-[15px] font-medium text-[var(--color-text-caption)]">
                        Confira os dados antes de salvar o paciente.
                      </p>
                    </div>

                    <div className="rounded-[22px] border border-[var(--color-border-panel)] bg-[radial-gradient(circle_at_top,_rgba(14,158,149,0.05),transparent_38%),var(--color-white)] p-6">
                      <div className="flex items-start justify-between gap-4 border-b border-[var(--color-border-panel-alt)] pb-5">
                        <div>
                          <p className="text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">
                            Paciente
                          </p>
                          <p className="mt-2 text-[18px] font-black text-[var(--color-ink-panel)]">
                            {watchedName || "-"}
                          </p>
                        </div>

                        <span
                          className={`rounded-full px-4 py-2 text-[12px] font-black ${
                            editingPatient ? selectedStatusBadgeClass : "bg-[var(--color-brand-teal)] text-white"
                          }`}
                        >
                          {editingPatient ? "Atualização" : "Novo Cadastro"}
                        </span>
                      </div>

                      <div className="grid gap-5 pt-5 sm:grid-cols-2">
                        <div>
                          <p className="text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">
                            CPF
                          </p>
                          <p className="mt-2 text-[15px] font-bold text-[var(--color-ink-panel)]">
                            {watchedCpf || "-"}
                          </p>
                        </div>

                        <div>
                          <p className="text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">
                            Telefone
                          </p>
                          <p className="mt-2 text-[15px] font-bold text-[var(--color-ink-panel)]">
                            {watchedPhone || "-"}
                          </p>
                        </div>

                        <div className="sm:col-span-2">
                          <p className="text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">
                            Convênio
                          </p>
                          <p className="mt-2 text-[15px] font-bold text-[var(--color-ink-panel)]">
                            {watchedInsurance || "Particular"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="flex flex-col gap-4 border-t border-[var(--color-border-panel-alt)] px-4 py-4 sm:px-6 sm:py-5 md:flex-row md:items-center md:justify-between md:px-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => (step === 1 ? handleDialogChange(false) : setStep((current) => current - 1))}
                  className="h-11 rounded-[16px] border-[var(--color-border-soft)] px-6 text-[15px] font-bold text-[var(--color-text-panel)]"
                >
                  {step === 1 ? "Cancelar" : "Voltar"}
                </Button>

                <div className="flex items-center gap-2">
                  {[1, 2, 3].map((item) => (
                    <span
                      key={item}
                      className={`h-2.5 rounded-full ${
                        item === step ? "w-7 bg-[var(--color-brand-teal)]" : "w-2.5 bg-[var(--color-ring-soft)]"
                      }`}
                    />
                  ))}
                </div>

                <Button
                  type="button"
                  onClick={() => void handlePrimaryAction()}
                  disabled={isSubmitting}
                  className="h-11 rounded-[16px] border-2 border-[var(--color-brand-teal-deep)] bg-[var(--color-brand-teal)] px-8 text-[15px] font-bold text-white shadow-[0_0_0_2px_rgba(255,255,255,0.9),0_12px_24px_rgba(14,158,149,0.22)] hover:bg-[var(--color-brand-teal-dark)]"
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : submitLabel}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col rounded-[14px] border border-border-light bg-white pt-2 shadow-sm">
        <div className="flex shrink-0 flex-col items-center justify-between gap-4 px-4 py-4 lg:flex-row">
          <div className="relative w-full max-w-md lg:flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Pesquisar por nome, CPF ou telefone..."
              className="h-10 w-full rounded-xl border border-border-light bg-background-card/50 pl-9 text-[14px] placeholder:text-text-muted focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-0"
              aria-label="Buscar pacientes"
            />
          </div>

          <div className="flex w-full shrink-0 items-center gap-2 lg:w-auto">
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value === "all" ? "" : value);
                setPage(0);
              }}
            >
              <SelectTrigger className="h-10 w-[130px] cursor-pointer rounded-[8px] border-border-light bg-white text-[13px] font-medium shadow-sm">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Ativo">Ativo</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={insuranceFilter}
              onValueChange={(value) => {
                setInsuranceFilter(value === "all" ? "" : value);
                setPage(0);
              }}
            >
              <SelectTrigger className="h-10 w-[160px] cursor-pointer rounded-[8px] border-border-light bg-white text-[13px] font-medium shadow-sm">
                <SelectValue placeholder="Seguro" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {insurances.map((insurance) => (
                  <SelectItem key={insurance} value={insurance}>
                    {insurance}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-10 w-[160px] cursor-pointer rounded-[8px] border-border-light bg-white text-[13px] font-medium text-text-secondary shadow-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name,asc">Nome (A-Z)</SelectItem>
                <SelectItem value="name,desc">Nome (Z-A)</SelectItem>
                <SelectItem value="createdAt,desc">Mais recentes</SelectItem>
                <SelectItem value="createdAt,asc">Mais antigos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="w-full flex-1 overflow-x-auto border-t border-border-light">
          <Table className="min-w-[960px]">
            <TableHeader className="bg-white">
              <TableRow className="border-b border-border-light px-4 hover:bg-transparent">
                <TableHead className="h-[52px] px-6 align-middle text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
                  Paciente
                </TableHead>
                <TableHead className="h-[52px] px-6 align-middle text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
                  CPF
                </TableHead>
                <TableHead className="h-[52px] px-6 align-middle text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
                  Telefone
                </TableHead>
                <TableHead className="h-[52px] whitespace-nowrap px-6 align-middle text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
                  Última visita
                </TableHead>
                <TableHead className="h-[52px] px-6 align-middle text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
                  Seguro
                </TableHead>
                <TableHead className="h-[52px] px-6 text-right align-middle text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-text-tertiary">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-brand-primary" />
                  </TableCell>
                </TableRow>
              ) : patients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-text-tertiary">
                    Nenhum paciente encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                patients.map((patient) => {
                  const badgeClass =
                    patient.status && statusClassMap[patient.status]
                      ? statusClassMap[patient.status]
                      : "bg-danger-bg text-danger-text";

                  return (
                    <TableRow
                      key={patient.id}
                      className="group border-b border-border-light transition-colors hover:bg-background-card/50"
                    >
                      <TableCell className="align-middle px-6 py-5">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 shrink-0 border border-border-light">
                            <AvatarImage src={patient.avatar} alt={patient.name} />
                            <AvatarFallback className="bg-brand-primary text-[13px] font-semibold text-white">
                              {patient.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex flex-col">
                            <p className="whitespace-nowrap text-[14px] font-semibold text-text-secondary">
                              {patient.name}
                            </p>
                            <span
                              className={`mt-1 w-fit whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-bold tracking-[0.2px] ${badgeClass}`}
                            >
                              {patient.status || "Inativo"}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="whitespace-nowrap px-6 py-5 align-middle text-[13px] font-medium text-text-tertiary">
                        {formatCpf(patient.cpf)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap px-6 py-5 align-middle text-[13px] font-medium text-text-tertiary">
                        {patient.phone}
                      </TableCell>
                      <TableCell className="whitespace-nowrap px-6 py-5 align-middle text-[13px] font-medium text-text-tertiary">
                        {formatDate(patient.lastVisit)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap px-6 py-5 align-middle text-[13px] font-medium text-text-secondary">
                        {patient.insurance || "Particular"}
                      </TableCell>

                      <TableCell className="align-middle px-6 py-5">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/pacientes/${patient.id}`)}
                            className="cursor-pointer text-text-muted transition-colors hover:text-brand-primary"
                            title="Ver perfil"
                          >
                            <Eye className="h-[18px] w-[18px]" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(patient)}
                            className="cursor-pointer text-text-muted transition-colors hover:text-brand-primary"
                            title="Editar paciente"
                          >
                            <PencilLine className="h-[18px] w-[18px]" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => void handleDeletePatient(patient)}
                            disabled={deletingPatientId === patient.id}
                            className="cursor-pointer text-text-muted transition-colors hover:text-danger-text"
                            title="Excluir paciente"
                          >
                            {deletingPatientId === patient.id ? (
                              <Loader2 className="h-[18px] w-[18px] animate-spin" />
                            ) : (
                              <Trash2 className="h-[18px] w-[18px]" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex shrink-0 flex-col items-center justify-between gap-4 rounded-b-[14px] border-t border-border-light bg-white px-4 py-[16px] sm:flex-row sm:px-6">
          <p className="text-[14px] font-medium text-text-tertiary">
            {totalElements > 0
              ? `Mostrando ${startIndex}-${endIndex} de ${totalElements} pacientes`
              : "Nenhum paciente"}
          </p>

          {totalPages > 1 ? (
            <div className="flex flex-wrap items-center justify-center gap-[6px]">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
                className="h-[36px] rounded-[6px] border border-border-light bg-white px-4 font-medium text-text-tertiary shadow-sm hover:text-text-secondary"
              >
                Anterior
              </Button>

              {Array.from({ length: Math.min(totalPages, 5) }, (_, index) => (
                <Button
                  key={index}
                  variant={page === index ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(index)}
                  className={
                    page === index
                      ? "flex h-[36px] w-[36px] items-center justify-center rounded-[6px] border-none bg-brand-primary p-0 font-medium text-white shadow-md hover:bg-brand-dark"
                      : "flex h-[36px] w-[36px] items-center justify-center rounded-[6px] border border-border-light bg-white p-0 font-medium text-text-secondary shadow-sm hover:bg-background-card"
                  }
                >
                  {index + 1}
                </Button>
              ))}

              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages - 1}
                onClick={() => setPage(page + 1)}
                className="h-[36px] rounded-[6px] border border-border-light bg-white px-4 font-medium text-text-secondary shadow-sm hover:bg-background-card"
              >
                Próximo
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
