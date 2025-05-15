// app/layout.tsx
"use client";

import "./globals.css";
import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
