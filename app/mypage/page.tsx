import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function MyPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    return <p className="p-6">로그인 후 이용해 주세요.</p>;
  }

  const posts = await prisma.post.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-10">
      {/* 사용자 정보 */}
      <section>
        <h1 className="text-2xl font-bold mb-2">👤 내 정보</h1>
        <p>이메일: {user.email}</p>
        <p>역할: {user.role}</p>
      </section>

      {/* 내가 쓴 게시글 미리보기 */}
      <section>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">📝 최근 작성한 게시글</h2>
          <Link
            href="/mypage/posts"
            className="text-sm text-blue-600 hover:underline"
          >
            전체 보기 →
          </Link>
        </div>

        {posts.length === 0 ? (
          <p className="text-gray-500">작성한 게시글이 없습니다.</p>
        ) : (
          <ul className="space-y-2">
            {posts.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/posts/${post.id}`}
                  className="text-blue-700 hover:underline"
                >
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
