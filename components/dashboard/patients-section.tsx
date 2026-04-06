"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Search,
    Plus,
    Eye,
    Loader2
} from "lucide-react";

function formatCpf(cpf: string) {
    const digits = cpf.replace(/\D/g, "");
    if (digits.length !== 11) return cpf;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

function formatDate(date: string | undefined) {
    if (!date) return "-";
    try {
        return new Date(date + "T00:00:00").toLocaleDateString("pt-BR");
    } catch {
        return date;
    }
}
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { patientSchema, type PatientFormData } from "@/lib/schemas/patient-schema";
import type { Patient, PageResponse } from "@/lib/types";
import { api } from "@/lib/api";

export function PatientsSection() {
    const router = useRouter();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [search, setSearch] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [insuranceFilter, setInsuranceFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [sortBy, setSortBy] = useState("name,asc");
    const [insurances, setInsurances] = useState<string[]>([]);

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<PatientFormData>({
        resolver: zodResolver(patientSchema),
    });

    useEffect(() => {
        api<string[]>("/patients/insurances").then(setInsurances).catch(() => {});
    }, []);

    const fetchPatients = useCallback(async () => {
        setIsLoading(true);
        try {
            const searchParam = search ? `&search=${encodeURIComponent(search)}` : "";
            const insuranceParam = insuranceFilter ? `&insurance=${encodeURIComponent(insuranceFilter)}` : "";
            const statusParam = statusFilter ? `&status=${encodeURIComponent(statusFilter)}` : "";
            const data = await api<PageResponse<Patient>>(`/patients?page=${page}&size=20&sort=${sortBy}${searchParam}${insuranceParam}${statusParam}`);
            setPatients(data.content);
            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements);
        } catch {
            toast.error("Erro ao carregar pacientes");
        } finally {
            setIsLoading(false);
        }
    }, [page, search, insuranceFilter, statusFilter, sortBy]);

    useEffect(() => {
        fetchPatients();
    }, [fetchPatients]);

    useEffect(() => {
        setPage(0);
    }, [search]);

    const onSubmit = async (data: PatientFormData) => {
        try {
            await api<Patient>("/patients", {
                method: "POST",
                body: JSON.stringify({
                    name: data.name,
                    cpf: data.cpf,
                    phone: data.phone,
                    insurance: data.insurance || null,
                }),
            });
            toast.success("Paciente adicionado com sucesso!");
            setIsDialogOpen(false);
            reset();
            fetchPatients();
        } catch (error: unknown) {
            const apiError = error as { message?: string };
            toast.error(apiError.message || "Erro ao criar paciente");
        }
    };

    const startIndex = page * 20 + 1;
    const endIndex = Math.min((page + 1) * 20, totalElements);

    return (
        <div className="max-w-7xl mx-auto space-y-4 md:space-y-6 pb-4 md:pb-8 pt-2 px-4 sm:px-6 lg:px-8">

            {/* HEADER ROW */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-[24px] font-bold text-text-primary leading-[32px]">Pacientes</h1>
                    <p className="text-[14px] text-text-tertiary mt-0.5 font-medium">Gerencie o histórico e informações dos seus pacientes.</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-brand-dark hover:bg-brand-dark text-white shadow-sm font-semibold rounded-[8px] h-11 px-5 w-full sm:w-auto transition-colors">
                            <Plus className="w-4 h-4 mr-2" /> Novo Paciente
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] rounded-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold text-text-primary">Novo Paciente</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-semibold text-text-secondary">Nome</label>
                                <Input
                                    id="name"
                                    {...register("name")}
                                    placeholder="Ana Carolina Silva"
                                    className="h-[48px] rounded-xl border-border-light bg-background-card/50 focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-0 focus-visible:border-transparent"
                                    aria-invalid={!!errors.name}
                                    aria-describedby={errors.name ? "name-error" : undefined}
                                />
                                {errors.name && <span id="name-error" className="text-xs text-danger-text" role="alert">{errors.name.message}</span>}
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="cpf" className="text-sm font-semibold text-text-secondary">CPF</label>
                                <Input
                                    id="cpf"
                                    {...register("cpf")}
                                    placeholder="123.456.789-00"
                                    className="h-[48px] rounded-xl border-border-light bg-background-card/50 focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-0 focus-visible:border-transparent"
                                    aria-invalid={!!errors.cpf}
                                    aria-describedby={errors.cpf ? "cpf-error" : undefined}
                                />
                                {errors.cpf && <span id="cpf-error" className="text-xs text-danger-text" role="alert">{errors.cpf.message}</span>}
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="phone" className="text-sm font-semibold text-text-secondary">Telefone</label>
                                <Input
                                    id="phone"
                                    {...register("phone")}
                                    placeholder="(11) 98877-6655"
                                    className="h-[48px] rounded-xl border-border-light bg-background-card/50 focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-0 focus-visible:border-transparent"
                                    aria-invalid={!!errors.phone}
                                    aria-describedby={errors.phone ? "phone-error" : undefined}
                                />
                                {errors.phone && <span id="phone-error" className="text-xs text-danger-text" role="alert">{errors.phone.message}</span>}
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="insurance" className="text-sm font-semibold text-text-secondary">Seguro</label>
                                <Input
                                    id="insurance"
                                    {...register("insurance")}
                                    placeholder="Ex: Unimed, Bradesco..."
                                    className="h-[48px] rounded-xl border-border-light bg-background-card/50 focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-0 focus-visible:border-transparent"
                                />
                            </div>
                            <Button type="submit" disabled={isSubmitting} className="w-full bg-brand-primary hover:bg-brand-dark text-white font-bold rounded-xl h-[48px] shadow-[0px_10px_15px_0px_rgba(0,187,167,0.2)] mt-4">
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Salvar Paciente"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* MAIN CARD CONTAINER */}
            <div className="bg-white rounded-[14px] border border-border-light shadow-sm flex flex-col pt-2">
                {/* FILTERS HEADER */}
                <div className="flex flex-col lg:flex-row justify-between items-center gap-4 px-4 py-4 shrink-0">
                    <div className="relative w-full lg:flex-1 max-w-md">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Pesquisar por nome, CPF ou telefone..."
                            className="pl-9 w-full h-10 border border-border-light bg-background-card/50 text-[14px] placeholder:text-text-muted rounded-xl focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-0 focus-visible:border-transparent"
                            aria-label="Buscar pacientes"
                        />
                    </div>
                    <div className="flex gap-2 w-full lg:w-auto shrink-0 items-center">
                        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v === "all" ? "" : v); setPage(0); }}>
                            <SelectTrigger className="h-10 w-[130px] rounded-[8px] text-[13px] font-medium border-border-light bg-white shadow-sm cursor-pointer">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="Ativo">Ativo</SelectItem>
                                <SelectItem value="Pendente">Pendente</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={insuranceFilter} onValueChange={(v) => { setInsuranceFilter(v === "all" ? "" : v); setPage(0); }}>
                            <SelectTrigger className="h-10 w-[160px] rounded-[8px] text-[13px] font-medium border-border-light bg-white shadow-sm cursor-pointer">
                                <SelectValue placeholder="Seguro" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                {insurances.map((ins) => (
                                    <SelectItem key={ins} value={ins}>{ins}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="h-10 w-[160px] rounded-[8px] text-[13px] font-medium border-border-light bg-white shadow-sm cursor-pointer text-text-secondary">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="name,asc">Nome (A-Z)</SelectItem>
                                <SelectItem value="name,desc">Nome (Z-A)</SelectItem>
                                <SelectItem value="createdAt,desc">Mais recentes</SelectItem>
                                <SelectItem value="createdAt,asc">Mais antigos</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* TABLE */}
                <div className="w-full overflow-x-auto flex-1 border-t border-border-light">
                    <Table className="min-w-[900px]">
                        <TableHeader className="bg-white">
                            <TableRow className="border-b border-border-light hover:bg-transparent px-4">
                                <TableHead className="font-semibold text-text-tertiary text-[11px] tracking-wider uppercase h-[52px] align-middle px-6">PACIENTE</TableHead>
                                <TableHead className="font-semibold text-text-tertiary text-[11px] tracking-wider uppercase h-[52px] align-middle px-6">CPF</TableHead>
                                <TableHead className="font-semibold text-text-tertiary text-[11px] tracking-wider uppercase h-[52px] align-middle px-6">TELEFONE</TableHead>
                                <TableHead className="font-semibold text-text-tertiary text-[11px] tracking-wider uppercase h-[52px] whitespace-nowrap align-middle px-6">ÚLTIMA VISITA</TableHead>
                                <TableHead className="font-semibold text-text-tertiary text-[11px] tracking-wider uppercase h-[52px] align-middle px-6">SEGURO</TableHead>
                                <TableHead className="font-semibold text-text-tertiary text-[11px] tracking-wider uppercase h-[52px] align-middle px-6 text-right">AÇÕES</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-text-tertiary">
                                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-primary" />
                                    </TableCell>
                                </TableRow>
                            ) : patients.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-text-tertiary">
                                        Nenhum paciente encontrado.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                patients.map((patient) => (
                                    <TableRow key={patient.id} className="hover:bg-background-card/50 border-b border-border-light transition-colors group">
                                        <TableCell className="py-5 align-middle px-6">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="w-10 h-10 border border-border-light shrink-0">
                                                    <AvatarImage src={patient.avatar} alt={patient.name} />
                                                    <AvatarFallback className="bg-brand-primary text-white text-[13px] font-semibold">
                                                        {patient.name.substring(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <p className="font-semibold text-text-secondary text-[14px] whitespace-nowrap">
                                                        {patient.name}
                                                    </p>
                                                    <span
                                                        className={`mt-1 text-[11px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap tracking-[0.2px] w-fit
                                                            ${patient.status === 'Ativo' ? 'bg-success-bg text-success-text' :
                                                                patient.status === 'Pendente' ? 'bg-warning-bg text-warning-text' :
                                                                    'bg-danger-bg text-danger-text'}`}
                                                    >
                                                        {patient.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="align-middle text-text-tertiary text-[13px] font-medium whitespace-nowrap py-5 px-6">
                                            {formatCpf(patient.cpf)}
                                        </TableCell>
                                        <TableCell className="align-middle text-text-tertiary text-[13px] font-medium whitespace-nowrap py-5 px-6">
                                            {patient.phone}
                                        </TableCell>
                                        <TableCell className="align-middle text-text-tertiary text-[13px] font-medium whitespace-nowrap py-5 px-6">
                                            {formatDate(patient.lastVisit)}
                                        </TableCell>
                                        <TableCell className="align-middle text-text-secondary text-[13px] font-medium whitespace-nowrap py-5 px-6">
                                            {patient.insurance || "Particular"}
                                        </TableCell>
                                        <TableCell className="align-middle px-6 py-5">
                                            <div className="flex justify-end">
                                                <Button
                                                    variant="ghost" size="icon"
                                                    onClick={() => router.push(`/pacientes/${patient.id}`)}
                                                    className="text-text-muted hover:text-brand-primary transition-colors cursor-pointer"
                                                    title="Ver Perfil"
                                                >
                                                    <Eye className="w-[18px] h-[18px]" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* PAGINATION */}
                <div className="px-4 sm:px-6 py-[16px] border-t border-border-light flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-b-[14px] shrink-0">
                    <p className="text-[14px] text-text-tertiary font-medium">
                        {totalElements > 0
                            ? `Mostrando ${startIndex}-${endIndex} de ${totalElements} pacientes`
                            : "Nenhum paciente"}
                    </p>
                    {totalPages > 1 && (
                        <div className="flex flex-wrap justify-center items-center gap-[6px]">
                            <Button
                                variant="outline" size="sm"
                                disabled={page === 0}
                                onClick={() => setPage(page - 1)}
                                className="h-[36px] px-4 text-text-tertiary bg-white border-border-light rounded-[6px] font-medium hover:text-text-secondary shadow-sm border"
                            >
                                Anterior
                            </Button>
                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
                                <Button
                                    key={i}
                                    variant={page === i ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setPage(i)}
                                    className={page === i
                                        ? "h-[36px] w-[36px] bg-brand-primary hover:bg-brand-dark text-white p-0 flex items-center justify-center font-medium rounded-[6px] border-none shadow-md"
                                        : "h-[36px] w-[36px] text-text-secondary bg-white border-border-light p-0 flex items-center justify-center font-medium hover:bg-background-card rounded-[6px] shadow-sm border"
                                    }
                                >
                                    {i + 1}
                                </Button>
                            ))}
                            <Button
                                variant="outline" size="sm"
                                disabled={page >= totalPages - 1}
                                onClick={() => setPage(page + 1)}
                                className="h-[36px] px-4 text-text-secondary bg-white border-border-light font-medium hover:bg-background-card rounded-[6px] shadow-sm border"
                            >
                                Próximo
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
