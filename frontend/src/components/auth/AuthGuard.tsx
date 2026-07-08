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
    const tipoNaoAutorizado =
        (isRotaMedico && user?.tipo !== UserType.MEDICO) ||
        (isRotaPaciente && user?.tipo !== UserType.PACIENTE);

    useEffect(() => {
        if (loading) return;

        if (!user) {
            router.replace("/login");
            return;
        }

        if (isRotaMedico && user.tipo !== UserType.MEDICO) {
            router.replace("/dashboard/paciente");
            return;
        }

        if (isRotaPaciente && user.tipo !== UserType.PACIENTE) {
            router.replace("/dashboard/medico");
        }
    }, [user, loading, isRotaMedico, isRotaPaciente, router]);

    if (loading || !user || tipoNaoAutorizado) {
        return <LoadingState />;
    }

    return <>{children}</>;
}
