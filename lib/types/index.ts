export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
}

export interface Patient {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  email?: string;
  insurance?: string;
  status?: string;
  lastVisit?: string;
  avatar?: string;
  birthDate?: string;
  gender?: string;
  address?: string;
  createdAt: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export type AppointmentType = "evaluation" | "cleaning" | "procedure" | "return" | "urgency";

export interface Appointment {
  id: string;
  patientName: string;
  dentistId: string;
  date: string;
  time: string;
  duration: number;
  type: AppointmentType;
  procedure: string;
  observations?: string;
  patientSince?: string;
}

export interface Dentist {
  id: string;
  name: string;
  specialty: string;
}

export type AgendaView = "day" | "week" | "month";

export type FinanceReceivableStatus = "Pendente" | "Pago" | "Atrasado";

export interface FinanceReceivable {
  id: string;
  patient: string;
  description: string;
  value: number;
  due: string;
  status: FinanceReceivableStatus;
}

export interface FinancePaymentMethod {
  label: string;
  value: number;
  color: string;
}

export interface TreatmentProcedure {
  id: string;
  tooth: string;
  name: string;
  value: number;
  paid: boolean;
  done: boolean;
}

export interface TreatmentPlan {
  id: string;
  patient: string;
  title: string;
  createdAt: string;
  startDate?: string;
  endDate?: string;
  notes?: string;
  total: number;
  completed: number;
  totalProcedures: number;
  procedures: TreatmentProcedure[];
}

// Dashboard

export type ScheduleStatus = "confirmed" | "pending" | "cancelled";

export interface DashboardStat {
  title: string;
  value: string;
  subtitle?: string;
  iconName: string;
  trend?: {
    value: string;
    label: string;
  };
}

export interface ScheduleEntry {
  id: string;
  time: string;
  patientName: string;
  patientAvatar: string;
  procedure: string;
  dentist: string;
  status: ScheduleStatus;
}

export interface GoalProgress {
  label: string;
  current: string;
  target: string;
  percentage: number;
  variant: "brand" | "warning";
}

export interface DashboardAlert {
  id: string;
  message: string;
  variant: "warning" | "danger" | "success";
  iconName: string;
}

export interface WeeklyChartBar {
  label: string;
  percentage: number;
  variant: "primary" | "dark" | "accent";
}

export type PatientTimelineStatus = "upcoming" | "completed"
export type PatientPaymentStatus = "paid" | "pending"

export interface PatientTimelineEntry {
  id: string
  label: string
  status: PatientTimelineStatus
  procedure: string
  date: string
  paymentStatus?: "paid" | "pending"
}

export interface PatientFinancialRecord {
  id: string
  description: string
  date: string
  value: string
  status: PatientPaymentStatus
  hasReceipt: boolean
}

export interface PatientDocument {
  id: string
  name: string
  date: string
  size: string
  type: "image" | "pdf" | "photo"
  previewUrl?: string
}
