import type { Metadata } from "next";
import AuthLayout from "@/components/ui/AuthLayout";

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
        <div>
            <AuthLayout>{children}</AuthLayout>
        </div>
    );
}
