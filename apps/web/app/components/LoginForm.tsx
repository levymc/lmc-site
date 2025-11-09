"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AuthResponse } from "@lmc/types";

type Status = "idle" | "submitting" | "error";

export function LoginForm() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error("Credenciais inválidas");
      }

      const data = (await response.json()) as AuthResponse;

      // TODO: armazenar token (cookies / storage) após backend definir estratégia
      if (typeof window !== "undefined") {
        window.localStorage.setItem("lmc.auth.token", data.token);
      }

      router.push("/");
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Erro inesperado");
    } finally {
      setStatus("idle");
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground" htmlFor="email">
          E-mail
        </label>
        <input
          className="rounded-xl border border-border bg-white/80 px-4 py-3 text-base text-foreground placeholder:text-foreground-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          id="email"
          name="email"
          type="email"
          placeholder="voce@lmc.com"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground" htmlFor="password">
          Senha
        </label>
        <input
          className="rounded-xl border border-border bg-white/80 px-4 py-3 text-base text-foreground placeholder:text-foreground-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
        />
      </div>

      {status === "error" && <p className="text-sm text-red-600">{errorMessage}</p>}

      <button
        className="rounded-xl bg-accent px-4 py-3 text-base font-semibold text-white transition hover:bg-accent-hover disabled:opacity-60"
        disabled={status === "submitting"}
        type="submit"
      >
        {status === "submitting" ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
