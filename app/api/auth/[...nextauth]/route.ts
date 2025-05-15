import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "이메일", type: "email" },
        password: { label: "비밀번호", type: "password" },
      },
      async authorize(credentials) {
        console.log("🧪 authorize 실행됨", credentials);

        if (!credentials?.email || !credentials.password) {
          console.log("⚠️ 이메일 또는 비밀번호 누락");
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        console.log("🔍 찾은 유저:", user);

        if (!user || !user.password) {
          console.log("❌ 사용자 없음 또는 비밀번호 없음");
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        console.log("🔒 비밀번호 비교 결과:", isValid);

        if (!isValid) {
          return null;
        }

        console.log("✅ 로그인 성공:", user.email);

        return {
          id: user.id,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({
      token,
      user,
    }: {
      token: JWT;
      user?: { id: string; email?: string | null; role?: string };
    }) {
      if (user) {
        token.sub = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
