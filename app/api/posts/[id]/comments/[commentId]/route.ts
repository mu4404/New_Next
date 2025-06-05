import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// 댓글 수정
export async function PUT(
  request: Request,
  { params }: { params: { id: string; commentId: string } }
) {
  try {
    const { id, commentId } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const { content } = await request.json();
    if (!content?.trim()) {
      return NextResponse.json(
        { error: "댓글 내용을 입력해주세요." },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { user: true },
    });

    if (!comment) {
      return NextResponse.json(
        { error: "댓글을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    if (comment.user.email !== session.user.email) {
      return NextResponse.json(
        { error: "자신의 댓글만 수정할 수 있습니다." },
        { status: 403 }
      );
    }

    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: { content },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    return NextResponse.json(updatedComment);
  } catch (error) {
    console.error("Error updating comment:", error);
    return NextResponse.json(
      { error: "댓글 수정에 실패했습니다." },
      { status: 500 }
    );
  }
}

// 댓글 삭제
export async function DELETE(
  request: Request,
  { params }: { params: { id: string; commentId: string } }
) {
  try {
    const { id, commentId } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { user: true },
    });

    if (!comment) {
      return NextResponse.json(
        { error: "댓글을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    if (comment.user.email !== session.user.email) {
      return NextResponse.json(
        { error: "자신의 댓글만 삭제할 수 있습니다." },
        { status: 403 }
      );
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    return NextResponse.json({ message: "댓글이 삭제되었습니다." });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { error: "댓글 삭제에 실패했습니다." },
      { status: 500 }
    );
  }
}
