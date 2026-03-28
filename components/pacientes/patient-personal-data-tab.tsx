import { ChevronDown } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { Patient } from "@/lib/types"

interface PatientPersonalDataTabProps {
  patient: Patient
}

export function PatientPersonalDataTab({ patient }: PatientPersonalDataTabProps) {
  return (
    <Card className="bg-white border-border-light shadow-sm p-8 pt-6">
      <h3 className="text-lg font-bold text-text-primary mb-6">
        Informações Gerais
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
        <div className="space-y-2 flex flex-col">
          <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest">
            Nome Completo
          </label>
          <Input
            readOnly
            defaultValue={patient.name}
            className="h-12 bg-background-card border-border-light text-text-secondary font-medium text-sm rounded-lg"
          />
        </div>
        <div className="space-y-2 flex flex-col">
          <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest">
            Email
          </label>
          <Input
            readOnly
            defaultValue={`${patient.name.split(" ")[0].toLowerCase()}.silva@email.com`}
            className="h-12 bg-background-card border-border-light text-text-secondary font-medium text-sm rounded-lg"
          />
        </div>

        <div className="space-y-2 flex flex-col">
          <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest">
            Data de Nascimento
          </label>
          <Input
            readOnly
            defaultValue="15/05/1998"
            className="h-12 bg-background-card border-border-light text-text-secondary font-medium text-sm rounded-lg"
          />
        </div>
        <div className="space-y-2 flex flex-col">
          <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest">
            Gênero
          </label>
          <div className="relative">
            <Input
              readOnly
              defaultValue="Feminino"
              className="h-12 bg-background-card border-border-light text-text-secondary font-medium text-sm rounded-lg cursor-default"
            />
            <ChevronDown className="size-5 absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          </div>
        </div>

        <div className="space-y-2 flex flex-col">
          <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest">
            CPF
          </label>
          <Input
            readOnly
            defaultValue={patient.cpf}
            className="h-12 bg-background-card border-border-light text-text-secondary font-medium text-sm rounded-lg"
          />
        </div>
        <div className="space-y-2 flex flex-col">
          <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest">
            Telefone Principal
          </label>
          <Input
            readOnly
            defaultValue={patient.phone}
            className="h-12 bg-background-card border-border-light text-text-secondary font-medium text-sm rounded-lg"
          />
        </div>

        <div className="space-y-2 flex flex-col md:col-span-2">
          <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest">
            Endereço Residencial
          </label>
          <Input
            readOnly
            defaultValue="Rua das Flores, 123 - Apto 45, São Paulo - SP"
            className="h-12 bg-background-card border-border-light text-text-secondary font-medium text-sm rounded-lg"
          />
        </div>
      </div>
    </Card>
  )
}
