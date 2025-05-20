import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  // 인증되지 않은 사용자
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 루트가 아닌 사용자 접근 제한
  if (session.user.role !== "root") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const userId = params.id;

  // 대상 유저 찾기
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // 이미 root인 유저는 변경 못함
  if (user.role === "root") {
    return NextResponse.json(
      { error: "Cannot Change root role" },
      { status: 400 }
    );
  }

  const newRole = user.role === "admin" ? "user" : "admin";

  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
  });
  return NextResponse.redirect(new URL("/admin", req.url));
}
