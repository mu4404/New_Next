"use client";

import { useEffect, useState } from "react";

// Todo 타입 정의
type Todo = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
};

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState("");

  // 투두 목록 가져오기
  const fetchTodos = async () => {
    const res = await fetch("/api/todos");
    const data = await res.json();
    setTodos(data);
  };

  // 투두 추가
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    setText("");
    fetchTodos();
  };

  // 투두 삭제
  const handleDelete = async (id: string) => {
    await fetch(`/api/todos/${id}`, {
      method: "DELETE",
    });
    fetchTodos();
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <main className="max-w-xl mx-auto mt-16 p-4">
      <h1 className="text-2xl font-bold mb-6">📋 TODO 리스트</h1>

      <form onSubmit={handleSubmit} className="flex mb-4 space-x-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-grow px-4 py-2 border rounded"
          placeholder="할 일을 입력하세요"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          추가
        </button>
      </form>

      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="px-4 py-2 bg-white shadow rounded border text-gray-800 flex justify-between items-center"
          >
            <span>{todo.text}</span>
            <button
              onClick={() => handleDelete(todo.id)}
              className="m1-4 px-2 py-1 text-sm text-white bg-red-500 hover:bg-red-600 rounded"
            >
              🗑 삭제
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
