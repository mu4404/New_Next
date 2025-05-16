import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function MyPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="mex-w-x1 mx-auto mt-16 text-center">
      <h1 className="text-3x1 font-bold mb-4">마이페이지 👤</h1>
      <p className="text-gray-700">안녕하세요, {session.user.email}님!</p>
    </div>
  );
}
