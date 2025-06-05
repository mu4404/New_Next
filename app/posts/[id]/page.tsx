import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function PostPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const post = await prisma.post.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!post) return notFound();

  const isAuthor = session?.user?.email === post.user.email;

  return (
    <div className="max-w-2x1 mx-auto mt-12">
      <h1 className="text-3x1 font-bold mb-4">{post.title}</h1>
      <p className="text-gray-600 text-sm mb-6">{formatDate(post.createdAt)}</p>
      <div className="text-lg leading-relaxed whitespace-pre-wrap">
        {post.content}
      </div>
      {isAuthor && (
        <div className="mt-6 flex gap-4">
          <Link
            href={`/posts/${post.id}/edit`}
            className="text-blue-600 hover:underline"
          >
            수정
          </Link>
          <form action={`/api/posts/${post.id}/delete`} method="POST">
            <button type="submit" className="text-red-600 hover:underline">
              삭제
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}
