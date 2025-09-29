"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface DeleteUserButtonProps {
  userId: number;
}

export function DeleteUserButton({ userId }: DeleteUserButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    // Adiciona uma confirmação para evitar exclusões acidentais
    if (!window.confirm("Tem certeza de que deseja excluir sua conta? Esta ação é irreversível.")) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      // Se não houver token, redireciona para o login
      router.push("/auth/login");
      return;
    }

    try {
      const apiUrl = `http://127.0.0.1:8011/contas/api/users/${userId}/`;

      const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      // O status 204 No Content indica sucesso na exclusão
      if (response.status === 204) {
        // Limpa os dados de autenticação
        localStorage.removeItem("accessToken");
        
        // Dispara um evento de 'storage' para que outras partes da aplicação (como o Header)
        // possam reagir à mudança no estado de autenticação.
        window.dispatchEvent(new Event("storage"));

        // Redireciona para a página de login após o sucesso
        router.push("/auth/login");
        
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Erro na API: ${response.status}`);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Ocorreu um erro desconhecido.";
      setError(message);
      // Opcional: mostrar o erro para o usuário de forma mais amigável
      alert(`Erro ao excluir conta: ${message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300 disabled:bg-red-400 mt-6"
      >
        {isDeleting ? "Excluindo conta..." : "Excluir Minha Conta"}
      </button>
      {error && (
        <p className="text-red-500 text-center mt-2">{error}</p>
      )}
    </>
  );
}
