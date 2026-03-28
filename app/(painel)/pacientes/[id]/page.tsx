"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, User, Calendar, Stethoscope, Banknote, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MOCK_PATIENTS, PATIENT_TIMELINE, PATIENT_FINANCIAL_RECORDS, PATIENT_DOCUMENTS } from "@/lib/mock-data";
import { PatientProfileHeader } from "@/components/pacientes/patient-profile-header";
import { PatientTabs } from "@/components/pacientes/patient-tabs";
import { PatientPersonalDataTab } from "@/components/pacientes/patient-personal-data-tab";
import { PatientTimelineTab } from "@/components/pacientes/patient-timeline-tab";
import { PatientFinancialTab } from "@/components/pacientes/patient-financial-tab";
import { PatientDocumentsTab } from "@/components/pacientes/patient-documents-tab";

const TABS = [
  { id: "Dados Pessoais", label: "Dados Pessoais", icon: User },
  { id: "Consultas", label: "Consultas", icon: Calendar },
  { id: "Tratamentos", label: "Tratamentos", icon: Stethoscope },
  { id: "Financeiro", label: "Financeiro", icon: Banknote },
  { id: "Documentos", label: "Documentos", icon: FileText },
];

export default function PatientProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id);
  const [activeTab, setActiveTab] = useState("Consultas");
  const patient = MOCK_PATIENTS.find((p) => p.id === id) || MOCK_PATIENTS[0];

  return (
    <div className="max-w-5xl mx-auto space-y-6 md:pb-8 pt-2">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push("/pacientes")} className="text-text-tertiary hover:text-text-secondary">
          <ArrowLeft className="size-5" />
        </Button>
        <h1 className="text-2xl font-bold text-text-primary leading-8">Perfil do Paciente</h1>
      </div>

      <PatientProfileHeader patient={patient} />
      <PatientTabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "Dados Pessoais" && <PatientPersonalDataTab patient={patient} />}
      {activeTab === "Consultas" && <PatientTimelineTab entries={PATIENT_TIMELINE} />}
      {activeTab === "Financeiro" && <PatientFinancialTab records={PATIENT_FINANCIAL_RECORDS} />}
      {activeTab === "Documentos" && <PatientDocumentsTab documents={PATIENT_DOCUMENTS} />}
    </div>
  );
}
