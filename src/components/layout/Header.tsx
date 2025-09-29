"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LogoutButton } from "../auth/LogoutButton";

export function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // A verificação do token só pode acontecer no lado do cliente
    const token = localStorage.getItem("accessToken");
    setIsAuthenticated(!!token);

    const handleStorageChange = () => {
      const token = localStorage.getItem("accessToken");
      setIsAuthenticated(!!token);
    };

    // Ouve por mudanças no localStorage para atualizar o estado (login/logout em outra aba)
    window.addEventListener("storage", handleStorageChange);

    // Limpa o event listener quando o componente é desmontado
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold hover:text-gray-300">
          Home
        </Link>
        <div>
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/profile"
                className="text-white hover:text-gray-300 transition-colors"
              >
                Perfil
              </Link>
              <Link
                href="/todolist"
                className="text-white hover:text-gray-300 transition-colors"
              >
                Todo List
              </Link>
              <LogoutButton />
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/auth/login"
                className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
              >
                Criar Conta
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
