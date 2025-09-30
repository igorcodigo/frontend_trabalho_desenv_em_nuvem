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
        const apiEndpoint = "http://134.122.4.163:8011/contas/api/me/";

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
      const apiEndpoint = "http://134.122.4.163:8011/contas/api/me/";
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
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-2xl mb-6 animate-pulse">
            <svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-2xl font-bold text-gray-700 mb-2">Carregando perfil...</p>
          <p className="text-gray-500">Aguarde enquanto buscamos suas informações</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 max-w-md">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-full shadow-2xl mb-6">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-red-600 mb-3">Ops! Algo deu errado</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return null; // Não renderiza nada se não houver dados
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="mb-8 inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-2xl relative">
          {/* Avatar placeholder with user initial */}
          <span className="text-3xl font-bold text-white">
            {userData.full_name ? userData.full_name.charAt(0).toUpperCase() : userData.username.charAt(0).toUpperCase()}
          </span>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3">
          TaskFlow Profile
        </h1>
        <p className="text-xl text-gray-600 mb-2 font-medium">
          Gerencie suas informações pessoais
        </p>
        <p className="text-gray-500 text-base">
          Mantenha seus dados atualizados para uma melhor experiência
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 mb-8">
        <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Meus Dados</h2>
              <p className="text-gray-500">Informações da sua conta</p>
            </div>
          </div>
        {!isEditing && (
          <button
            onClick={handleEdit}
              className="px-6 py-3 text-lg font-bold text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] focus:ring-4 focus:ring-purple-200 transition-all duration-300 transform active:scale-[0.98] flex items-center gap-2"
          >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Editar Perfil
          </button>
        )}
      </div>

      {saveStatus && (
          <div className={`p-6 mb-6 rounded-2xl text-center text-lg font-semibold ${
            saveStatus.type === 'success' 
              ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-l-4 border-emerald-400 text-emerald-800' 
              : 'bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-400 text-red-800'
          }`}>
            <div className="flex items-center justify-center gap-2">
              {saveStatus.type === 'success' ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
          {saveStatus.message}
            </div>
        </div>
      )}
      
      {!isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* MODO DE VISUALIZAÇÃO */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-lg font-bold text-blue-700">Nome Completo</span>
              </div>
              <p className="text-xl text-gray-800 font-semibold">{userData.full_name || "Não informado"}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                    <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-lg font-bold text-purple-700">Nome de Usuário</span>
              </div>
              <p className="text-xl text-gray-800 font-semibold">@{userData.username}</p>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-100 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <span className="text-lg font-bold text-emerald-700">Email</span>
              </div>
              <p className="text-xl text-gray-800 font-semibold break-all">{userData.email}</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <span className="text-lg font-bold text-orange-700">Telefone</span>
              </div>
              <p className="text-xl text-gray-800 font-semibold">{userData.phone_number || "Não informado"}</p>
            </div>

            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-100 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-lg font-bold text-cyan-700">Data de Nascimento</span>
          </div>
              <p className="text-xl text-gray-800 font-semibold">{userData.date_of_birth || "Não informada"}</p>
          </div>

            <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-100 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-slate-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
          </div>
                <span className="text-lg font-bold text-gray-700">ID do Usuário</span>
          </div>
              <p className="text-xl text-gray-800 font-semibold">#{userData.id}</p>
          </div>
        </div>
      ) : (
          <div className="space-y-6">
          {/* MODO DE EDIÇÃO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label htmlFor="full_name" className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  Nome Completo
                </label>
            <input
              type="text"
              name="full_name"
              id="full_name"
              value={formData.full_name || ''}
              onChange={handleInputChange}
                  className="w-full px-4 py-4 text-lg rounded-2xl border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-inner"
                  placeholder="Seu nome completo"
            />
          </div>

              <div className="space-y-3">
                <label htmlFor="username" className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                    <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                  </svg>
                  Nome de Usuário
                </label>
            <input
              type="text"
              name="username"
              id="username"
              value={formData.username || ''}
              onChange={handleInputChange}
                  className="w-full px-4 py-4 text-lg rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-inner"
                  placeholder="Seu nome de usuário"
            />
          </div>

              <div className="space-y-3">
                <label htmlFor="phone_number" className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                  <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  Telefone
                </label>
            <input
              type="text"
              name="phone_number"
              id="phone_number"
              value={formData.phone_number || ''}
              onChange={handleInputChange}
                  className="w-full px-4 py-4 text-lg rounded-2xl border-2 border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-inner"
                  placeholder="(11) 99999-9999"
            />
          </div>

              <div className="space-y-3">
                <label htmlFor="date_of_birth" className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                  <svg className="w-5 h-5 text-cyan-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  Data de Nascimento
                </label>
            <input
              type="date"
              name="date_of_birth"
              id="date_of_birth"
              value={formData.date_of_birth || ''}
              onChange={handleInputChange}
                  className="w-full px-4 py-4 text-lg rounded-2xl border-2 border-gray-200 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-inner"
            />
              </div>
          </div>

            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-8 border-t border-gray-200">
            <button
              onClick={handleCancel}
                className="px-8 py-4 text-lg font-bold text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] focus:ring-4 focus:ring-gray-200 transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center gap-2"
            >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
                className="px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] focus:ring-4 focus:ring-green-200 transition-all duration-300 transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Salvando...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Salvar Alterações
                  </>
                )}
            </button>
          </div>
        </div>
      )}
      </div>

      {!isEditing && (
          <DeleteUserButton userId={userData.id} />
      )}
    </div>
  );
}
