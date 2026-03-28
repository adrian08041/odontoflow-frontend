"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function MenuPage() {
    const router = useRouter();
    const [user, setUser] = useState({
        name: "Dra. Ana Silva",
        role: "Ortodontista",
        initials: "AS"
    });

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                // eslint-disable-next-line
                setUser({
                    name: parsedUser.name || "Dra. Ana Silva",
                    role: parsedUser.role || "Ortodontista",
                    initials: parsedUser.initials || "AS"
                });
            }
        } catch {
            // Silently ignore parse errors from localStorage
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        router.push("/");
    };

    const menuItems = [
        { name: "Tratamentos", href: "/tratamentos" },
        { name: "Configurações da Clínica", href: "/configuracoes" },
    ];

    return (
        <div className="w-full max-w-md mx-auto px-1 pt-6 pb-24">
            {/* Header/Perfil */}
            <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-brand-primary text-white text-xl font-bold flex items-center justify-center shrink-0 shadow-sm">
                    {user.initials}
                </div>
                <div>
                    <h1 className="text-[20px] font-bold text-text-primary leading-tight">{user.name}</h1>
                    <p className="text-[14px] text-text-tertiary">{user.role}</p>
                </div>
            </div>

            {/* Menu List */}
            <div className="flex flex-col gap-3">
                {menuItems.map((item, index) => (
                    <Link
                        key={index}
                        href={item.href}
                        className="flex items-center justify-between bg-white px-5 py-4 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-border-light hover:bg-background-card transition-colors"
                    >
                        <span className="text-text-secondary font-medium text-[15px]">{item.name}</span>
                        <ChevronRight className="size-5 text-text-muted stroke-2" />
                    </Link>
                ))}
            </div>

            {/* Logout */}
            <div className="mt-6">
                <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center bg-danger-bg text-danger-text font-bold py-4 rounded-2xl hover:bg-danger-bg transition-colors"
                >
                    Sair da Conta
                </Button>
            </div>
        </div>
    );
}
