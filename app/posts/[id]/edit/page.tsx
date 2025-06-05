import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function EditPostPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const post = await prisma.post.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!post || post.user.email != session?.user?.email) return notFound();

    return (
      <form
        action={`/api/posts/${post.id}/edit`}
        method="POST"
        className="max-w-2x1 mx-auto mt-12 space-y-4"
      >
        <input
          type="text"
          name="title"
          defaultValue={post.title}
          className="w-full border border-gray-300 rounded px-4 py-2"
          required
        />
        <textarea
          name="content"
          defaultValue={post.content || ""}
          className="w-full border border-gray-300 rounded px-4 py-2 h-48"
          required
        />
        <div className="flex justify-end gap-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            저장
          </button>
        </div>
      </form>
    );
  } catch (error) {
    console.error("게시글 수정 페이지 로드 중 오류 발생:", error);
    return (
      <div className="max-w-2x1 mx-auto mt-12 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">오류가 발생했습니다</h1>
        <p className="text-gray-600 mb-4">게시글 수정 페이지를 불러오는 중 문제가 발생했습니다.</p>
        <a href="/posts" className="text-blue-600 hover:underline">
          게시글 목록으로 돌아가기
        </a>
      </div>
    );
  }
}
