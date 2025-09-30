"use client";

import { useState, useEffect } from "react";

interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("accessToken");
    }
    return null;
  };

  const fetchTodos = async () => {
    const token = getAuthToken();
    if (!token) {
      setError("Você não está autenticado.");
      return;
    }

    try {
      const response = await fetch("https://facul.subarashii.com.br/todolist/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTodos(data);
      } else {
        setError("Falha ao buscar as tarefas.");
      }
    } catch (err) {
      setError("Ocorreu um erro ao buscar as tarefas.");
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAuthToken();
    if (!token) {
      setError("Você não está autenticado.");
      return;
    }
    if (!title) {
      setError("O título é obrigatório.");
      return;
    }

    try {
      const response = await fetch("https://facul.subarashii.com.br/todolist/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description }),
      });

      if (response.status === 201) {
        const newTodo = await response.json();
        setTodos([...todos, newTodo]);
        setTitle("");
        setDescription("");
        setError(null);
      } else {
        setError("Falha ao criar a tarefa.");
      }
    } catch (err) {
      setError("Ocorreu um erro ao criar a tarefa.");
    }
  };

  const handleToggleComplete = async (id: number, completed: boolean) => {
    const token = getAuthToken();
    if (!token) {
      setError("Você não está autenticado.");
      return;
    }

    try {
      const response = await fetch(`https://facul.subarashii.com.br/todolist/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: !completed }),
      });

      if (response.ok) {
        const updatedTodo = await response.json();
        setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));
      } else {
        setError("Falha ao atualizar a tarefa.");
      }
    } catch (err) {
      setError("Ocorreu um erro ao atualizar a tarefa.");
    }
  };

  const handleDeleteTodo = async (id: number) => {
    const token = getAuthToken();
    if (!token) {
      setError("Você não está autenticado.");
      return;
    }

    try {
      const response = await fetch(`https://facul.subarashii.com.br/todolist/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 204) {
        setTodos(todos.filter((todo) => todo.id !== id));
      } else {
        setError("Falha ao deletar a tarefa.");
      }
    } catch (err) {
      setError("Ocorreu um erro ao deletar a tarefa.");
    }
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-700">{totalCount}</p>
              <p className="text-sm text-blue-600">Total de Tarefas</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-100 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-700">{completedCount}</p>
              <p className="text-sm text-emerald-600">Concluídas</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-700">{totalCount - completedCount}</p>
              <p className="text-sm text-orange-600">Pendentes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Todo Form */}
      <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Nova Tarefa</h2>
            <p className="text-gray-500">Adicione uma nova tarefa à sua lista</p>
          </div>
        </div>

        <form onSubmit={handleAddTodo} className="space-y-6">
          <div className="space-y-3">
            <label htmlFor="title" className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              Título da tarefa
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Estudar React, Fazer exercícios..."
              className="w-full px-4 py-4 text-lg rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-inner"
            />
          </div>

          <div className="space-y-3">
            <label htmlFor="description" className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <svg className="w-5 h-5 text-cyan-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h8a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h8a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              Descrição (opcional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva os detalhes da sua tarefa..."
              rows={3}
              className="w-full px-4 py-4 text-lg rounded-2xl border-2 border-gray-200 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-inner resize-none"
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-4 px-6 text-xl font-bold text-white bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-[1.02] focus:ring-4 focus:ring-purple-200 transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center gap-3"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Adicionar Tarefa
          </button>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-red-700 font-semibold">{error}</p>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Todo List */}
      <div className="space-y-4">
        {todos.length === 0 ? (
          <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 p-12 text-center">
            <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">Nenhuma tarefa ainda</h3>
            <p className="text-gray-500">Que tal adicionar sua primeira tarefa?</p>
          </div>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className={`bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg border transition-all duration-300 hover:shadow-xl ${
                todo.completed 
                  ? "border-emerald-200 bg-gradient-to-r from-emerald-50/50 to-green-50/50" 
                  : "border-white/20 hover:border-blue-200"
              }`}
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => handleToggleComplete(todo.id, todo.completed)}
                    className={`flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                      todo.completed
                        ? "bg-emerald-500 border-emerald-500 hover:bg-emerald-600"
                        : "border-gray-300 hover:border-emerald-400 hover:bg-emerald-50"
                    }`}
                  >
                    {todo.completed && (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <h3 className={`text-xl font-bold transition-all duration-300 ${
                      todo.completed 
                        ? "line-through text-gray-500" 
                        : "text-gray-800"
                    }`}>
                      {todo.title}
                    </h3>
                    {todo.description && (
                      <p className={`mt-2 text-gray-600 transition-all duration-300 ${
                        todo.completed ? "line-through opacity-60" : ""
                      }`}>
                        {todo.description}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleComplete(todo.id, todo.completed)}
                      className={`px-4 py-2 text-sm font-semibold rounded-xl shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2 ${
                        todo.completed
                          ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600"
                          : "bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:from-emerald-600 hover:to-green-600"
                      }`}
                    >
                      {todo.completed ? (
                        <>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                          </svg>
                          Reabrir
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Concluir
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDeleteTodo(todo.id)}
                      className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-xl shadow-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 012 0v4a1 1 0 11-2 0V7zM12 7a1 1 0 012 0v4a1 1 0 11-2 0V7z" clipRule="evenodd" />
                      </svg>
                      Deletar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
