"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

const mockUser = {
  name: "Convidado"
};

export default function DashboardPage() {
  const router = useRouter();

  const handleSignOut = () => {
    // TODO: integrar com backend (NestJS) para invalidar sessão / token
    router.push("/login");
  };

  return (
    <main className={styles.hero}>
      <section className={styles.card}>
        <p className={styles.eyebrow}>Bem-vindo de volta</p>
        <h1>Olá, {mockUser.name} 👋</h1>
        <p className={styles.body}>
          Este é o hub da LMC. A partir daqui você terá acesso às iniciativas internas, materiais de suporte e
          relatórios de performance. Estamos preparando os módulos e integrações — em breve você encontrará cards de
          navegação personalizados de acordo com seu perfil.
        </p>
        <div className={styles.actions}>
          <Link className={styles.primary} href="/login">
            Ajustar perfil
          </Link>
          <button className={styles.secondary} onClick={handleSignOut}>
            Sair
          </button>
        </div>
      </section>
    </main>
  );
}
