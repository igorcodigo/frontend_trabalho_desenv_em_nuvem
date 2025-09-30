"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "~/context/AuthContext";

export function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [responseMessage, setResponseMessage] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const { login } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setResponseMessage({ type: null, message: "Enviando..." });

    try {
      const response = await fetch("https://facul.subarashii.com.br/contas/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (response.ok) {
        setResponseMessage({
          type: "success",
          message: `Login bem-sucedido! Redirecionando...`,
        });

        // Usa a função de login do contexto para centralizar a lógica
        login(result.access, result.refresh);
      } else {
        setResponseMessage({
          type: "error",
          message: `Falha no login.\n\nStatus: ${
            response.status
          }\n\nErros (JSON):\n${JSON.stringify(result, null, 2)}`,
        });
      }
    } catch (error) {
      setResponseMessage({
        type: "error",
        message: `Ocorreu um erro na requisição:\n\n${error}`,
      });
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl bg-white/20 p-8 shadow-2xl backdrop-blur-lg">
      <div className="text-center">
        <h3 className="text-4xl font-bold tracking-tight text-white">
          Acesse sua Conta
        </h3>
        <p className="mt-2 text-base text-white/80">
          Organize sua vida, uma tarefa de cada vez.
        </p>
      </div>
      <div className="mt-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium leading-6 text-white"
            >
              Usuário ou Email
            </label>
            <div className="mt-2">
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="block w-full rounded-lg border-0 bg-white/30 py-3 px-4 text-white shadow-sm ring-1 ring-inset ring-white/30 placeholder:text-gray-200 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-base sm:leading-6"
                placeholder="seu.nome@exemplo.com"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-6 text-white"
            >
              Senha
            </label>
            <div className="mt-2">
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full rounded-lg border-0 bg-white/30 py-3 px-4 text-white shadow-sm ring-1 ring-inset ring-white/30 placeholder:text-gray-200 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-base sm:leading-6"
                placeholder="••••••••"
              />
            </div>
          </div>
          <button
            type="submit"
            className="flex h-12 w-full items-center justify-center whitespace-nowrap rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 px-4 py-2 text-base font-semibold text-white shadow-lg ring-offset-background transition-transform duration-200 hover:scale-105 hover:from-purple-700 hover:to-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            Entrar
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-white/80">
          Não tem uma conta?{" "}
          <Link
            href="/auth/register"
            className="font-semibold text-white underline hover:text-purple-300"
          >
            Cadastre-se aqui
          </Link>
        </p>
      </div>

      {responseMessage.message && (
        <div className="mt-6">
          <pre
            className={`w-full whitespace-pre-wrap break-words rounded-md p-4 text-white ${
              responseMessage.type === "success"
                ? "bg-green-500/30"
                : ""
            } ${
              responseMessage.type === "error"
                ? "bg-red-500/30"
                : ""
            }`}
          >
            {responseMessage.message}
          </pre>
        </div>
      )}
    </div>
  );
}
