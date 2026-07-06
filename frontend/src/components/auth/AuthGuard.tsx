"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getToken, getProfile, clearToken } from "@/services/users.service";
import LoadingState from "@/components/arquivos/LoadingState";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const token = getToken();
            if (!token) {
                router.replace("/");
                return;
            }

            try {
                const profile = await getProfile(token);
                const tipo = profile.tipo.toLowerCase();

                if (pathname.includes("/dashboard/medico") && tipo !== "medico") {
                    router.replace("/dashboard/paciente");
                    return;
                }

                if (pathname.includes("/dashboard/paciente") && tipo !== "paciente") {
                    router.replace("/dashboard/medico");
                    return;
                }

                setIsAuthorized(true);
            } catch (error) {
                clearToken();
                router.replace("/");
            }
        };

        checkAuth();
    }, [pathname, router]);

    if (!isAuthorized) {
        return <LoadingState />;
    }

    return <>{children}</>;
}
