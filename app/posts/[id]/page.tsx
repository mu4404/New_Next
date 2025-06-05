import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
  });

  if (!post) return notFound();

  return (
    <div className="max-w-2x1 mx-auto mt-12">
      <h1 className="text-3x1 font-bold mb-4">{post.title}</h1>
      <p className="text-gray-600 text-sm mb-6">{formatDate(post.createdAt)}</p>
      <div className="text-lg leading-relaxed whitespace-pre-wrap">
        {post.content}
      </div>
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
