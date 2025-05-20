import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  // 로그인 안 된 경우
  if (!session?.user) {
    redirect("/login");
  }

  // root 권한이 아닌 경우
  if (session.user.role !== "root") {
    redirect("/");
  }

  // 전체 유저 목록 불러오기
  const users = await prisma.user.findMany({
    orderBy: { email: "asc" },
  });

  return (
    <main className="max-w-2xl mx-auto mt-16 p-6">
      <h1 className="text-2xl font-bold mb-6">👑 관리자 페이지</h1>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="border p-2">이름</th>
            <th className="border p-2">이메일</th>
            <th className="border p-2">권한</th>
            <th className="border p-2">관리</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="text-center">
              <td className="border p-2">-</td>
              <td className="border p-2">
                <a
                  href={`/admin/user/${user.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {user.email}
                </a>
              </td>
              <td className="border p-2">{user.role}</td>
              <td className="border p-2">
                {user.role !== "root" && (
                  <form
                    method="POST"
                    action={`/api/user/${user.id}/toggle-role`}
                  >
                    <button
                      type="submit"
                      className="text-sm px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      {user.role === "admin" ? "관리자 해제" : "관리자 부여"}
                    </button>
                  </form>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
