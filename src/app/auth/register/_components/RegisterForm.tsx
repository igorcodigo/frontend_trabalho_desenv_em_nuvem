"use client";

import { useState } from "react";

export function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [responseMessage, setResponseMessage] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: Record<string, any> = {
      username,
      email,
      password,
    };

    if (fullName) data.full_name = fullName;
    if (phoneNumber) data.phone_number = phoneNumber;
    if (dateOfBirth) data.date_of_birth = dateOfBirth;

    setResponseMessage({ type: null, message: "Enviando..." });

    try {
      const response = await fetch("http://127.0.0.1:8011/contas/api/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setResponseMessage({
          type: "success",
          message: `Usuário criado com sucesso!\n\nStatus: ${
            response.status
          }\n\nResposta (JSON):\n${JSON.stringify(result, null, 2)}`,
        });
      } else {
        setResponseMessage({
          type: "error",
          message: `Falha ao criar usuário.\n\nStatus: ${
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
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-4 text-2xl font-bold">Criar um Novo Usuário</h1>
      <p className="mb-4">
        Este formulário envia uma requisição POST para{" "}
        <code>/accounts/api/users/</code> para criar um novo usuário.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="username" className="block font-medium">
            Username:
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full rounded-md border border-gray-300 p-2"
          />
        </div>
        <div>
          <label htmlFor="email" className="block font-medium">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-md border border-gray-300 p-2"
          />
        </div>
        <div>
          <label htmlFor="password" className="block font-medium">
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-md border border-gray-300 p-2"
          />
        </div>
        <div>
          <label htmlFor="full_name" className="block font-medium">
            Nome Completo (Opcional):
          </label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2"
          />
        </div>
        <div>
          <label htmlFor="phone_number" className="block font-medium">
            Telefone (Opcional):
          </label>
          <input
            type="text"
            id="phone_number"
            name="phone_number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2"
          />
        </div>
        <div>
          <label htmlFor="date_of_birth" className="block font-medium">
            Data de Nascimento (Opcional):
          </label>
          <input
            type="date"
            id="date_of_birth"
            name="date_of_birth"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2"
          />
        </div>
        <button
          type="submit"
          className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Criar Usuário
        </button>
      </form>

      <h2 className="mt-6 text-xl font-bold">Resposta da API</h2>
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
        {responseMessage.message || "Aguardando envio..."}
      </pre>
    </div>
  );
}
