"use client";

import { useState } from "react";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface User {
  id: string;
  email: string;
  todos: Todo[];
}

export default function ClientTodosByUser({ users }: { users: User[] }) {
  const [openUserId, setOpenUserId] = useState<string | null>(null);

  const toggleUser = (id: string) => {
    setOpenUserId(openUserId === id ? null : id);
  };

  return (
    <ul className="space-y-4">
      {users.map((user) => (
        <li key={user.id}>
          <button
            onClick={() => toggleUser(user.id)}
            className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-black"
          >
            👤 {user.email}
          </button>

          {openUserId === user.id && (
            <ul className="mt-2 ml-4 border-l pl-4 space-y-2">
              {user.todos.length === 0 ? (
                <li className="text-sm text-gray-500">
                  등록된 TODO가 없습니다.
                </li>
              ) : (
                user.todos.map((todo) => (
                  <li key={todo.id} className="text-sm">
                    <span
                      className={
                        todo.completed
                          ? "line-through text-gray-400"
                          : "text-black font-medium"
                      }
                    >
                      {todo.completed ? "✅" : "⏳"} {todo.text}
                    </span>
                  </li>
                ))
              )}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}
