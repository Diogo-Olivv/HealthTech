import type { Metadata } from "next";
import styles from './login.module.css';

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
        <div className="min-h-full flex flex-col">
            
            
            <div className="navbar__right">
         <div className="navbar__user">
           <div className="navbar__avatar">BR</div>
           <div className="navbar__user-info">
            <span className="navbar__user-name">Nome do Usuario</span>
            <span className="navbar__user-role">Informações do usuário</span>
           </div>
           </div>

           <div className="navbar__divider"></div>

            <button className="navbar__logout">
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
           <polyline points="16 17 21 12 16 7"/>
           <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
         Sair
        </button>
</div>
            {children}
        </div>
  );
}