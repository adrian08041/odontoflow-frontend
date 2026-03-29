import type { LucideIcon } from "lucide-react"
import { AlertCircle, CreditCard, Gift, ChevronRight, Bell } from "lucide-react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { DashboardAlert } from "@/lib/types"

const ICON_MAP: Record<string, LucideIcon> = {
  AlertCircle,
  CreditCard,
  Gift,
}

const VARIANT_STYLES: Record<
  DashboardAlert["variant"],
  { bg: string; text: string; border: string }
> = {
  warning: { bg: "bg-warning-bg", text: "text-warning-text", border: "border-warning-text/20" },
  danger: { bg: "bg-danger-bg", text: "text-danger-text", border: "border-danger-text/20" },
  success: { bg: "bg-success-bg", text: "text-success-text", border: "border-success-text/20" },
}

function AlertItem({ alert }: { alert: DashboardAlert }) {
  const Icon = ICON_MAP[alert.iconName]
  const styles = VARIANT_STYLES[alert.variant]

  return (
    <div className={`group flex cursor-pointer items-center gap-4 rounded-xl border ${styles.border} bg-white p-3.5 pr-4 transition-all duration-200 hover:shadow-sm`}>
      <div
        className={`${styles.bg} flex size-10 shrink-0 items-center justify-center rounded-xl`}
      >
        {Icon && <Icon className={`size-[18px] ${styles.text}`} />}
      </div>
      <p className="flex-1 text-sm font-medium leading-5 text-text-secondary">
        {alert.message}
      </p>
      <ChevronRight className="size-4 shrink-0 text-text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-text-secondary" />
    </div>
  )
}

interface AlertsPanelProps {
  alerts: DashboardAlert[]
}

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  return (
    <Card className="flex h-[409px] flex-col gap-0 overflow-hidden border-border-light bg-white p-0 shadow-sm">
      <CardHeader className="flex h-[77px] shrink-0 flex-row items-center justify-between border-b border-border-light px-6 py-0">
        <CardTitle className="flex items-center gap-2 text-lg leading-7 text-text-primary">
          <Bell className="size-5 text-brand-primary" />
          Alertas Próximos
        </CardTitle>
        <div className="flex items-center gap-1.5 rounded-full bg-warning-bg px-3 py-1">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-warning-text opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-warning-text" />
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-warning-text">
            Atenção
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-3 p-5">
        {alerts.map((alert) => (
          <AlertItem key={alert.id} alert={alert} />
        ))}
      </CardContent>

      <CardFooter className="border-t border-border-light p-4">
        <Button
          variant="outline"
          className="h-10 w-full rounded-xl border-border-light text-sm font-semibold text-text-secondary hover:bg-background-hover hover:text-brand-primary"
        >
          Ver todas as notificações
        </Button>
      </CardFooter>
    </Card>
  )
}
