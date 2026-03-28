import { UserPlus, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const teamMembers = [
    {
        name: "Dra. Ana Silva",
        status: "ativo no sistema",
        role: "Administrador",
        avatar: "https://i.pravatar.cc/150?u=ana-silva",
    },
    {
        name: "Dr. Lucas Ferraz",
        status: "ativo no sistema",
        role: "Dentista",
        avatar: "https://i.pravatar.cc/150?u=lucas",
    },
    {
        name: "Mariana Santos",
        status: "ativo no sistema",
        role: "Recepcionista",
        avatar: "https://i.pravatar.cc/150?u=mariana",
    },
];

export function EquipeSettings() {
    return (
        <div className="bg-white rounded-[14px] border border-border-light shadow-sm overflow-hidden w-full p-4 sm:p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6 md:mb-8">
                <div>
                    <h2 className="text-[20px] font-bold text-text-primary leading-[28px]">
                        Gestão de Equipe
                    </h2>
                    <p className="text-[14px] text-text-tertiary font-medium mt-1">
                        Controle os usuários e níveis de acesso ao sistema.
                    </p>
                </div>
                <Button className="h-10 px-4 bg-brand-primary hover:bg-brand-dark text-white rounded-lg shadow-sm">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Novo Usuário
                </Button>
            </div>

            <div className="border border-border-light rounded-xl overflow-x-auto">
                <Table className="w-full text-left min-w-[500px]">
                    <TableHeader>
                        <TableRow className="bg-background-card border-b border-border-light hover:bg-background-card">
                            <TableHead className="py-4 px-6 text-[13px] font-semibold text-text-tertiary h-auto">
                                Colaborador
                            </TableHead>
                            <TableHead className="py-4 px-6 text-[13px] font-semibold text-text-tertiary h-auto">
                                Cargo / Permissão
                            </TableHead>
                            <TableHead className="py-4 px-6 text-[13px] font-semibold text-text-tertiary w-[100px] text-right h-auto">
                                Ações
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {teamMembers.map((member, index) => (
                            <TableRow
                                key={index}
                                className="border-b border-border-light last:border-0 hover:bg-background-card/50 transition-colors"
                            >
                                <TableCell className="py-4 px-6">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="w-10 h-10 border border-border-light">
                                            <AvatarImage src={member.avatar} alt={member.name} />
                                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="text-[14px] font-semibold text-text-primary">
                                                {member.name}
                                            </span>
                                            <span className="text-[13px] text-text-tertiary">
                                                {member.status}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4 px-6 text-[14px] font-medium text-text-secondary">
                                    {member.role}
                                </TableCell>
                                <TableCell className="py-4 px-6 text-right">
                                    <Button variant="ghost" size="icon" className="text-text-muted hover:text-text-secondary">
                                        <MoreHorizontal className="w-5 h-5" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
