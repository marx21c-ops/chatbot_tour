import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Triptory — AI 도슨트",
  description: "AI가 동행하는 국내 지역 문화·역사 여행 가이드",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <body className="h-dvh flex flex-col">{children}</body>
    </html>
  );
}
