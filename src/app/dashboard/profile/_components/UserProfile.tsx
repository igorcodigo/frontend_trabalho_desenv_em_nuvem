"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DeleteUserButton } from "./DeleteUserButton";

// Define uma interface para a estrutura dos dados do usuário
interface UserData {
  id: number;
  email: string;
  username: string;
  full_name: string;
  phone_number: string;
  date_of_birth: string | null; // Pode ser string ou nulo
}

export function UserProfile() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Estados para o modo de edição
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserData>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        // Se não houver token, redireciona para a página de login
        router.push("/auth/login");
        return;
      }

      try {
        // Endpoint da sua API Python
        const apiEndpoint = "http://127.0.0.1:8011/contas/api/me/";

        const response = await fetch(apiEndpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          // Trata erros da API (ex: token inválido, expirado)
          const errorData = await response.json();
          throw new Error(
            errorData.detail || `Erro na API: ${response.status}`,
          );
        }

        const data: UserData = await response.json();
        setUserData(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Ocorreu um erro desconhecido.");
        }
        // Em caso de erro (ex: token inválido), pode ser útil limpar o token e redirecionar
        localStorage.removeItem("accessToken");
        // Dispara um evento de storage para que o Header e outras abas atualizem o estado de autenticação
        window.dispatchEvent(new Event("storage"));
        router.push("/auth/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => {
    if (userData) {
      setFormData({
        full_name: userData.full_name,
        username: userData.username,
        phone_number: userData.phone_number,
        date_of_birth: userData.date_of_birth,
      });
      setIsEditing(true);
      setSaveStatus(null); // Limpa o status ao entrar no modo de edição
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({});
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    const accessToken = localStorage.getItem("accessToken");

    try {
      const apiEndpoint = "http://127.0.0.1:8011/contas/api/me/";
      const response = await fetch(apiEndpoint, {
        method: "PATCH", // Usamos PATCH para atualizações parciais
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Tenta pegar uma mensagem de erro específica do corpo da resposta
        const errorMessage = Object.values(errorData).flat().join(' ') || 'Falha ao atualizar o perfil.';
        throw new Error(errorMessage);
      }

      const updatedUserData: UserData = await response.json();
      setUserData(updatedUserData); // Atualiza os dados exibidos
      setIsEditing(false);
      setSaveStatus({ type: 'success', message: 'Perfil atualizado com sucesso!' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Ocorreu um erro desconhecido.";
      setSaveStatus({ type: 'error', message });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-lg font-semibold">Carregando perfil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Erro: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  if (!userData) {
    return null; // Não renderiza nada se não houver dados
  }

  return (
    <div className="bg-white shadow-lg rounded-xl p-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-800">
          Perfil do Usuário
        </h1>
        {!isEditing && (
          <button
            onClick={handleEdit}
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Editar
          </button>
        )}
      </div>

      {saveStatus && (
        <div className={`p-4 mb-4 rounded-md text-center ${
          saveStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {saveStatus.message}
        </div>
      )}
      
      {!isEditing ? (
        <div className="space-y-4">
          {/* MODO DE VISUALIZAÇÃO */}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-500">Nome Completo</span>
            <p className="text-lg text-gray-900">{userData.full_name}</p>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-500">Nome de Usuário</span>
            <p className="text-lg text-gray-900">{userData.username}</p>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-500">Email</span>
            <p className="text-lg text-gray-900">{userData.email}</p>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-500">Telefone</span>
            <p className="text-lg text-gray-900">{userData.phone_number || "Não informado"}</p>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-500">Data de Nascimento</span>
            <p className="text-lg text-gray-900">{userData.date_of_birth || "Não informada"}</p>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-500">ID do Usuário</span>
            <p className="text-lg text-gray-900">{userData.id}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* MODO DE EDIÇÃO */}
          <div>
            <label htmlFor="full_name" className="text-sm font-medium text-gray-500">Nome Completo</label>
            <input
              type="text"
              name="full_name"
              id="full_name"
              value={formData.full_name || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="username" className="text-sm font-medium text-gray-500">Nome de Usuário</label>
            <input
              type="text"
              name="username"
              id="username"
              value={formData.username || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="phone_number" className="text-sm font-medium text-gray-500">Telefone</label>
            <input
              type="text"
              name="phone_number"
              id="phone_number"
              value={formData.phone_number || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="date_of_birth" className="text-sm font-medium text-gray-500">Data de Nascimento</label>
            <input
              type="date"
              name="date_of_birth"
              id="date_of_birth"
              value={formData.date_of_birth || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              onClick={handleCancel}
              className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-300"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300 disabled:bg-green-300"
            >
              {isSaving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </div>
      )}

      {!isEditing && (
        <div className="mt-6 border-t pt-6">
          <DeleteUserButton userId={userData.id} />
        </div>
      )}
    </div>
  );
}
