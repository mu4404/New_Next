import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import ClientTodosByUser from "./TodoByUserClient";

const prisma = new PrismaClient();

export default async function UserTodoPage() {
  const session = await getServerSession(authOptions);

  // 로그인 확인
  if (!session) {
    return <p className="p-6">로그인 후 이용해 주세요.</p>;
  }

  // 모든 유저 + 유저별 TODO 불러오기
  const users = await prisma.user.findMany({
    where: {
      id: {
        not: session.user.id, // 본인은 목록에서 제외
      },
    },
    select: {
      id: true,
      email: true,
      todos: true,
    },
  });

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">✅ 유저별 TODO 목록</h1>
      <ClientTodosByUser users={users} />
    </main>
  );
}
