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
      const apiUrl = `https://facul.subarashii.com.br/contas/api/users/${userId}/`;

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
    <div className="bg-gradient-to-br from-red-50 to-pink-50 backdrop-blur-lg rounded-3xl shadow-xl border border-red-100 p-8">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-full shadow-2xl mb-4">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 012 0v4a1 1 0 11-2 0V7zM8 13a1 1 0 112 0 1 1 0 01-2 0z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-red-700 mb-2">Zona de Perigo</h3>
        <p className="text-red-600 mb-4">
          Ação irreversível que excluirá permanentemente sua conta e todos os seus dados
        </p>
        <div className="bg-white/60 rounded-xl p-4 mb-6 border border-red-200">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="text-left">
              <p className="text-sm font-semibold text-red-700 mb-1">Antes de prosseguir, saiba que:</p>
              <ul className="text-sm text-red-600 space-y-1">
                <li>• Todas as suas tarefas serão perdidas</li>
                <li>• Não será possível recuperar os dados</li>
                <li>• A ação é imediata e permanente</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="w-full py-4 px-6 text-lg font-bold text-white bg-gradient-to-r from-red-500 via-red-600 to-pink-600 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] focus:ring-4 focus:ring-red-200 transition-all duration-300 transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
      >
        {isDeleting ? (
          <>
            <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Excluindo conta...
          </>
        ) : (
          <>
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2v3a2 2 0 002 2h2a2 2 0 002-2v-3a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
            Excluir Minha Conta Permanentemente
          </>
        )}
      </button>
      
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded-xl">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-red-700 font-semibold">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
