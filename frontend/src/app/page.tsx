import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    // <main>
    //   <div >
    //      <h1 >HealthTech</h1>
    //      <p >
    //        Bem-vindo! Acesse sua conta ou crie um novo cadastro para começar.
    //      </p>

    //      <div >
    //        <Link href="/login" >
    //          Entrar
    //        </Link>
    //        <Link href="/register" >
    //          Criar conta
    //        </Link>
    //      </div>
    //    </div>
    // </main>
    <main className={styles.page}>
      <div className={styles.card}>
        <img src="/Icon.svg" alt="Logo HealthTech" className={styles.logo} />

        <h1 className={styles.title}>
          Health
          <span className={styles.textTech}>Tech</span>
        </h1>
        <p className={styles.subtitle}>
          Bem-vindo! Acesse sua conta ou crie um novo cadastro para começar.
        </p>

        <div className={styles.actions}>
          <a href="/login"><button className={styles.button}>
            Entrar
          </button>
          </a>
          
          <a href="/register"><button className={styles.button}>
            Criar conta
          </button>
          </a>
        </div>
      </div>
    </main>
  );
}
