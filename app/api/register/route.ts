import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "이메일과 비밀번호가 필요합니다." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return NextResponse.json(
        { message: "이미 존재하는 이메일입니다." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "user",
      },
    });
    return NextResponse.json({ message: "회원가입 성공!" }, { status: 201 });
  } catch (error) {
    console.log("❌ 회원가입 에러:", error);
    return NextResponse.json({ message: "서버 에러" }, { status: 500 });
  }
}
