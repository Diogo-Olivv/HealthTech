import type { Metadata } from "next";
import Image from "next/image";
import styles from "./dashboard.module.css";
import NavBar from "@/components/ui/NavBar";


export const metadata: Metadata = {
    title: "HealthTech",
    description: "AILAB - Makers",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className={styles.layoutContainer}>
            <NavBar />
            <main className={styles.mainContent}>
                {children}
            </main>
        </div>
    );
}
