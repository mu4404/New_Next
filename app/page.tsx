"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function HomePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="text-center mt-10">로딩 중...</div>;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800 p-6">
      <h1 className="text-4xl font-bold mb-6">
        {status === "authenticated"
          ? `환영합니다, ${session.user.email}님! 👋`
          : "Next.js + NextAuth 로그인 예제"}
      </h1>

      <div className="space-x-4">
        {status === "authenticated" ? (
          <button
            onClick={() => signOut()}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded shadow"
          >
            로그아웃
          </button>
        ) : (
          <>
            <Link
              href="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow"
            >
              로그인
            </Link>
            <Link
              href="/register"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded shadow"
            >
              회원가입
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
