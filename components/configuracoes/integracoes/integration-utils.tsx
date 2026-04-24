"use client";

import { Bot, CreditCard, MessageCircle, PlugZap } from "lucide-react";
import type { Integration, IntegrationCategory } from "./integration-types";

export function renderIntegrationIcon(iconName: Integration["iconName"], className: string) {
  if (iconName === "message") return <MessageCircle className={className} />;
  if (iconName === "automation") return <Bot className={className} />;
  if (iconName === "payment") return <CreditCard className={className} />;
  return <PlugZap className={className} />;
}

export function getCategoryBadge(category: IntegrationCategory) {
  if (category === "Comunicação") return "bg-success-bg text-success-text border-success-border";
  if (category === "Automação") return "bg-danger-bg text-danger-text border-danger-border";
  if (category === "Financeiro") return "bg-warning-bg text-warning-text border-warning-border";
  return "bg-background-hover text-text-tertiary border-border-light";
}

export function getIntegrationVisual(category: IntegrationCategory) {
  if (category === "Comunicação") {
    return {
      iconName: "message" as const,
      color: "text-success-text",
    };
  }

  if (category === "Automação") {
    return {
      iconName: "automation" as const,
      color: "text-danger-text",
    };
  }

  if (category === "Financeiro") {
    return {
      iconName: "payment" as const,
      color: "text-warning-text",
    };
  }

  return {
    iconName: "assistant" as const,
    color: "text-brand-primary",
  };
}
