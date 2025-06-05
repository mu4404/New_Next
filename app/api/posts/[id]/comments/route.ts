import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// 댓글 작성 API
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { content } = await request.json();
    if (!content) {
      return new NextResponse("Content is required", { status: 400 });
    }

    const { id } = await params;

    // 게시글 존재 여부 확인
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return new NextResponse("Post not found", { status: 404 });
    }

    // 세션에서 사용자 ID 확인
    if (!session.user.id) {
      return new NextResponse("User ID not found in session", { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        postId: id,
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            email: true as const,
          },
        },
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error("[COMMENTS_POST] Error:", error);
    return new NextResponse(
      JSON.stringify({
        error: "Failed to create comment",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500 }
    );
  }
}

// 댓글 목록 조회 API
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    // 게시글 존재 여부 확인
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return new NextResponse("Post not found", { status: 404 });
    }

    const comments = await prisma.comment.findMany({
      where: {
        postId: id,
      },
      include: {
        user: {
          select: {
            email: true as const,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("[COMMENTS_GET] Error:", error);
    return new NextResponse(
      JSON.stringify({
        error: "Failed to fetch comments",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500 }
    );
  }
}
