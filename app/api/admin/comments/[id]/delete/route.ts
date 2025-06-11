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
    const comment = await prisma.comment.findUnique({
      where: { id: params.id },
    });

    if (!comment) {
      return new NextResponse("Comment not found", { status: 404 });
    }

    await prisma.comment.delete({
      where: { id: params.id },
    });

    console.log("Deleted comment:", comment);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
