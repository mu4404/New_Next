import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  const isAdmin =
    session?.user?.role === "admin" || session?.user?.role === "root";

  if (!session || !isAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const comments = await prisma.comment.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: {
            email: true,
          },
        },
        post: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
    console.log("Fetched comments:", comments);
    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
