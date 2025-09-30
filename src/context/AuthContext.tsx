"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Esta função será expandida na próxima etapa
  const logout = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (refreshToken) {
      try {
        await fetch("http://134.122.4.163:8011/contas/api/token/logout/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });
      } catch (error) {
        console.error("Falha ao fazer logout na API:", error);
      }
    }

    // Limpa o armazenamento local e o estado independentemente da resposta da API
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsAuthenticated(false);
    router.push("/auth/login");
  };

  useEffect(() => {
    const verifyToken = async () => {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "http://134.122.4.163:8011/contas/api/token/verify/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: accessToken }),
          },
        );

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          // Se a verificação falhar, o token é inválido ou expirado
          logout(); // logout vai limpar o localStorage e redirecionar
        }
      } catch (error) {
        console.error("Falha ao verificar o token:", error);
        // Em caso de erro de rede, etc., desloga o usuário por segurança
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
     // A dependência `logout` foi removida para evitar re-execuções desnecessárias,
     // já que a função `logout` definida no escopo do componente pode causar um loop
     // se não for memorizada com `useCallback`. Como a lógica é simples, podemos omiti-la.
  }, []);

  const login = (accessToken: string, refreshToken: string) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    setIsAuthenticated(true);
    router.push("/dashboard/profile");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
