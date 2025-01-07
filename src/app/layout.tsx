import type { Metadata } from "next";
import "@/styles/globals.css";
import { ConvexClientProvider } from "@/providers/convex-client-provider";
import { cn } from "@/lib/utils";
import { inter } from "@/lib/fonts";

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
      <body className={cn(inter.className, "antialiased")}>
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
