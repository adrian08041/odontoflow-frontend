"use client";

import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { horariosSchema, type HorariosFormData } from "@/lib/schemas/horarios-schema";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function HorariosSettings() {
    const {
        register,
        control,
        handleSubmit,
        setValue,
        reset,
        formState: { errors }
    } = useForm<HorariosFormData>({
        resolver: zodResolver(horariosSchema),
        defaultValues: {
            dias: [
                { label: "Segunda-feira", active: true, start: "08:00", end: "18:00", hours: "10h" },
                { label: "Terça-feira", active: true, start: "08:00", end: "18:00", hours: "10h" },
                { label: "Quarta-feira", active: true, start: "08:00", end: "18:00", hours: "10h" },
                { label: "Quinta-feira", active: true, start: "08:00", end: "18:00", hours: "10h" },
                { label: "Sexta-feira", active: true, start: "08:00", end: "17:00", hours: "9h" },
                { label: "Sábado", active: true, start: "08:00", end: "12:00", hours: "4h" },
                { label: "Domingo", active: false, start: "", end: "", hours: "0h" },
            ],
            duracaoConsulta: "30 minutos",
            intervalo: "Sem intervalo",
        },
    });

    const { fields } = useFieldArray({
        control,
        name: "dias",
    });

    const dias = useWatch({
        control,
        name: "dias"
    });

    const onSubmit = (data: HorariosFormData) => {
        // eslint-disable-next-line no-console
        console.log("Horários salvos:", data);
        toast.success("Horários salvos com sucesso!");
    };

    return (
        <div className="bg-white rounded-[14px] border border-border-light shadow-sm p-4 sm:p-6 md:p-8 w-full overflow-hidden">
            <div className="mb-6 md:mb-8">
                <h2 className="text-[20px] font-bold text-text-primary leading-[28px]">
                    Horários de Atendimento
                </h2>
                <p className="text-[14px] text-text-tertiary font-medium mt-1">
                    Configure os dias e horários de funcionamento da clínica.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
                <div className="flex flex-col gap-6 mb-10">
                    {fields.map((field, index) => {
                        const isActive = dias?.[index]?.active ?? false;
                        const hours = dias?.[index]?.hours ?? "";

                        return (
                            <div key={field.id} className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 border-b border-border-light pb-6 last:border-0 last:pb-0">
                                {/* Day Label & Toggle */}
                                <div className="w-full sm:w-[180px] flex items-center justify-between shrink-0">
                                    <span className="text-[14px] font-bold text-text-primary">
                                        {field.label}
                                    </span>
                                    {/* Toggle Switch */}
                                    <div
                                        onClick={() => setValue(`dias.${index}.active`, !isActive, { shouldDirty: true })}
                                        className={cn(
                                            "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors",
                                            isActive ? 'bg-brand-primary' : 'bg-background-hover'
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                "inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform",
                                                isActive ? 'translate-x-[18px]' : 'translate-x-1'
                                            )}
                                        />
                                    </div>
                                </div>

                                {/* Time Inputs */}
                                {isActive ? (
                                    <div className="flex-1 flex flex-row items-center gap-2 sm:gap-4 w-full">
                                        <div className="flex-1">
                                            <label className="text-[12px] font-bold text-text-tertiary mb-1.5 block">
                                                Início
                                            </label>
                                            <Input
                                                type="time"
                                                {...register(`dias.${index}.start`)}
                                                className={cn(
                                                    "h-10 w-full rounded-lg bg-background-card/50 px-4 text-sm font-medium transition-all focus-visible:border-brand-primary focus-visible:ring-1 focus-visible:ring-brand-primary border-border-light"
                                                )}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-[12px] font-bold text-text-tertiary mb-1.5 block">
                                                Término
                                            </label>
                                            <Input
                                                type="time"
                                                {...register(`dias.${index}.end`)}
                                                className={cn(
                                                    "h-10 w-full rounded-lg bg-background-card/50 px-4 text-sm font-medium transition-all focus-visible:border-brand-primary focus-visible:ring-1 focus-visible:ring-brand-primary border-border-light"
                                                )}
                                            />
                                        </div>
                                        <div className="w-12 pt-6 text-right">
                                            <span className="text-[14px] font-bold text-text-muted">
                                                {hours}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex items-center h-[58px]">
                                        <span className="text-[14px] font-bold text-text-muted">
                                            Fechado
                                        </span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <h3 className="text-[16px] font-bold text-text-primary mb-4">
                    Intervalo de Atendimento
                </h3>

                <div className="flex flex-col sm:flex-row gap-6 mb-10">
                    <div className="flex-1">
                        <label className="text-[12px] font-bold text-text-tertiary mb-1.5 block">
                            Duração Padrão da Consulta
                        </label>
                        <select
                            {...register("duracaoConsulta")}
                            className={cn(
                                "flex h-11 w-full rounded-lg border bg-background-card/50 px-4 text-sm font-medium outline-none transition-all focus:border-brand-primary focus:ring-1 focus:ring-brand-primary",
                                errors.duracaoConsulta ? "border-danger-text focus:border-danger-text focus:ring-danger-text" : "border-border-light"
                            )}
                        >
                            <option value="30 minutos">30 minutos</option>
                            <option value="45 minutos">45 minutos</option>
                            <option value="1 hora">1 hora</option>
                        </select>
                        {errors.duracaoConsulta && <span className="text-xs text-danger-text block mt-1">{errors.duracaoConsulta.message}</span>}
                    </div>
                    <div className="flex-1">
                        <label className="text-[12px] font-bold text-text-tertiary mb-1.5 block">
                            Intervalo entre Consultas
                        </label>
                        <select
                            {...register("intervalo")}
                            className={cn(
                                "flex h-11 w-full rounded-lg border bg-background-card/50 px-4 text-sm font-medium outline-none transition-all focus:border-brand-primary focus:ring-1 focus:ring-brand-primary",
                                errors.duracaoConsulta ? "border-danger-text focus:border-danger-text focus:ring-danger-text" : "border-border-light"
                            )}
                        >
                            <option value="Sem intervalo">Sem intervalo</option>
                            <option value="5 minutos">5 minutos</option>
                            <option value="10 minutos">10 minutos</option>
                            <option value="15 minutos">15 minutos</option>
                        </select>
                        {errors.intervalo && <span className="text-xs text-danger-text block mt-1">{errors.intervalo.message}</span>}
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-border-light mt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => reset()}
                        className="h-10 px-6 rounded-lg text-text-secondary font-semibold text-sm hover:bg-background-card"
                    >
                        Descartar
                    </Button>
                    <Button
                        type="submit"
                        className="h-10 px-6 rounded-lg bg-brand-primary text-white font-semibold text-sm hover:bg-brand-dark shadow-sm"
                    >
                        Salvar Horários
                    </Button>
                </div>
            </form>
        </div>
    );
}
