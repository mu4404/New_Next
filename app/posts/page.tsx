import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { format } from "date-fns";

const prisma = new PrismaClient();

export default async function PostPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📰 게시판</h1>

      <Link
        href="/posts/new"
        className="inline-block mb-4 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        ✏️ 새 글 작성
      </Link>

      {posts.length === 0 ? (
        <p className="text-gray-500">게이슬이 아직 없습니다.</p>
      ) : (
        <ul className="space-y-4">
          {posts.map((post) => (
            <li key={post.id} className="border rounded p-4 shadow-sm">
              <Link
                href={`/posts/${post.id}`}
                className="text-xl font-semibold text-blue-700 hover:underline"
              >
                {post.title}
              </Link>
              <p className="text-sm text-gray-500">
                작성자: {post.user.email} ·{" "}
                {format(new Date(post.createdAt), "yyyy-MM-dd HH:mm")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
