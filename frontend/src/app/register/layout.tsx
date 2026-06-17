import type { Metadata } from "next";
import styles from './register.module.css';

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
    <html lang="en" className="h-full antialiased">
        <body className="min-h-full flex flex-col">
            <div className={styles.containerLeft}>
        
                <div className={styles.logoCompleta}>

                    <img src="/Icon.svg" alt="Logo HealthTech" className={styles.logoCompleta} />
                    <h1>Health<span>Tech</span></h1>

                </div>
                
                <h2>Exames médicos seguros, compartilhados com clareza.</h2>
                <p>Conecte pacientes e médicos em um ambiente clínico, criptografado e acessível. Receba, visualize e baixe seus exames em um só lugar.</p>
            </div>
            
            {children}
        </body>
    </html>
  );
}