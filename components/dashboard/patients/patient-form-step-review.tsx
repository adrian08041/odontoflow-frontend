"use client";

type PatientFormStepReviewProps = {
  cpf?: string;
  insurance?: string;
  isEditing: boolean;
  name?: string;
  phone?: string;
  statusBadgeClass: string;
};

export function PatientFormStepReview({
  cpf,
  insurance,
  isEditing,
  name,
  phone,
  statusBadgeClass,
}: PatientFormStepReviewProps) {
  return (
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
              {name || "-"}
            </p>
          </div>

          <span
            className={`rounded-full px-4 py-2 text-[12px] font-black ${
              isEditing ? statusBadgeClass : "bg-[var(--color-brand-teal)] text-white"
            }`}
          >
            {isEditing ? "Atualização" : "Novo Cadastro"}
          </span>
        </div>

        <div className="grid gap-5 pt-5 sm:grid-cols-2">
          <div>
            <p className="text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">
              CPF
            </p>
            <p className="mt-2 text-[15px] font-bold text-[var(--color-ink-panel)]">
              {cpf || "-"}
            </p>
          </div>

          <div>
            <p className="text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">
              Telefone
            </p>
            <p className="mt-2 text-[15px] font-bold text-[var(--color-ink-panel)]">
              {phone || "-"}
            </p>
          </div>

          <div className="sm:col-span-2">
            <p className="text-[12px] font-black uppercase tracking-[0.14em] text-[var(--color-text-faint-alt)]">
              Convênio
            </p>
            <p className="mt-2 text-[15px] font-bold text-[var(--color-ink-panel)]">
              {insurance || "Particular"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
