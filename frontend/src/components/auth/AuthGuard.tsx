"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import LoadingState from "@/components/arquivos/LoadingState";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    
    const { user, loading } = useAuth();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        if (loading) return;

        if (!user) {
            router.replace("/");
            return;
        }

        const tipo = user.tipo.toLowerCase();

        if (pathname.includes("/dashboard/medico") && tipo !== "medico") {
            router.replace("/dashboard/paciente");
            return;
        }

        if (pathname.includes("/dashboard/paciente") && tipo !== "paciente") {
            router.replace("/dashboard/medico");
            return;
        }

        setIsAuthorized(true);
    }, [user, loading, pathname, router]);

    if (loading || !isAuthorized) {
        return <LoadingState />;
    }

    return <>{children}</>;
}
