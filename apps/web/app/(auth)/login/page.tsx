import { LoginForm } from "../../components/LoginForm";
import styles from "./login.module.css";

export const metadata = {
  title: "Entrar • LMC"
};

export default function LoginPage() {
  return (
    <main className={styles.container}>
      <section className={styles.card}>
        <div className={styles.title}>
          <p>Área da LMC</p>
          <h1>Faça login</h1>
          <p>Use o e-mail corporativo para acessar os conteúdos exclusivos.</p>
        </div>
        <LoginForm />
      </section>
    </main>
  );
}
