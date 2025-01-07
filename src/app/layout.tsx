import type { Metadata } from "next";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";

import { inter } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { ConvexClientProvider } from "@/providers/convex-client-provider";

export const metadata: Metadata = {
  title: "TDA Project Planner",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en">
        <body className={cn(inter.className, "antialiased")}>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
