"use client";

import { useState, useEffect } from "react";
import { Search, Bell, ChevronRight, User, Settings, LogOut, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
    breadcrumbs?: string[];
}

export function Header({ breadcrumbs }: HeaderProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [userFirstName, setUserFirstName] = useState("");
    const [userFullName, setUserFullName] = useState("");
    const [userRole, setUserRole] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userInitials, setUserInitials] = useState("");

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                const name = parsedUser.name || "";
                setUserFullName(name);
                setUserFirstName(name.split(" ").slice(0, 2).join(" "));
                setUserRole(parsedUser.role || "");
                setUserEmail(parsedUser.email || "");
                setUserInitials(parsedUser.initials || name.substring(0, 2).toUpperCase());
            }
        } catch (e) {
            console.error("Failed to parse user from local storage", e);
        }
    }, []);

    const today = new Date().toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const currentHour = new Date().getHours();
    let greeting = "Bom dia";
    if (currentHour >= 12 && currentHour < 18) {
        greeting = "Boa tarde";
    } else if (currentHour >= 18 || currentHour < 5) {
        greeting = "Boa noite";
    }

    return (
        <header className="h-16 bg-white border-b border-border-light flex items-center justify-between px-4 md:px-8 shrink-0">
            <div className="flex items-center gap-4">
                {breadcrumbs && breadcrumbs.length > 0 ? (
                    <div className="flex items-center text-[13px] font-medium text-text-tertiary">
                        {breadcrumbs.map((crumb, index) => (
                            <div key={index} className="flex items-center">
                                <span className={index === breadcrumbs.length - 1 ? "text-text-primary font-semibold" : ""}>
                                    {crumb}
                                </span>
                                {index < breadcrumbs.length - 1 && (
                                    <ChevronRight className="w-4 h-4 mx-2 text-text-muted" />
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div>
                        <h2 className="text-base md:text-lg font-semibold text-text-primary">{greeting}, {userFirstName}</h2>
                        <p className="hidden md:block text-xs text-text-tertiary uppercase tracking-widest mt-1">
                            {today}
                        </p>
                    </div>
                )}
            </div>

            <div className="flex items-center space-x-4 md:space-x-6">
                <div className="relative hidden sm:block">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
                    <Input
                        placeholder="Buscar pacientes, agendamentos..."
                        className="pl-9 w-48 md:w-64 lg:w-80 bg-background-card border-border-light rounded-full h-9 focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-0 focus-visible:border-transparent"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-4 pl-4 border-l border-border-light">
                    <Button variant="ghost" size="icon" className="relative p-2 text-text-muted hover:text-text-secondary transition-colors">
                        <Bell className="w-5 h-5 text-text-secondary" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-text rounded-full border-2 border-white"></span>
                        <span className="sr-only">Notificações</span>
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center gap-3 outline-none hover:bg-background-card p-2 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-border-light data-[state=open]:bg-background-card">
                            <Avatar className="h-10 w-10 border-2 border-border-light">
                                <AvatarImage src="" alt={userFullName} />
                                <AvatarFallback className="bg-brand-primary text-white font-medium">
                                    {userInitials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="hidden md:flex flex-col ml-1 overflow-hidden">
                                <p className="text-sm font-medium text-text-primary truncate">{userFullName}</p>
                                <p className="text-xs text-text-tertiary truncate">{userRole}</p>
                            </div>
                            <ChevronDown className="w-4 h-4 text-text-muted" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[300px] p-0 overflow-hidden rounded-2xl border-border-light shadow-xl mt-2">
                            <div className="bg-brand-primary p-4 flex items-center gap-3 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full opacity-10 -mr-10 -mt-10 blur-2xl"></div>
                                <Avatar className="h-14 w-14 border-2 border-white/20 shadow-sm relative z-10">
                                    <AvatarImage src="" alt={userFullName} />
                                    <AvatarFallback className="bg-white text-brand-dark font-bold text-lg">
                                        {userInitials}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col text-white relative z-10">
                                    <span className="font-bold text-base leading-tight">{userFullName}</span>
                                    <span className="text-sm text-white opacity-90">{userEmail}</span>
                                </div>
                            </div>

                            <div className="p-2 flex flex-col gap-1">
                                <DropdownMenuItem className="cursor-pointer gap-3 p-3 rounded-xl hover:bg-background-card focus:bg-background-card">
                                    <div className="h-10 w-10 bg-background-hover flex items-center justify-center rounded-xl text-text-secondary shrink-0">
                                        <User className="h-5 w-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-text-secondary text-sm">Meu Perfil</span>
                                        <span className="text-xs text-text-tertiary">Dados pessoais e configurações</span>
                                    </div>
                                </DropdownMenuItem>

                                <DropdownMenuItem className="cursor-pointer gap-3 p-3 rounded-xl hover:bg-background-card focus:bg-background-card">
                                    <div className="h-10 w-10 bg-background-hover flex items-center justify-center rounded-xl text-text-secondary shrink-0">
                                        <Settings className="h-5 w-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-text-secondary text-sm">Configurações</span>
                                        <span className="text-xs text-text-tertiary">Preferências do sistema</span>
                                    </div>
                                </DropdownMenuItem>

                                <DropdownMenuSeparator className="mx-2 my-1" />

                                <DropdownMenuItem className="cursor-pointer gap-3 p-3 rounded-xl hover:bg-danger-bg focus:bg-danger-bg group" onClick={() => {
                                    localStorage.removeItem("token");
                                    localStorage.removeItem("user");
                                    window.location.href = "/login";
                                }}>
                                    <div className="h-10 w-10 bg-danger-bg group-hover:bg-danger-bg flex items-center justify-center rounded-xl text-danger-text shrink-0 transition-colors">
                                        <LogOut className="h-5 w-5" />
                                    </div>
                                    <div className="flex flex-col border-none">
                                        <span className="font-bold text-danger-text text-sm">Sair da conta</span>
                                        <span className="text-xs text-danger-text">Encerrar sessão</span>
                                    </div>
                                </DropdownMenuItem>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
