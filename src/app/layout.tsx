import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "TDA Project Planner",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
