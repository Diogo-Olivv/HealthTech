import Link from 'next/link';
// import styles from './page.module.css';

export default function Home() {
  return (
    <main>
      <div >
         <h1 >HealthTech</h1>
         <p >
           Bem-vindo! Acesse sua conta ou crie um novo cadastro para começar.
         </p>

         <div >
           <Link href="/login" >
             Entrar
           </Link>
           <Link href="/register" >
             Criar conta
           </Link>
         </div>
       </div>
    </main>
    // <main className={styles.page}>
    //   <div className={styles.card}>
    //     <h1 className={styles.title}>HealthTech</h1>
    //     <p className={styles.subtitle}>
    //       Bem-vindo! Acesse sua conta ou crie um novo cadastro para começar.
    //     </p>

    //     <div className={styles.actions}>
    //       <Link href="/login" className={styles.primary}>
    //         Entrar
    //       </Link>
    //       <Link href="/register" className={styles.secondary}>
    //         Criar conta
    //       </Link>
    //     </div>
    //   </div>
    // </main>
  );
}
