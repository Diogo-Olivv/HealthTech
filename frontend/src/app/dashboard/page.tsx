"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken, getProfile } from "@/services/users.service";
import LoadingState from "@/components/arquivos/LoadingState";

export default function DashboardRootPage() {
    const router = useRouter();

    useEffect(() => {
        const redirectUser = async () => {
            const token = getToken();
            if (!token) {
                router.replace("/");
                return;
            }
            try {
                const profile = await getProfile();
                // Redireciona para /dashboard/medico ou /dashboard/paciente
                router.replace(`/dashboard/${profile.tipo.toLowerCase()}`);
            } catch (error) {
                router.replace("/");
            }
        };
        redirectUser();
    }, [router]);

    return <LoadingState />;
}
