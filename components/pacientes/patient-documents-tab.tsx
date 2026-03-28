import { Upload, File, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { PatientDocument } from "@/lib/types"

interface PatientDocumentsTabProps {
  documents: PatientDocument[]
}

function DocumentPreview({ doc }: { doc: PatientDocument }) {
  if (doc.type === "pdf") {
    return (
      <div className="h-[180px] bg-background-hover flex items-center justify-center">
        <FileText className="size-12 text-border-light stroke-[1.5]" />
      </div>
    )
  }

  if (doc.previewUrl) {
    return (
      <div className="h-[180px] bg-background-card p-4 flex items-center justify-center">
        <div className="w-full h-full rounded-lg bg-border-light overflow-hidden relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={doc.previewUrl}
            alt={doc.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="h-[180px] bg-background-card p-4 flex items-center justify-center">
      <div className="w-full h-full rounded-lg bg-background-card overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/40 to-brand-dark/60 opacity-90" />
        <div className="absolute inset-0 flex items-center justify-center text-white/40">
          <File className="size-16" />
        </div>
      </div>
    </div>
  )
}

export function PatientDocumentsTab({ documents }: PatientDocumentsTabProps) {
  return (
    <div className="pt-2">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-lg font-bold text-text-primary">
          Arquivos e Exames
        </h3>
        <Button className="bg-brand-primary hover:bg-brand-dark text-white shadow-none font-bold rounded-lg h-[38px] px-5">
          <Upload className="size-4 mr-2" />
          Enviar Novo
        </Button>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="w-[200px] shrink-0 bg-white rounded-xl border border-border-light overflow-hidden flex flex-col shadow-[0_2px_4px_rgba(0,0,0,0.02)]"
          >
            <DocumentPreview doc={doc} />
            <div className="px-4 py-3 bg-white flex flex-col gap-0.5 border-t border-border-light">
              <span className="text-[13px] font-bold text-text-secondary truncate">
                {doc.name}
              </span>
              <span className="text-[11px] font-bold text-text-muted">
                {doc.date} &bull; {doc.size}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
