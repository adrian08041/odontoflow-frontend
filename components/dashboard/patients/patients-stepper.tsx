"use client";

import { Check, UserRound, X } from "lucide-react";

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

type PatientsStepperProps = {
  description: string;
  onClose: () => void;
  step: number;
  stepLabels: string[];
  title: string;
};

export function PatientsStepper({
  description,
  onClose,
  step,
  stepLabels,
  title,
}: PatientsStepperProps) {
  return (
    <div className="bg-[linear-gradient(135deg,var(--color-brand-teal)_0%,var(--color-brand-teal-soft)_100%)] px-4 py-6 text-white sm:px-6 sm:py-7 md:px-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-[14px] border border-white/20 bg-white/10">
            <UserRound className="h-6 w-6" />
          </div>

          <div>
            <h2 className="text-[20px] font-black">{title}</h2>
            <p className="mt-1 text-[14px] text-white/85">{description}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="rounded-full p-2 hover:bg-white/10"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 text-center sm:mt-8 sm:gap-3">
        {Array.from({ length: stepLabels.length }, (_, index) => index + 1).map((item, index) => (
          <div key={item} className="flex items-center gap-2 sm:gap-3">
            <div className="flex flex-col items-center gap-2">
              <StepDot active={step === item} done={step > item} value={item} />
              <span className="text-[11px] font-bold sm:text-[12px]">{stepLabels[index]}</span>
            </div>

            {index < stepLabels.length - 1 ? <div className="h-0.5 w-8 bg-white/30 sm:w-14" /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
