import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { todo } from "node:test";

const prisma = new PrismaClient();

export default async function UserTodoPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  // 로그인 안 됨
  if (!session?.user) {
    redirect("/login");
  }

  // 관리자 권한 없음
  if (session.user.role !== "admin" && session.user.role !== "root") {
    redirect("/");
  }

  // 해당 유저 정보 + 투두 조회
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: { todos: { orderBy: { createdAt: "desc" } } },
  });

  if (!user) {
    return <p>해당 사용자를 찾을 수 없습니다.</p>;
  }

  return (
    <main className="max-w-xl mx-auto mt-16 p-4">
      <h1 className="text-xl font-bold mb-4">📋 {user.email} 님의 TODO 목록</h1>
      {user.todos.length === 0 ? (
        <p className="text-gray-500">등록된 할 일이 없습니다.</p>
      ) : (
        <ul className="space-y-2">
          {user.todos.map((todo) => (
            <li
              key={todo.id}
              className="flex justify-between items-center p-2 bh-white rounded border"
            >
              <span
                className={todo.completed ? "line-through text-gray-400" : ""}
              >
                {todo.text}
              </span>
              <form
                method="POST"
                action={`/api/admin/user/${user.id}/todos/${todo.id}/delete`}
              >
                <button
                  type="submit"
                  className="text-sm px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  삭제
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
