import Link from "next/link";

export default function HomePage() {
  return (
    <main className="max-w-xl mx-auto mt-16 text-center space-y-4">
      <h1 className="text-3xl font-bold">🎉 환영합니다!</h1>

      <div className="space-y-2">
        <Link
          href="/posts"
          className="block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          📰 전체 게시글 보러가기
        </Link>

        <Link
          href="/users/todos"
          className="block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          ✅ 유저별 TODO 보기
        </Link>
      </div>
    </main>
  );
}
