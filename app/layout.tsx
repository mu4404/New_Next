// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import Navbar from "./components/Navbar";
import Providers from "./components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Next.js Blog",
    default: "Next.js Blog",
  },
  description: "A modern blog built with Next.js",
  keywords: ["Next.js", "React", "Blog", "Web Development"],
  authors: [{ name: "Your Name" }],
  openGraph: {
    title: "Next.js Blog",
    description: "A modern blog built with Next.js",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Next.js Blog",
    description: "A modern blog built with Next.js",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="ko">
      <body className={inter.className}>
        <Providers session={session}>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
