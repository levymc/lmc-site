"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

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
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(42,32,25,0.8),_transparent_50%),_radial-gradient(circle_at_bottom_right,_rgba(212,181,150,0.65),_transparent_45%),_var(--background-accent)] px-4 py-12 md:px-10">
      <section className="w-full max-w-3xl rounded-[2.25rem] border border-white/50 bg-surface/95 p-10 shadow-card-strong backdrop-blur">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.45em] text-foreground-muted">Bem-vindo de volta</p>
        <h1 className="text-4xl font-semibold text-foreground">Olá, {mockUser.name} 👋</h1>
        <p className="mt-6 text-lg leading-relaxed text-foreground-muted">
          Este é o hub da LMC. A partir daqui você terá acesso às iniciativas internas, materiais de suporte e relatórios
          de performance. Estamos preparando os módulos e integrações — em breve você encontrará cards personalizados de
          acordo com seu perfil.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 font-semibold text-white transition hover:bg-accent-hover"
            href="/login"
          >
            Ajustar perfil
          </Link>
          <button
            className="inline-flex items-center justify-center rounded-full border border-border bg-transparent px-6 py-3 font-semibold text-foreground transition hover:-translate-y-0.5"
            onClick={handleSignOut}
          >
            Sair
          </button>
        </div>
      </section>
    </main>
  );
}
