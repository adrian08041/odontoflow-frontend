import {
  CalendarCheck,
  CheckCircle,
  DollarSign,
  Users,
  type LucideIcon,
} from "lucide-react"
import { StatCard } from "@/components/dashboard/stat-card"
import { TodayScheduleTable } from "@/components/dashboard/today-schedule-table"
import { GoalsSection } from "@/components/dashboard/goals-section"
import { NewRecordCta } from "@/components/dashboard/new-record-cta"
import { AlertsPanel } from "@/components/dashboard/alerts-panel"
import { WeeklyChart } from "@/components/dashboard/weekly-chart"
import {
  DASHBOARD_STATS,
  DASHBOARD_SCHEDULE,
  DASHBOARD_GOALS,
  DASHBOARD_ALERTS,
  DASHBOARD_WEEKLY_CHART,
} from "@/lib/mock-data"

const STAT_ICONS: Record<string, LucideIcon> = {
  CalendarCheck,
  CheckCircle,
  DollarSign,
  Users,
}

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6 md:gap-8 w-full max-w-[1267px] mx-auto min-w-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {DASHBOARD_STATS.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            icon={STAT_ICONS[stat.iconName]}
            trend={stat.trend}
          />
        ))}
      </div>

      <div className="flex flex-col xl:flex-row gap-6 md:gap-8 w-full min-w-0">
        <div className="flex flex-col gap-6 md:gap-8 flex-1 min-w-0">
          <TodayScheduleTable entries={DASHBOARD_SCHEDULE} />

          <div className="flex flex-col md:flex-row items-stretch gap-6 md:gap-8 md:h-[204px]">
            <GoalsSection title="Metas de Fevereiro" goals={DASHBOARD_GOALS} />
            <NewRecordCta />
          </div>
        </div>

        <div className="flex flex-col gap-6 md:gap-8 w-full xl:min-w-[380px] xl:w-[380px] shrink-0 min-w-0">
          <AlertsPanel alerts={DASHBOARD_ALERTS} />
          <WeeklyChart
            title="Consultas na Semana"
            subtitle="Média de 12.5 por dia"
            bars={DASHBOARD_WEEKLY_CHART}
          />
        </div>
      </div>
    </div>
  )
}
