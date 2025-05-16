"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session, status } = useSession();
  return (
    <header className="w-full px-6 py-6 bg-white border-b shadow-sm flex items-center justify-between">
      <Link href="/" className="text-x1 font-bold text-blue-600">
        MySite
      </Link>

      <nav className="flex items-center space-x-4">
        {status === "loading" ? null : status === "authenticated" ? (
          <>
            <Link href="/mypage" className="text-gray-700 hover:underline">
              {session.user.email}
            </Link>
            <button
              onClick={() => signOut()}
              className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
            >
              로그인
            </Link>
            <Link
              href="/register"
              className="text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
            >
              회원가입
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
