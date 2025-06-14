"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("이메일과 비밀번호를 입력하세요.");
      return;
    }
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (res?.ok) {
      router.push("/");
    } else {
      alert("로그인 실패: 이메일 또는 비밀번호를 확인하세요");
    }
  };
  return (
    <div className="max-w-md mx-auto mt-20">
      <h2 className="text-2x1 font-bold mb-6 text-center">로그인</h2>
      <input
        type="email"
        placeholder="이메일"
        className="w-full p-2 mb-3 border rounded"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="비밀번호"
        className="w-full p-2 mb-3 border rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        onClick={handleLogin}
      >
        로그인
      </button>
    </div>
  );
}
