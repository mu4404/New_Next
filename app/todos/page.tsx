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
  const [editId, setEditId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

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

  // 투두 수정 시작
  const handleEdit = async (todo: Todo) => {
    setEditId(todo.id);
    setEditText(todo.text);
  };

  // 투두 수정 저장
  const handleUpdate = async () => {
    if (!editId || !editText.trim()) return;

    await fetch(`/api/todos/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: editText }),
    });

    setEditId(null);
    setEditText("");
    fetchTodos();
  };

  // 체크박스 토글
  const handleToggleComplete = async (todo: Todo) => {
    await fetch(`/api/todos/${todo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: todo.text,
        completed: !todo.completed,
      }),
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
            <div className="flex items-center space-x-2 flex-1">
              {/* 체크박스 */}
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleComplete(todo)}
                className="accent-green-600"
              />
              {/* 수정 or 텍스트 */}
              {editId === todo.id ? (
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="flex-grow border rounded px-2 py-1 mr-2"
                />
              ) : (
                <span>{todo.text}</span>
              )}
            </div>

            {/* 버튼들 */}
            <div className="flex items-center space-x-2 ml-4">
              {editId === todo.id ? (
                <>
                  <button
                    onClick={handleUpdate}
                    className="text-sm px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    저장
                  </button>
                  <button
                    onClick={() => setEditId(null)}
                    className="text-sm px-2 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                  >
                    취소
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleEdit(todo)}
                    className="text-sm px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(todo.id)}
                    className="text-sm px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    삭제
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
