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
      const response = await fetch("http://127.0.0.1:8011/todolist/", {
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
      const response = await fetch("http://127.0.0.1:8011/todolist/", {
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
      const response = await fetch(`http://127.0.0.1:8011/todolist/${id}/`, {
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
      const response = await fetch(`http://127.0.0.1:8011/todolist/${id}/`, {
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

  return (
    <div className="w-full max-w-2xl mt-8">
      <form onSubmit={handleAddTodo} className="mb-8 flex flex-col gap-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título da tarefa"
          className="p-2 border rounded text-black"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descrição da tarefa"
          className="p-2 border rounded text-black"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Adicionar Tarefa
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
      <ul>
        {todos.map((todo) => (
          <li
            key={todo.id}
            className={`flex items-center justify-between p-4 mb-2 rounded ${
              todo.completed ? "bg-green-200" : "bg-white"
            }`}
          >
            <div
              className={`flex-1 ${
                todo.completed ? "line-through text-gray-500" : "text-black"
              }`}
            >
              <h2 className="font-bold">{todo.title}</h2>
              <p>{todo.description}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleToggleComplete(todo.id, todo.completed)}
                className="bg-yellow-500 text-white p-2 rounded"
              >
                {todo.completed ? "Desmarcar" : "Concluir"}
              </button>
              <button
                onClick={() => handleDeleteTodo(todo.id)}
                className="bg-red-500 text-white p-2 rounded"
              >
                Deletar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
