import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function MyPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="max-w-xl mx-auto mt-16 text-center">
      <h1 className="text-3xl font-bold mb-4">마이페이지 👤</h1>
      <p className="text-gray-700">안녕하세요, {session.user.email}님!</p>
      <a
        href="/todos"
        className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        ✏️ 내 투두 보러가기
      </a>
    </div>
  );
}
