import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const isAdmin =
    session?.user?.role === "admin" || session?.user?.role === "root";

  if (!session || !isAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id: params.id },
    });

    if (!post) {
      return new NextResponse("Post not found", { status: 404 });
    }

    await prisma.post.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting post:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
