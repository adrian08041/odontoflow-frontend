import type { LucideIcon } from "lucide-react"
import { AlertCircle, CreditCard, Gift, ChevronRight } from "lucide-react"
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
  { bg: string; text: string }
> = {
  warning: { bg: "bg-warning-bg", text: "text-warning-text" },
  danger: { bg: "bg-danger-bg", text: "text-danger-text" },
  success: { bg: "bg-success-bg", text: "text-success-text" },
}

function AlertItem({ alert }: { alert: DashboardAlert }) {
  const Icon = ICON_MAP[alert.iconName]
  const styles = VARIANT_STYLES[alert.variant]

  return (
    <div className="border border-border-light rounded-lg p-3 pr-4 flex gap-4 items-center">
      <div
        className={`${styles.bg} rounded-lg size-9 flex items-center justify-center shrink-0`}
      >
        {Icon && <Icon className={`size-5 ${styles.text}`} />}
      </div>
      <p className="font-medium text-text-secondary text-sm leading-5 flex-1">
        {alert.message}
      </p>
      <ChevronRight className="size-4 shrink-0 text-border-light cursor-pointer hover:text-text-secondary transition-colors" />
    </div>
  )
}

interface AlertsPanelProps {
  alerts: DashboardAlert[]
}

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  return (
    <Card className="gap-0 p-0 bg-white border-border-light shadow-sm overflow-hidden h-[409px] flex flex-col">
      <CardHeader className="border-b border-border-light h-[77px] px-6 flex-row items-center justify-between shrink-0 py-0">
        <CardTitle className="text-text-primary text-lg leading-7">
          Alertas Próximos
        </CardTitle>
        <div className="bg-white border border-border-light rounded-full px-2 py-0.5">
          <span className="font-bold text-text-secondary text-[10px] tracking-wider uppercase">
            Atenção
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-4 flex flex-col gap-3 flex-1">
        {alerts.map((alert) => (
          <AlertItem key={alert.id} alert={alert} />
        ))}
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          variant="outline"
          className="w-full h-9 rounded-lg font-semibold text-text-secondary text-sm border-border-light hover:bg-background-hover"
        >
          Ver todas as notificações
        </Button>
      </CardFooter>
    </Card>
  )
}
