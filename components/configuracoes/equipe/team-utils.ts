"use client";

import type { TeamStatus } from "./team-types";

export function getTeamStatusClasses(status: TeamStatus) {
  if (status === "Ativo") {
    return "bg-success-bg text-success-text border-success-border";
  }

  return "bg-background-hover text-text-tertiary border-border-light";
}

export function getTeamMemberInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
  }

  return (parts[0] ?? "").slice(0, 2).toUpperCase();
}
