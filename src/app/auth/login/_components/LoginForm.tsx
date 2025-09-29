"use client";

import { useState } from "react";
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
      const response = await fetch("http://127.0.0.1:8011/contas/api/token/", {
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
    <div className="mx-auto max-w-md">
      <div className="rounded-xl border bg-card text-card-foreground shadow">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="font-semibold tracking-tight text-2xl">Login</h3>
          <p className="text-sm text-muted-foreground">
            Entre com seu usuário/email e senha para acessar.
          </p>
        </div>
        <div className="p-6 pt-0">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Username or Email
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <button
              type="submit"
              className="flex h-10 w-full items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-indigo-600 text-white"
            >
              Login
            </button>
          </form>
        </div>
      </div>


      {responseMessage.message && (
        <div className="mt-6">
          <h2 className="text-xl font-bold">Resposta da API</h2>
          <pre
            className={`mt-2 w-full whitespace-pre-wrap break-words rounded-md bg-gray-100 p-4 ${
              responseMessage.type === "success"
                ? "border-l-4 border-green-500 text-green-700"
                : ""
            } ${
              responseMessage.type === "error"
                ? "border-l-4 border-red-500 text-red-700"
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
