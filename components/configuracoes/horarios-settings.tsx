"use client";

import { useFieldArray, useForm, useWatch } from "react-hook-form";
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
    formState: { errors },
  } = useForm<HorariosFormData>({
    resolver: zodResolver(horariosSchema),
    defaultValues: {
      dias: [
        { label: "Segunda-feira", active: true, start: "08:00", end: "18:00", hours: "10h" },
        { label: "Terca-feira", active: true, start: "08:00", end: "18:00", hours: "10h" },
        { label: "Quarta-feira", active: true, start: "08:00", end: "18:00", hours: "10h" },
        { label: "Quinta-feira", active: true, start: "08:00", end: "18:00", hours: "10h" },
        { label: "Sexta-feira", active: true, start: "08:00", end: "17:00", hours: "9h" },
        { label: "Sabado", active: true, start: "08:00", end: "12:00", hours: "4h" },
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
    name: "dias",
  });

  const onSubmit = (data: HorariosFormData) => {
    console.log("Horarios salvos:", data);
    toast.success("Horarios salvos com sucesso!");
  };

  return (
    <div className="overflow-hidden rounded-[30px] border border-[#dfe6f2] bg-white shadow-[0_8px_24px_rgba(15,39,76,0.06)]">
      <div className="border-b border-[#eef2f8] px-6 py-8 md:px-12">
        <h2 className="text-[20px] font-black text-[#0f274c] md:text-[22px]">Horarios de Atendimento</h2>
        <p className="mt-1 text-[15px] font-medium text-[#5f7091]">Configure os dias e horarios de funcionamento da clinica.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-8 md:px-12">
        <div className="space-y-5">
          {fields.map((field, index) => {
            const isActive = dias?.[index]?.active ?? false;
            const hours = dias?.[index]?.hours ?? "0h";

            return (
              <div key={field.id} className="rounded-[22px] border border-[#dfe6f2] bg-white px-5 py-6">
                <div className="grid items-center gap-5 xl:grid-cols-[180px_1fr_1fr_56px]">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setValue(`dias.${index}.active`, !isActive, { shouldDirty: true })}
                      className={cn(
                        "relative inline-flex h-7 w-12 items-center rounded-full transition-colors",
                        isActive ? "bg-[#0e9e95]" : "bg-[#d6deeb]"
                      )}
                    >
                      <span
                        className={cn(
                          "inline-block h-5 w-5 rounded-full bg-white transition-transform",
                          isActive ? "translate-x-6" : "translate-x-1"
                        )}
                      />
                    </button>
                    <span className="text-[16px] font-black text-[#0f274c]">{field.label}</span>
                  </div>

                  <div>
                    <label className="mb-2 block text-[12px] font-black uppercase tracking-[0.16em] text-[#93a0bd]">Inicio</label>
                    <Input
                      type="time"
                      disabled={!isActive}
                      {...register(`dias.${index}.start`)}
                      className="h-12 rounded-[16px] border-[#d9e1ef] bg-[#f8fbff] text-[15px] font-bold text-[#0f274c] focus-visible:ring-2 focus-visible:ring-[#0e9e95]/30"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-[12px] font-black uppercase tracking-[0.16em] text-[#93a0bd]">Termino</label>
                    <Input
                      type="time"
                      disabled={!isActive}
                      {...register(`dias.${index}.end`)}
                      className="h-12 rounded-[16px] border-[#d9e1ef] bg-[#f8fbff] text-[15px] font-bold text-[#0f274c] focus-visible:ring-2 focus-visible:ring-[#0e9e95]/30"
                    />
                  </div>

                  <div className="pt-7 text-right text-[22px] font-black text-[#9dabc4]">{hours}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 border-t border-[#eef2f8] pt-10">
          <h3 className="text-[18px] font-black text-[#0f274c]">Intervalo de Atendimento</h3>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-black uppercase tracking-[0.16em] text-[#93a0bd]">
                Duracao Padrao da Consulta
              </label>
              <select
                {...register("duracaoConsulta")}
                className={cn(
                  "h-12 rounded-[16px] border border-[#d9e1ef] bg-[#f8fbff] px-4 text-[15px] font-medium text-[#0f274c] outline-none transition focus:border-[#0e9e95] focus:ring-2 focus:ring-[#0e9e95]/30",
                  errors.duracaoConsulta && "border-red-500"
                )}
              >
                <option value="30 minutos">30 minutos</option>
                <option value="45 minutos">45 minutos</option>
                <option value="1 hora">1 hora</option>
              </select>
              {errors.duracaoConsulta ? (
                <span className="text-xs font-medium text-red-500">{errors.duracaoConsulta.message}</span>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-black uppercase tracking-[0.16em] text-[#93a0bd]">
                Intervalo entre Consultas
              </label>
              <select
                {...register("intervalo")}
                className={cn(
                  "h-12 rounded-[16px] border border-[#d9e1ef] bg-[#f8fbff] px-4 text-[15px] font-medium text-[#0f274c] outline-none transition focus:border-[#0e9e95] focus:ring-2 focus:ring-[#0e9e95]/30",
                  errors.intervalo && "border-red-500"
                )}
              >
                <option value="Sem intervalo">Sem intervalo</option>
                <option value="5 minutos">5 minutos</option>
                <option value="10 minutos">10 minutos</option>
                <option value="15 minutos">15 minutos</option>
              </select>
              {errors.intervalo ? (
                <span className="text-xs font-medium text-red-500">{errors.intervalo.message}</span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col-reverse justify-end gap-3 border-t border-[#eef2f8] pt-8 sm:flex-row">
          <Button
            type="button"
            variant="ghost"
            onClick={() => reset()}
            className="h-11 rounded-[16px] px-6 text-[15px] font-bold text-[#67799a] hover:bg-[#f5f8fc]"
          >
            Descartar
          </Button>
          <Button
            type="submit"
            className="h-11 rounded-[16px] bg-[#0e9e95] px-7 text-[15px] font-bold text-white shadow-[0_12px_24px_rgba(14,158,149,0.22)] hover:bg-[#0c8d85]"
          >
            Salvar Horarios
          </Button>
        </div>
      </form>
    </div>
  );
}
