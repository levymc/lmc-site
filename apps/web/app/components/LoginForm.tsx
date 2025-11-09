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
      window.localStorage.setItem("lmc.auth.token", data.token);

      router.push("/");
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Erro inesperado");
    } finally {
      setStatus("idle");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="email">E-mail</label>
        <input id="email" name="email" type="email" placeholder="voce@lmc.com" required />
      </div>

      <div className="form-group">
        <label htmlFor="password">Senha</label>
        <input id="password" name="password" type="password" placeholder="••••••••" required />
      </div>

      {status === "error" && <p className="error">{errorMessage}</p>}

      <button disabled={status === "submitting"} type="submit">
        {status === "submitting" ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
