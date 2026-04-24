"use client";

import type { AgreementStatus } from "./agreement-types";

export function getAgreementStatusClasses(status: AgreementStatus) {
  if (status === "Ativo") {
    return "bg-success-bg text-success-text border-success-border";
  }

  if (status === "Em análise") {
    return "bg-warning-bg text-warning-text border-warning-border";
  }

  return "bg-background-hover text-text-tertiary border-border-light";
}
