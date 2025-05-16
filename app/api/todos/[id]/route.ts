import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const todo = await prisma.todo.findUnique({
    where: { id: params.id },
  });

  if (!todo || todo.userId !== session.user.id) {
    return NextResponse.json(
      { error: "Not found or forbidden" },
      { status: 403 }
    );
  }

  await prisma.todo.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ status: true });
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { text } = await req.json();

  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const todo = await prisma.todo.findUnique({
    where: { id: params.id },
  });

  if (!todo || todo.userId !== session.user.id) {
    return NextResponse.json(
      { error: "Not found or forbidden" },
      { status: 403 }
    );
  }

  const updated = await prisma.todo.update({
    where: { id: params.id },
    data: { text },
  });

  return NextResponse.json(updated);
}
