"use client";

import { useState } from "react";
import Link from "next/link";

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
      const response = await fetch("http://134.122.4.163:8011/contas/api/users/", {
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
    <div className="mx-auto max-w-md">
      {/* Header Section */}
      <div className="text-center mb-10">
        <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-2xl">
          <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3">
          TaskFlow
        </h1>
        <p className="text-xl text-gray-600 mb-2 font-medium">
          Crie sua conta
        </p>
        <p className="text-gray-500 text-base">
          Organize suas tarefas e aumente sua produtividade
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Field */}
          <div className="space-y-2">
            <label htmlFor="username" className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              Nome de usuário
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-4 text-lg rounded-2xl border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-inner"
              placeholder="Digite seu nome de usuário"
            />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-4 text-lg rounded-2xl border-2 border-gray-200 focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-inner"
              placeholder="seu@email.com"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Senha
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-4 text-lg rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-inner"
              placeholder="••••••••"
            />
          </div>

          {/* Optional Fields */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 space-y-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Informações adicionais (opcional)
            </h3>
            
            <div className="space-y-2">
              <label htmlFor="full_name" className="text-base font-medium text-gray-600">
                Nome completo
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 text-base rounded-xl border border-gray-200 focus:border-blue-300 focus:ring-3 focus:ring-blue-100 transition-all duration-200 bg-white/60"
                placeholder="Seu nome completo"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone_number" className="text-base font-medium text-gray-600">
                Telefone
              </label>
              <input
                type="text"
                id="phone_number"
                name="phone_number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-3 text-base rounded-xl border border-gray-200 focus:border-blue-300 focus:ring-3 focus:ring-blue-100 transition-all duration-200 bg-white/60"
                placeholder="(11) 99999-9999"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="date_of_birth" className="text-base font-medium text-gray-600">
                Data de nascimento
              </label>
              <input
                type="date"
                id="date_of_birth"
                name="date_of_birth"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full px-4 py-3 text-base rounded-xl border border-gray-200 focus:border-blue-300 focus:ring-3 focus:ring-blue-100 transition-all duration-200 bg-white/60"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 px-6 text-xl font-bold text-white bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-[1.02] focus:ring-4 focus:ring-purple-200 transition-all duration-300 transform active:scale-[0.98]"
          >
            <span className="flex items-center justify-center gap-3">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Criar minha conta
            </span>
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-lg">
            Já tem uma conta?{" "}
            <Link 
              href="/auth/login" 
              className="font-semibold text-transparent bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text hover:from-blue-600 hover:to-purple-700 transition-all duration-300 underline decoration-2 underline-offset-4"
            >
              Faça login aqui
            </Link>
          </p>
        </div>
      </div>

      {/* Response Section */}
      {responseMessage.message && (
        <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
          <h2 className="text-2xl font-bold text-gray-700 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Resposta do servidor
          </h2>
          <div
            className={`p-4 rounded-xl text-base font-mono ${
              responseMessage.type === "success"
                ? "bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-400 text-green-800"
                : responseMessage.type === "error"
                ? "bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-400 text-red-800"
                : "bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 text-blue-800"
            }`}
          >
            <pre className="whitespace-pre-wrap break-words">
              {responseMessage.message || "Aguardando envio..."}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
