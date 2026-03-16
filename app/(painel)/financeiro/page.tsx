"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, CreditCard, DollarSign, Banknote } from "lucide-react";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart,
    Pie,
    Cell,
} from "recharts";

function SummaryCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
    return (
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide">{title}</p>
                    <p className="text-2xl font-semibold mt-2">{value}</p>
                </div>
                <div className="text-slate-400">{icon}</div>
            </div>
        </div>
    );
}

export default function FinanceiroPage() {
    // mock data
    const monthLabels = ["Set", "Out", "Nov", "Dez", "Jan", "Fev"];
    const values = [38000, 42000, 40000, 48000, 43000, 46000];

    const data = monthLabels.map((name, i) => ({ name, value: values[i] }));

    const methods = [
        { name: "Cartão de Crédito", value: 45, color: "#059669" },
        { name: "PIX", value: 35, color: "#d6a95a" },
        { name: "Boleto", value: 12, color: "#fb7185" },
        { name: "Dinheiro", value: 8, color: "#0f172a" },
    ];

    const currencyFormatter = (value: number) => `R$ ${Math.round(value / 1000)}k`;

    return (
        <div className="space-y-6">
            <header className="flex items-start justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Financeiro</h2>
                    <p className="text-sm text-slate-500 mt-1">Visão geral do faturamento e controle de caixa.</p>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="px-3 py-2">Relatórios</Button>
                    <Button className="px-4 py-2 bg-teal-600 hover:bg-teal-700">Nova Transação</Button>
                </div>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <SummaryCard title="Faturamento Mensal" value="R$ 45.200" icon={<DollarSign className="w-6 h-6 text-teal-600" />} />
                <SummaryCard title="A Receber" value="R$ 12.800" icon={<Calendar className="w-6 h-6 text-amber-400" />} />
                <SummaryCard title="Inadimplência" value="R$ 3.400" icon={<Banknote className="w-6 h-6 text-rose-400" />} />
                <SummaryCard title="Ticket Médio" value="R$ 380" icon={<CreditCard className="w-6 h-6 text-slate-500" />} />
            </section>
            
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-medium">Faturamento</h3>
                            <p className="text-sm text-slate-500">Evolução mensal nos últimos 6 meses.</p>
                        </div>
                        <div className="text-sm text-slate-500 border px-3 py-2 rounded-md">Últimos 6 meses</div>
                    </div>
                    <div className="w-full h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data} margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#ecfdf5" stopOpacity={0.95} />
                                        <stop offset="100%" stopColor="#ecfdf5" stopOpacity={0.12} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid stroke="#eef2f7" strokeDasharray="6 8" vertical={false} />
                                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} />
                                <YAxis tickFormatter={currencyFormatter} tickLine={false} axisLine={false} tick={{ fill: '#94a3b8' }} />
                                <Tooltip formatter={(val: number | undefined) => val ? `R$ ${val.toLocaleString()}` : 'R$ 0'} />
                                <Area type="monotone" dataKey="value" stroke="#059669" strokeWidth={3} fill="url(#colorValue)" activeDot={{ r: 5 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                    <h3 className="text-lg font-medium">Métodos de Pagamento</h3>
                    <p className="text-sm text-slate-500 mb-4">Distribuição por volume de transação.</p>

                    <div className="flex items-center gap-4">
                        <div className="w-44 h-44">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={methods}
                                        innerRadius={48}
                                        outerRadius={68}
                                        dataKey="value"
                                        startAngle={90}
                                        endAngle={-270}
                                        paddingAngle={4}
                                    >
                                        {methods.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="flex-1">
                            <ul className="space-y-3">
                                {methods.map((m) => (
                                    <li key={m.name} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="w-3 h-3 rounded-full inline-block" style={{ background: m.color }} />
                                            <span className="text-sm">{m.name}</span>
                                        </div>
                                        <span className="text-sm font-medium">{m.value}%</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contas a Receber card */}
            <section className="mt-2">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-medium">Contas a Receber</h3>
                            <p className="text-sm text-slate-500">Listagem de faturas pendentes e pagas recentemente.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="outline" className="px-3 py-2">Ver Tudo</Button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-400 uppercase border-b border-slate-100">
                                <tr>
                                    <th className="py-3 pr-6">Paciente</th>
                                    <th className="py-3 pr-6">Descrição</th>
                                    <th className="py-3 pr-6">Valor</th>
                                    <th className="py-3 pr-6">Vencimento</th>
                                    <th className="py-3 pr-6">Status</th>
                                    <th className="py-3">Ação</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {[
                                    { paciente: 'Mariana Costa', desc: 'Mensalidade Ortodontia (Fev)', valor: 'R$ 180,00', venc: '25/02/2026', status: 'Pendente' },
                                    { paciente: 'Ricardo Mendes', desc: 'Restauração Resina', valor: 'R$ 350,00', venc: '12/02/2026', status: 'Pago' },
                                    { paciente: 'Julia Albuquerque', desc: 'Limpeza e Profilaxia', valor: 'R$ 250,00', venc: '05/02/2026', status: 'Pago' },
                                    { paciente: 'Carlos Eduardo', desc: 'Cirurgia Siso', valor: 'R$ 800,00', venc: '10/02/2026', status: 'Atrasado' },
                                    { paciente: 'Beatriz Santos', desc: 'Implante Dentário (Parcela 1/12)', valor: 'R$ 1.200,00', venc: '20/02/2026', status: 'Pendente' },
                                ].map((row) => (
                                    <tr key={row.paciente} className="hover:bg-slate-50">
                                        <td className="py-4 align-top font-medium text-slate-800">{row.paciente}</td>
                                        <td className="py-4 align-top text-slate-600">{row.desc}</td>
                                        <td className="py-4 align-top font-semibold text-slate-800">{row.valor}</td>
                                        <td className="py-4 align-top text-slate-600">{row.venc}</td>
                                        <td className="py-4 align-top">
                                            <span className={
                                                `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ` +
                                                (row.status === 'Pago' ? 'bg-emerald-100 text-emerald-700' : row.status === 'Pendente' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700')
                                            }>{row.status}</span>
                                        </td>
                                        <td className="py-4 align-top">
                                            <Button variant="ghost" className="px-3 py-1">Ver</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    );
}
