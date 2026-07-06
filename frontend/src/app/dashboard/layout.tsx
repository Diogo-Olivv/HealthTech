import type { Metadata } from "next";
import styles from "./dashboard.module.css";
import NavBar from "@/components/ui/NavBar";
import AuthGuard from "@/components/auth/AuthGuard";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
    title: "HealthTech",
    description: "AILAB - Makers",
};

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <AuthProvider>
            <div className={styles.layoutContainer}>
                <NavBar />
                <main className={styles.mainContent}>
                    <AuthGuard>
                        {children}
                    </AuthGuard>
                </main>
            </div>
        </AuthProvider>
    );
}
