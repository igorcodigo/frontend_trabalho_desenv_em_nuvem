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
        "http://127.0.0.1:8011/contas/api/token/logout/",
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
    <>
      <button
        onClick={handleLogout}
        className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
      >
        Logout
      </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </>
  );
}
