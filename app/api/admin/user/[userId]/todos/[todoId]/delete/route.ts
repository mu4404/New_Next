import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(
  req: Request,
  { params }: { params: { userId: string; todoId: string } }
) {
  const session = await getServerSession(authOptions);

  // 인증 확인
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 관리자 확인
  if (session.user.role !== "admin" && session.user.role !== "root") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // 삭제할 투두 찾기
  const todo = await prisma.todo.findUnique({
    where: { id: params.todoId },
  });

  if (!todo || todo.userId !== params.userId) {
    return NextResponse.json(
      { error: "Todo not found or mismatched user" },
      { status: 404 }
    );
  }

  await prisma.todo.delete({
    where: { id: params.todoId },
  });

  return NextResponse.redirect(
    new URL(`/admin/user/${params.userId}`, req.url)
  );
}
