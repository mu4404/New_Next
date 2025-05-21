import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { title, content } = await req.json();

  if (!title || !content) {
    return NextResponse.json(
      { message: "제목과 내용을 입력해 주세요." },
      { status: 400 }
    );
  }

  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        userId: session.user.id,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (err) {
    console.log("게시글 생성 오류", err);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}
