import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Audio Player",
  description: "Language learning audio player",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
