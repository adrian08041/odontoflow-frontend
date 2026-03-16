import type { Metadata } from "next";
import { TreatmentsContent } from "@/components/tratamentos/treatments-content";

export const metadata: Metadata = {
  title: "Tratamentos | OdontoFlow",
  description: "Acompanhe os planos de tratamento da clinica",
};

export default function TratamentosPage() {
  return <TreatmentsContent />;
}
