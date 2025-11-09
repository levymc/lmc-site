import { LoginForm } from "../../components/LoginForm";

export const metadata = {
  title: "Entrar • LMC"
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(47,35,26,0.75),_transparent_60%),_radial-gradient(circle_at_bottom,_rgba(133,102,78,0.65),_transparent_45%)] px-4 py-10 md:px-6">
      <section className="w-full max-w-lg rounded-3xl border border-white/60 bg-surface/95 p-10 text-foreground shadow-card-soft backdrop-blur-sm">
        <div className="mb-8 flex flex-col gap-2">
          <p className="text-sm uppercase tracking-[0.35em] text-foreground-muted">Área da LMC</p>
          <h1 className="text-3xl font-semibold text-foreground">Faça login</h1>
          <p className="text-base text-foreground-muted">Use o e-mail corporativo para acessar os conteúdos exclusivos.</p>
        </div>
        <LoginForm />
      </section>
    </main>
  );
}
