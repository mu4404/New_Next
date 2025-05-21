"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-blue-100 text-gray-800 p-6">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
        📝 My Todo App
      </h1>
      <p className="text-base md:text-lg text-gray-600 mb-8 text-center md:max-w-xl">
        당신의 할 일을 효과적으로 정리하고 관리해보세요. 로그인하면 개인 투두
        리스트를 관리할 수 있어요!
      </p>

      {status === "loading" ? (
        <p>로딩 중...</p>
      ) : session?.user ? (
        <div className="flex flex-col md:flex-row gap-4">
          <button
            onClick={() => router.push("/todos")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full md:w-auto"
          >
            ✏️ 투두 보러가기
          </button>
          <button
            onClick={() => router.push("/mypage")}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 w-full md:w-auto"
          >
            👤 마이페이지
          </button>
        </div>
      ) : (
        <p className="text-sm text-gray-500">
          (오른쪽 위에서 로그인 또는 회원가입 해주세요)
        </p>
      )}
    </main>
  );
}
