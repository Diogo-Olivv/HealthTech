import type { Metadata } from "next";
import styles from "@/app/dashboard/dashboard.module.css";
import Navbar from "@/components/ui/Navbar";
import AuthGuard from "@/components/auth/AuthGuard";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
    title: "HealthTech · Admin",
    description: "Painel administrativo do HealthTech",
};

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <AuthProvider>
            <div className={styles.layoutContainer}>
                <Navbar />
                <main className={styles.mainContent}>
                    <AuthGuard>{children}</AuthGuard>
                </main>
            </div>
        </AuthProvider>
    );
}
