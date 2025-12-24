import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Audio Player",
  description: "Language learning audio player",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
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
