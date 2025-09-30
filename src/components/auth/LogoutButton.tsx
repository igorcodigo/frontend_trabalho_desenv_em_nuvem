"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    setError(null);

    if (!refreshToken) {
      // Se não há refresh token, apenas limpa o storage e redireciona
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      router.push("/auth/login");
      return;
    }

    try {
      const response = await fetch(
        "https://facul.subarashii.com.br/contas/api/token/logout/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ refresh_token: refreshToken }),
        },
      );

      // O endpoint de logout retorna 205 No Content em sucesso
      if (response.status === 205 || response.ok) {
        // Limpa tokens e redireciona
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        router.push("/auth/login");
      } else {
        const errorData = await response.json();
        setError(`Falha no logout: ${JSON.stringify(errorData)}`);
      }
    } catch (err) {
      setError("Ocorreu um erro ao tentar fazer logout.");
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] focus:ring-4 focus:ring-red-200 transition-all duration-300 transform active:scale-[0.98]"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
        </svg>
        Sair
      </button>
      {error && (
        <div className="absolute top-full left-0 mt-2 p-2 bg-red-100 border border-red-300 rounded-lg shadow-lg min-w-max">
          <p className="text-xs text-red-700 font-medium">{error}</p>
        </div>
      )}
    </div>
  );
}
