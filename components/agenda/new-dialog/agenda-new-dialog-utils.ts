"use client";

export function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export function getPersonInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .substring(0, 2);
}

export function formatAgendaDate(
  year: number,
  month: number,
  dateNum?: number | null,
) {
  if (dateNum === undefined || dateNum === null) return "-";

  const date = new Date(year, month, dateNum);
  const dayNames = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ];
  const shortMonths = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];

  return `${dayNames[date.getDay()]}, ${dateNum} de ${shortMonths[month]}`;
}
