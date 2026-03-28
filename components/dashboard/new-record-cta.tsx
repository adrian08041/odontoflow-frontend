import { FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

export function NewRecordCta() {
  return (
    <div className="bg-gradient-to-b from-brand-primary to-brand-dark rounded-xl shadow-md w-full md:w-[380px] shrink-0 relative overflow-hidden p-6 md:p-8 flex flex-col justify-center min-h-[160px]">
      <FileText className="absolute -right-3.5 top-[92px] size-32 opacity-20 pointer-events-none text-white mix-blend-overlay" />

      <h4 className="font-bold text-white text-xl leading-7 mb-2">
        Novo Prontuário
      </h4>
      <p className="text-white/80 text-sm leading-5 max-w-[280px] mb-6">
        Inicie o registro clínico de um novo paciente agora mesmo.
      </p>
      <Button className="bg-white text-brand-primary font-bold text-sm w-[173px] h-10 rounded-lg shadow-lg hover:bg-white/90 hover:scale-105 transition-transform">
        Registrar Paciente
      </Button>
    </div>
  )
}
