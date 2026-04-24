"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import type { PatientFormData } from "@/lib/schemas/patient-schema";
import { PatientFormStepBasic } from "./patient-form-step-basic";
import { PatientFormStepContact } from "./patient-form-step-contact";
import { PatientFormStepReview } from "./patient-form-step-review";
import { PATIENT_DIALOG_STEPS } from "./patients-utils";
import { PatientsStepper } from "./patients-stepper";

type PatientDialogProps = {
  control: Control<PatientFormData>;
  description: string;
  errors: FieldErrors<PatientFormData>;
  isEditing: boolean;
  isOpen: boolean;
  isSubmitting: boolean;
  name?: string;
  cpf?: string;
  insurance?: string;
  onClose: () => void;
  onOpenChange: (open: boolean) => void;
  onPrimaryAction: () => void;
  phone?: string;
  register: UseFormRegister<PatientFormData>;
  reviewBadgeClass: string;
  step: number;
  title: string;
};

export function PatientDialog({
  control,
  description,
  errors,
  isEditing,
  isOpen,
  isSubmitting,
  name,
  cpf,
  insurance,
  onClose,
  onOpenChange,
  onPrimaryAction,
  phone,
  register,
  reviewBadgeClass,
  step,
  title,
}: PatientDialogProps) {
  const submitLabel = step < 3 ? "Próximo" : isEditing ? "Salvar Alterações" : "Salvar Paciente";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[90vh] w-[calc(100vw-24px)] max-w-[760px] flex-col overflow-hidden rounded-[26px] border-none p-0 shadow-[0_30px_80px_rgba(var(--shadow-panel-rgb),0.28)]"
      >
        <div className="sr-only">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Formulário em etapas para cadastrar ou editar um paciente.
          </DialogDescription>
        </div>

        <PatientsStepper
          description={description}
          onClose={onClose}
          step={step}
          stepLabels={PATIENT_DIALOG_STEPS}
          title={title}
        />

        <form
          onSubmit={(event) => event.preventDefault()}
          className="flex min-h-0 flex-1 flex-col bg-white"
        >
          <div className="min-h-0 flex-1 overflow-y-auto">
            {step === 1 ? (
              <PatientFormStepBasic control={control} errors={errors} register={register} />
            ) : null}

            {step === 2 ? (
              <PatientFormStepContact control={control} errors={errors} register={register} />
            ) : null}

            {step === 3 ? (
              <PatientFormStepReview
                cpf={cpf}
                insurance={insurance}
                isEditing={isEditing}
                name={name}
                phone={phone}
                statusBadgeClass={reviewBadgeClass}
              />
            ) : null}
          </div>

          <div className="flex flex-col gap-4 border-t border-[var(--color-border-panel-alt)] px-4 py-4 sm:px-6 sm:py-5 md:flex-row md:items-center md:justify-between md:px-8">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
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
              onClick={onPrimaryAction}
              disabled={isSubmitting}
              className="h-11 rounded-[16px] border-2 border-[var(--color-brand-teal-deep)] bg-[var(--color-brand-teal)] px-8 text-[15px] font-bold text-white shadow-[0_0_0_2px_rgba(255,255,255,0.9),0_12px_24px_rgba(14,158,149,0.22)] hover:bg-[var(--color-brand-teal-dark)]"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : submitLabel}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
