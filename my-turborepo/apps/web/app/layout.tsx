import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MindEase",
  description: "Seu assistente de bem-estar cognitivo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
