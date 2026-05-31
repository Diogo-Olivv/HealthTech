'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { UserProfile } from '@/dto/users.dto';
import { clearToken, getProfile, getToken } from '@/services/users.service';
import styles from './dashboard.module.css';

type Status = 'loading' | 'ready';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace('/login');
      return;
    }

    // Valida o token no backend; se estiver inválido, volta para o login
    getProfile(token)
      .then((profile) => {
        setUser(profile);
        setStatus('ready');
      })
      .catch(() => {
        clearToken();
        router.replace('/login');
      });
  }, [router]);

  function handleLogout() {
    clearToken();
    router.replace('/login');
  }

  if (status === 'loading' || !user) {
    return (
      <main className={styles.page}>
        <p className={styles.loading}>Carregando...</p>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Olá, {user.name}</h1>
        <p className={styles.text}>Você está em uma área protegida.</p>
        <p className={styles.text}>E-mail: {user.email}</p>

        <button className={styles.button} type="button" onClick={handleLogout}>
          Sair
        </button>
      </div>
    </main>
  );
}
