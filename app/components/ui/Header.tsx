"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const { data: session, status } = useSession();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !(dropdownRef.current as HTMLElement).contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="w-full px-6 py-6 bg-white border-b shadow-sm flex items-center justify-between">
      <Link href="/" className="text-x1 font-bold text-blue-600">
        MySite
      </Link>

      <nav className="flex items-center space-x-4">
        {status === "loading" ? null : status === "authenticated" ? (
          <>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen(!open)}
                className="text-gray-700 hover:underline"
              >
                {session.user.email}
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-50">
                  <button
                    onClick={() => {
                      router.push("/todos");
                      setOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    ✏️ 내 투두
                  </button>
                  <button
                    onClick={() => {
                      router.push("/mypage");
                      setOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    👤 마이페이지
                  </button>
                  {(session.user.role === "admin" ||
                    session.user.role === "root") && (
                    <button
                      onClick={() => {
                        router.push("/admin");
                        setOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      👑 관리자 페이지
                    </button>
                  )}
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                  >
                    🔓 로그아웃
                  </button>
                </div>
              )}
            </div>
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
