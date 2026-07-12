"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { UserType } from "@/dto/user-type.enum";
import LoadingState from "@/components/arquivos/LoadingState";

function pertenceARota(pathname: string, base: string): boolean {
    return pathname === base || pathname.startsWith(`${base}/`);
}

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, loading } = useAuth();

    const isRotaMedico = pertenceARota(pathname, "/dashboard/medico");
    const isRotaPaciente = pertenceARota(pathname, "/dashboard/paciente");
    const isRotaAdmin = pertenceARota(pathname, "/admin");
    const tipoNaoAutorizado =
        (isRotaMedico && user?.tipo !== UserType.MEDICO) ||
        (isRotaPaciente && user?.tipo !== UserType.PACIENTE) ||
        (isRotaAdmin && user?.tipo !== UserType.ADMIN);

    useEffect(() => {
        if (loading) return;

        if (!user) {
            router.replace("/login");
            return;
        }

        if (isRotaMedico && user.tipo !== UserType.MEDICO) {
            router.replace(
                user.tipo === UserType.ADMIN ? "/admin/auditoria" : "/dashboard/paciente",
            );
            return;
        }

        if (isRotaPaciente && user.tipo !== UserType.PACIENTE) {
            router.replace(
                user.tipo === UserType.ADMIN ? "/admin/auditoria" : "/dashboard/medico",
            );
            return;
        }

        if (isRotaAdmin && user.tipo !== UserType.ADMIN) {
            router.replace(
                user.tipo === UserType.MEDICO ? "/dashboard/medico" : "/dashboard/paciente",
            );
        }
    }, [user, loading, isRotaMedico, isRotaPaciente, isRotaAdmin, router]);

    if (loading || !user || tipoNaoAutorizado) {
        return <LoadingState />;
    }

    return <>{children}</>;
}
