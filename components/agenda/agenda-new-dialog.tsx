"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Search,
  Stethoscope,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import * as z from "zod";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MOCK_DENTISTS, MOCK_PATIENTS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { AppointmentType } from "@/lib/types";

const formSchema = z.object({
  patientName: z.string().min(1, "Selecione um paciente"),
  dentistId: z.string().min(1, "Selecione um dentista"),
  date: z.number({ error: "Selecione uma data" }),
  time: z.string().min(1, "Selecione um horário"),
  type: z.enum(["evaluation", "return", "procedure", "urgency", "cleaning"], {
    message: "Selecione o tipo de agendamento",
  }),
  observations: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AgendaNewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TOTAL_STEPS = 4;
const STEP_LABELS = ["Informações", "Agenda", "Detalhes", "Confirmação"];

const APPOINTMENT_TYPES: {
  value: AppointmentType;
  label: string;
  dotColor: string;
}[] = [
  { value: "evaluation", label: "Avaliação", dotColor: "bg-blue-200" },
  { value: "return", label: "Retorno", dotColor: "bg-gray-200" },
  { value: "procedure", label: "Procedimento", dotColor: "bg-purple-200" },
  { value: "urgency", label: "Urgência", dotColor: "bg-danger-bg" },
  { value: "cleaning", label: "Limpeza", dotColor: "bg-green-200" },
];

const AVAILABLE_TIMES = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
];

const OCCUPIED_TIMES = ["09:00", "14:30"];

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

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .substring(0, 2);
}

