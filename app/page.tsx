"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function HomePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="text-center mt-10">로딩 중...</div>;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-white text-gray-800 px-6">
      <h1 className="text-5xl font-bold mb-4 text-blue-700">환영합니다 👋</h1>
      <p className="text-lg text-gray-600 mb-8">
        이 사이트는 Next.js와 NextAuth를 사용한 인증 예제입니다.
      </p>
      {status === "authenticated" && (
        <p className="text-sm text-gray-500">
          로그인된 사용자: {session.user.email}
        </p>
      )}
    </main>
  );
}
