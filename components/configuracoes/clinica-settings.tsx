import type { ComponentType, ReactNode } from "react";
import { Building2, Globe, Mail, MapPin, Phone, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { clinicaSchema, type ClinicaFormData } from "@/lib/schemas/clinica-schema";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type FieldProps = {
  label: string;
  icon?: ComponentType<{ className?: string }>;
  error?: string;
  children: ReactNode;
};

function Field({ label, icon: Icon, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[12px] font-black uppercase tracking-[0.16em] text-[#93a0bd]">{label}</label>
      <div className="relative">
        {Icon ? <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#c0cadf]" /> : null}
        {children}
      </div>
      {error ? <span className="text-xs font-medium text-red-500">{error}</span> : null}
    </div>
  );
}

export function ClinicaSettings() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ClinicaFormData>({
    resolver: zodResolver(clinicaSchema),
    defaultValues: {
      nomeFantasia: "OdontoFlow Clinica Matriz",
      cnpj: "12.345.678/0001-90",
      telefone: "(11) 4567-8900",
      endereco: "Av. Paulista, 1200 - Conj 12 - Sao Paulo, SP",
      email: "contato@odontoflow.com",
      website: "www.odontoflow.com.br",
    },
  });

  const onSubmit = (data: ClinicaFormData) => {
    toast.success("Configuracoes atualizadas com sucesso!");
    console.log("Salvo:", data);
  };

  const inputClassName =
    "h-12 rounded-[16px] border border-[#d9e1ef] bg-[#f8fbff] pr-4 text-[15px] font-medium text-[#0f274c] shadow-none focus-visible:ring-2 focus-visible:ring-[#0e9e95]/30 focus-visible:border-[#0e9e95]";

  return (
    <div className="overflow-hidden rounded-[30px] border border-[#dfe6f2] bg-white shadow-[0_8px_24px_rgba(15,39,76,0.06)]">
      <div className="border-b border-[#eef2f8] px-6 py-8 md:px-12 md:py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <div className="flex shrink-0 flex-col items-center gap-3">
            <div className="flex h-24 w-24 items-center justify-center rounded-[26px] border-2 border-dashed border-[#d8e0ef] bg-[#fafcff] text-[#c3cedf]">
              <Building2 className="h-10 w-10" />
            </div>
            <button type="button" className="text-[12px] font-black uppercase tracking-[0.12em] text-[#93a0bd]">
              Alterar Logo
            </button>
          </div>

          <div className="pt-2">
            <h2 className="text-[20px] font-black text-[#0f274c] md:text-[22px]">Informacoes da Clinica</h2>
            <p className="mt-1 text-[15px] font-medium text-[#5f7091]">
              Configure os dados cadastrais da sua unidade.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-8 md:px-12 md:py-10">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Field label="Nome Fantasia" error={errors.nomeFantasia?.message}>
            <Input {...register("nomeFantasia")} className={cn(inputClassName, errors.nomeFantasia && "border-red-500")} />
          </Field>

          <Field label="Endereco Completo" icon={MapPin} error={errors.endereco?.message}>
            <Input {...register("endereco")} className={cn(inputClassName, "pl-11", errors.endereco && "border-red-500")} />
          </Field>

          <Field label="CNPJ" error={errors.cnpj?.message}>
            <Input {...register("cnpj")} className={cn(inputClassName, errors.cnpj && "border-red-500")} />
          </Field>

          <Field label="E-mail Clinico" icon={Mail} error={errors.email?.message}>
            <Input {...register("email")} className={cn(inputClassName, "pl-11", errors.email && "border-red-500")} />
          </Field>

          <Field label="Telefone de Contato" icon={Phone} error={errors.telefone?.message}>
            <Input {...register("telefone")} className={cn(inputClassName, "pl-11", errors.telefone && "border-red-500")} />
          </Field>

          <Field label="Website" icon={Globe} error={errors.website?.message}>
            <Input {...register("website")} className={cn(inputClassName, "pl-11", errors.website && "border-red-500")} />
          </Field>
        </div>

        <div className="mt-12 flex flex-col-reverse justify-end gap-3 border-t border-[#eef2f8] pt-8 sm:flex-row">
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
            <Upload className="mr-2 h-4 w-4" />
            Salvar Alteracoes
          </Button>
        </div>
      </form>
    </div>
  );
}
