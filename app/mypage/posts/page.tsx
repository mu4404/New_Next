import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { format } from "date-fns";

const prisma = new PrismaClient();

export default async function MyPostsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return <p className="p-6">로그인 후 이용해 주세요.</p>;
  }

  const posts = await prisma.post.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📝 내가 쓴 글</h1>

      {posts.length === 0 ? (
        <p className="text-gray-500">아직 작성한 글이 없습니다.</p>
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
                작성일: {format(new Date(post.createdAt), "yyyy-MM-dd HH:mm")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
