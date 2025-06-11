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
    console.log("Fetching all posts...");
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });
    console.log("Fetched posts:", posts);
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch posts" }),
      { status: 500 }
    );
  }
}