export function AgendaNewDialog({ open, onOpenChange }: AgendaNewDialogProps) {
  const formContentRef = useRef<HTMLDivElement | null>(null);
  const [step, setStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [calendarMonth, setCalendarMonth] = useState(1);
  const [calendarYear, setCalendarYear] = useState(2026);

  const {
    control,
    reset,
    formState: { errors },
    trigger,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientName: "",
      dentistId: "",
      time: "",
      observations: "",
    },
    mode: "onChange",
  });

  const selectedPatient = useWatch({ control, name: "patientName" });
  const selectedDentistId = useWatch({ control, name: "dentistId" });
  const selectedDate = useWatch({ control, name: "date" });
  const selectedTime = useWatch({ control, name: "time" });
  const selectedType = useWatch({ control, name: "type" });
  const selectedObservations = useWatch({ control, name: "observations" });

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const dayLabels = ["D", "S", "T", "Q", "Q", "S", "S"];

  const filteredPatients = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return MOCK_PATIENTS.filter(
      (patient) =>
        patient.name.toLowerCase().includes(query) ||
        patient.cpf.includes(query) ||
        patient.phone.includes(query),
    );
  }, [searchQuery]);

  const selectedDentist = useMemo(
    () => MOCK_DENTISTS.find((dentist) => dentist.id === selectedDentistId),
    [selectedDentistId],
  );

  const selectedTypeLabel =
    APPOINTMENT_TYPES.find((type) => type.value === selectedType)?.label ?? "-";

  const daysInMonth = getDaysInMonth(calendarYear, calendarMonth);
  const firstDay = getFirstDayOfMonth(calendarYear, calendarMonth);
  const today = new Date();
  const todayDate =
    today.getFullYear() === calendarYear && today.getMonth() === calendarMonth
      ? today.getDate()
      : null;

  useEffect(() => {
    formContentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  function resetForm() {
    setStep(1);
    setSearchQuery("");
    reset();
    setCalendarMonth(1);
    setCalendarYear(2026);
  }

  function handleClose() {
    resetForm();
    onOpenChange(false);
  }

  async function handleNextStep() {
    if (step === 1) {
      const isValid = await trigger(["patientName", "dentistId"]);
      if (!isValid) return;
      setStep(2);
      return;
    }

    if (step === 2) {
      const isValid = await trigger(["date", "time"]);
      if (!isValid) return;
      setStep(3);
      return;
    }

    if (step === 3) {
      const isValid = await trigger(["type"]);
      if (!isValid) return;
      setStep(4);
    }
  }

  function navigateMonth(direction: number) {
    let nextMonth = calendarMonth + direction;
    let nextYear = calendarYear;
    if (nextMonth > 11) {
      nextMonth = 0;
      nextYear++;
    }
    if (nextMonth < 0) {
      nextMonth = 11;
      nextYear--;
    }
    setCalendarMonth(nextMonth);
    setCalendarYear(nextYear);
  }

  function getFormattedDate(dateNum?: number) {
    const currentDate = dateNum ?? selectedDate;
    if (currentDate === undefined || currentDate === null) return "-";
    const date = new Date(calendarYear, calendarMonth, currentDate);
    const dayNames = [
      "Domingo",
      "Segunda",
      "Terça",
      "Quarta",
      "Quinta",
      "Sexta",
      "Sábado",
    ];
    const shortMonths = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    return `${dayNames[date.getDay()]}, ${currentDate} de ${shortMonths[calendarMonth]}`;
  }

  function onSubmit() {
    toast.success("Agendamento criado com sucesso!");
    handleClose();
  }

  async function handlePrimaryAction() {
    if (step < TOTAL_STEPS) {
      await handleNextStep();
      return;
    }

    const isValid = await trigger(["patientName", "dentistId", "date", "time", "type"]);
    if (!isValid) {
      if (!selectedPatient || !selectedDentistId) {
        setStep(1);
        return;
      }

      if (selectedDate === undefined || selectedDate === null || !selectedTime) {
        setStep(2);
        return;
      }

      setStep(3);
      return;
    }

    onSubmit();
  }

  return (
    <Dialog open={open} onOpenChange={(next) => (!next ? handleClose() : onOpenChange(true))}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[90vh] w-[calc(100vw-24px)] max-w-[760px] flex-col overflow-hidden rounded-[26px] border-none p-0 shadow-[0_30px_80px_rgba(var(--shadow-panel-rgb),0.28)]"
      >
        <div className="sr-only">
          <DialogTitle>Novo Agendamento</DialogTitle>
          <DialogDescription>
            Formulário em etapas para criar um novo agendamento.
          </DialogDescription>
        </div>

        <div className="bg-[linear-gradient(135deg,var(--color-brand-teal)_0%,var(--color-brand-teal-soft)_100%)] px-4 py-6 text-white sm:px-6 sm:py-7 md:px-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-[14px] border border-white/20 bg-white/10">
                <Stethoscope className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-[20px] font-black">Novo Agendamento</h2>
                <p className="mt-1 text-[14px] text-white/85">
                  Organize a nova consulta com um fluxo mais claro e visual.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClose}
              aria-label="Fechar"
              className="rounded-full p-2 hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-center sm:mt-8 sm:gap-3">
            {[1, 2, 3, 4].map((item, index) => (
              <div key={item} className="flex items-center gap-2 sm:gap-3">
                <div className="flex flex-col items-center gap-2">
                  <StepDot active={step === item} done={step > item} value={item} />
                  <span className="text-[11px] font-bold sm:text-[12px]">{STEP_LABELS[index]}</span>
                </div>
                {index < TOTAL_STEPS - 1 ? <div className="h-0.5 w-8 bg-white/30 sm:w-12 md:w-14" /> : null}
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
                  Informações Iniciais
                </h3>
                <p className="mt-2 text-[15px] font-medium text-[var(--color-text-caption)]">
                  Selecione o paciente e o profissional responsável.
                </p>
              </div>

              <div>
                <label
                  className="mb-2 block text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]"
                  htmlFor="patient-search"
                >
                  Paciente *
                </label>
                <div className="relative">
                  <Input
                    id="patient-search"
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Busque por nome, CPF ou celular..."
                    className="h-12 rounded-[16px] border-[var(--color-border-soft)] bg-[var(--color-surface-panel)] pl-4 pr-10 text-[15px] shadow-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-teal)]/30"
                  />
                  <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--color-icon-muted)]" />
                </div>

                <Controller
                  name="patientName"
                  control={control}
                  render={({ field }) => (
                    <>
                      {filteredPatients.length > 0 ? (
                        <div className="mt-3 space-y-2 rounded-[18px] border border-[var(--color-border-panel)] bg-[var(--color-surface-panel-alt)] p-3">
                          {filteredPatients.map((patient) => (
                            <button
                              key={patient.id}
                              type="button"
                              onClick={() => {
                                field.onChange(patient.name);
                                void trigger("patientName");
                              }}
                              className={cn(
                                "flex w-full items-center gap-3 rounded-[14px] border p-3 text-left transition-colors",
                                field.value === patient.name
                                  ? "border-[var(--color-brand-teal)] bg-[var(--color-brand-teal-surface)]"
                                  : "border-[var(--color-border-panel-alt)] bg-white hover:border-[var(--color-brand-teal)]",
                              )}
                            >
                              <Avatar className="h-10 w-10 border border-border-light">
                                <AvatarFallback className="bg-background-card text-xs font-semibold text-brand-primary">
                                  {getInitials(patient.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-bold text-text-primary">
                                  {patient.name}
                                </p>
                                <p className="text-xs text-text-tertiary">{patient.cpf}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : null}

                      {searchQuery && filteredPatients.length === 0 ? (
                        <p className="mt-3 text-sm text-text-muted">
                          Nenhum paciente encontrado.
                        </p>
                      ) : null}

                      {errors.patientName ? (
                        <p className="mt-2 text-sm text-danger-text">{errors.patientName.message}</p>
                      ) : null}
                    </>
                  )}
                />
              </div>

              <div>
                <label className="mb-2 block text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">
                  Profissional *
                </label>
                <Controller
                  name="dentistId"
                  control={control}
                  render={({ field }) => (
                    <>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {MOCK_DENTISTS.map((dentist) => (
                          <button
                            key={dentist.id}
                            type="button"
                            onClick={() => {
                              field.onChange(dentist.id);
                              void trigger("dentistId");
                            }}
                            className={cn(
                              "flex items-center gap-3 rounded-[16px] border p-4 text-left transition-colors",
                              field.value === dentist.id
                                ? "border-[var(--color-brand-teal)] bg-[var(--color-brand-teal-surface)]"
                                : "border-[var(--color-border-panel)] bg-white hover:border-[var(--color-brand-teal)]",
                            )}
                          >
                            <Avatar className="h-12 w-12 border border-border-light">
                              <AvatarFallback className="bg-background-card text-xs font-semibold text-brand-primary">
                                {getInitials(dentist.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-bold text-text-primary">{dentist.name}</p>
                              <p className="text-xs font-medium text-text-tertiary">
                                {dentist.specialty}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                      {errors.dentistId ? (
                        <p className="mt-2 text-sm text-danger-text">{errors.dentistId.message}</p>
                      ) : null}
                    </>
                  )}
                />
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-6 px-4 py-6 sm:px-6 sm:py-8 md:px-8">
              <div>
                <h3 className="text-[18px] font-black text-[var(--color-ink-panel)]">
                  Data e Horário
                </h3>
                <p className="mt-2 text-[15px] font-medium text-[var(--color-text-caption)]">
                  Escolha quando a consulta será realizada.
                </p>
              </div>

              <div className="grid gap-5 lg:grid-cols-[1.2fr_0.9fr]">
                <div className="rounded-[20px] border border-[var(--color-border-panel)] bg-[var(--color-surface-panel-alt)] p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="text-base font-black text-[var(--color-ink-panel)]">
                      {monthNames[calendarMonth]} {calendarYear}
                    </h4>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        onClick={() => navigateMonth(-1)}
                        className="border-background-hover"
                        aria-label="Mês anterior"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        onClick={() => navigateMonth(1)}
                        className="border-background-hover"
                        aria-label="Próximo mês"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mb-2 grid grid-cols-7">
                    {dayLabels.map((label, index) => (
                      <div key={label + index} className="text-center">
                        <span className="text-[10px] font-bold text-text-muted">{label}</span>
                      </div>
                    ))}
                  </div>

                  <Controller
                    name="date"
                    control={control}
                    render={({ field }) => (
                      <>
                        <div className="grid grid-cols-7 gap-1">
                          {Array.from({ length: firstDay }).map((_, index) => (
                            <div key={`empty-${index}`} />
                          ))}

                          {Array.from({ length: daysInMonth }).map((_, index) => {
                            const day = index + 1;
                            const isPast = day < (todayDate ?? 999);
                            const isSelected = field.value === day;

                            return (
                              <button
                                key={day}
                                type="button"
                                onClick={() => {
                                  if (!isPast) {
                                    field.onChange(day);
                                    void trigger("date");
                                  }
                                }}
                                disabled={isPast}
                                className={cn(
                                  "aspect-square rounded-[12px] text-sm font-semibold transition-colors",
                                  isSelected
                                    ? "bg-[var(--color-brand-teal)] text-white"
                                    : isPast
                                      ? "cursor-not-allowed text-border-light"
                                      : "border border-transparent text-text-secondary hover:border-black/10 hover:bg-white",
                                )}
                              >
                                {day}
                              </button>
                            );
                          })}
                        </div>
                        {errors.date ? (
                          <p className="mt-2 text-sm text-danger-text">{errors.date.message}</p>
                        ) : null}
                      </>
                    )}
                  />
                </div>

                <div className="rounded-[20px] border border-[var(--color-border-panel)] bg-[var(--color-surface-panel-alt)] p-4">
                  <div className="mb-4 flex items-center gap-2">
                    <Clock3 className="h-4 w-4 text-[var(--color-icon-muted)]" />
                    <h4 className="text-base font-black text-[var(--color-ink-panel)]">
                      Horários disponíveis
                    </h4>
                  </div>
                  <Controller
                    name="time"
                    control={control}
                    render={({ field }) => (
                      <>
                        <div className="grid grid-cols-3 gap-2">
                          {AVAILABLE_TIMES.map((time) => {
                            const isOccupied = OCCUPIED_TIMES.includes(time);
                            const isSelected = field.value === time;
                            return (
                              <Button
                                key={time}
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  if (!isOccupied) {
                                    field.onChange(time);
                                    void trigger("time");
                                  }
                                }}
                                disabled={isOccupied}
                                className={cn(
                                  "h-10 rounded-[12px] text-xs font-bold",
                                  isSelected
                                    ? "border-brand-primary bg-brand-primary text-white hover:bg-brand-dark hover:text-white"
                                    : isOccupied
                                      ? "cursor-not-allowed border-background-hover bg-background-card text-border-light"
                                      : "border-border-light bg-white text-text-secondary hover:border-brand-primary hover:text-brand-primary",
                                )}
                              >
                                {time}
                              </Button>
                            );
                          })}
                        </div>
                        {errors.time ? (
                          <p className="mt-2 text-sm text-danger-text">{errors.time.message}</p>
                        ) : null}
                      </>
                    )}
                  />
                </div>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-6 px-4 py-6 sm:px-6 sm:py-8 md:px-8">
              <div>
                <h3 className="text-[18px] font-black text-[var(--color-ink-panel)]">
                  Detalhes do Atendimento
                </h3>
                <p className="mt-2 text-[15px] font-medium text-[var(--color-text-caption)]">
                  Defina o tipo de agendamento e registre observações importantes.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">
                  Tipo de Agendamento *
                </label>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <>
                      <div className="flex flex-wrap gap-2">
                        {APPOINTMENT_TYPES.map((typeOption) => (
                          <Button
                            key={typeOption.value}
                            type="button"
                            variant="outline"
                            onClick={() => {
                              field.onChange(typeOption.value);
                              void trigger("type");
                            }}
                            className={cn(
                              "gap-2 rounded-[14px] font-bold",
                              field.value === typeOption.value
                                ? "border-brand-primary bg-brand-light hover:bg-brand-light"
                                : "border-background-hover hover:border-border-light",
                            )}
                          >
                            <div className={cn("h-3 w-3 rounded-full", typeOption.dotColor)} />
                            {typeOption.label}
                          </Button>
                        ))}
                      </div>
                      {errors.type ? (
                        <p className="mt-2 text-sm text-danger-text">{errors.type.message}</p>
                      ) : null}
                    </>
                  )}
                />
              </div>

              <div>
                <label className="mb-2 block text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">
                  Observações
                </label>
                <Controller
                  name="observations"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      placeholder="Ex: Paciente relatou dor, trazer exames anteriores..."
                      className="min-h-[120px] w-full rounded-[16px] border border-[var(--color-border-soft)] bg-[var(--color-surface-panel)] px-4 py-3 text-[15px] outline-none focus:border-[var(--color-brand-teal)] focus:ring-2 focus:ring-[var(--color-brand-teal)]/30"
                    />
                  )}
                />
              </div>
            </div>
          ) : null}

          {step === 4 ? (
            <div className="space-y-6 px-4 py-6 sm:px-6 sm:py-8 md:px-8">
              <div>
                <h3 className="text-[18px] font-black text-[var(--color-ink-panel)]">
                  Confirmação do Agendamento
                </h3>
                <p className="mt-2 text-[15px] font-medium text-[var(--color-text-caption)]">
                  Revise todos os dados antes de confirmar o agendamento do paciente.
                </p>
              </div>

              <div className="rounded-[22px] border border-[var(--color-border-panel)] bg-[radial-gradient(circle_at_top,_rgba(14,158,149,0.05),transparent_38%),var(--color-white)] p-6">
                <div className="flex items-start justify-between gap-4 border-b border-[var(--color-border-panel-alt)] pb-5">
                  <div>
                    <p className="text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">
                      Agendamento
                    </p>
                    <p className="mt-2 text-[18px] font-black text-[var(--color-ink-panel)]">
                      {selectedPatient || "-"}
                    </p>
                  </div>
                  <span className="rounded-full bg-[var(--color-brand-teal)] px-4 py-2 text-[12px] font-black text-white">
                    {selectedTypeLabel}
                  </span>
                </div>

                <div className="grid gap-5 pt-5 sm:grid-cols-2">
                  <div>
                    <p className="text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">
                      Profissional
                    </p>
                    <p className="mt-2 text-[15px] font-bold text-[var(--color-ink-panel)]">
                      {selectedDentist?.name || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">
                      Especialidade
                    </p>
                    <p className="mt-2 text-[15px] font-bold text-[var(--color-ink-panel)]">
                      {selectedDentist?.specialty || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">
                      Tipo
                    </p>
                    <p className="mt-2 text-[15px] font-bold text-[var(--color-ink-panel)]">
                      {selectedTypeLabel}
                    </p>
                  </div>
                  <div>
                    <p className="text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">
                      Data
                    </p>
                    <p className="mt-2 text-[15px] font-bold text-[var(--color-ink-panel)]">
                      {getFormattedDate()}
                    </p>
                  </div>
                  <div>
                    <p className="text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">
                      Horário
                    </p>
                    <p className="mt-2 text-[15px] font-bold text-[var(--color-ink-panel)]">
                      {selectedTime || "-"}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">
                      Observações
                    </p>
                    <p className="mt-2 text-[15px] font-bold text-[var(--color-ink-panel)]">
                      {selectedObservations || "Sem observações registradas."}
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
              onClick={() => (step === 1 ? handleClose() : setStep((current) => current - 1))}
              className="h-11 rounded-[16px] border-[var(--color-border-soft)] px-6 text-[15px] font-bold text-[var(--color-text-panel)]"
            >
              {step === 1 ? "Cancelar" : "Voltar"}
            </Button>

            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((item) => (
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
              className="h-11 rounded-[16px] border-2 border-[var(--color-brand-teal-deep)] bg-[var(--color-brand-teal)] px-8 text-[15px] font-bold text-white shadow-[0_0_0_2px_rgba(255,255,255,0.9),0_12px_24px_rgba(14,158,149,0.22)] hover:bg-[var(--color-brand-teal-dark)]"
            >
              {step < TOTAL_STEPS ? "Próximo" : "Confirmar Agendamento"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
