import { redirect } from "next/navigation";
import styles from "@/components/arquivos/ArquivosPage.module.css";
import ErrorState from "@/components/arquivos/ErrorState";
import { serverFetch, UnauthenticatedError } from "@/lib/server-http";
import type { MedicoVinculadoDto } from "@/dto/medico-vinculado.dto";
import MeusMedicosClient from "./MeusMedicosClient";

export default async function MeusMedicosPage() {
    let medicos: MedicoVinculadoDto[];
    try {
        medicos = await serverFetch<MedicoVinculadoDto[]>(
            "/medico-paciente/meus-medicos",
            {},
            "Erro ao buscar seus médicos.",
        );
    } catch (err) {
        if (err instanceof UnauthenticatedError) redirect("/login");
        const msg = err instanceof Error ? err.message : "Erro ao carregar médicos.";
        return (
            <main>
                <div className={styles.container}>
                    <ErrorState msg={msg} />
                </div>
            </main>
        );
    }

    return (
        <main>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <h1 className={styles.title}>Meus Médicos</h1>
                        <p className={styles.subtitle}>
                            Médicos que possuem acesso ao seu histórico de exames
                        </p>
                    </div>
                </div>

                <MeusMedicosClient initialData={medicos} />
            </div>
        </main>
    );
}
