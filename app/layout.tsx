import { Geist_Mono, JetBrains_Mono } from "next/font/google";

import { ClerkProvider } from "@clerk/nextjs";

import { Footer } from "@/components/web/Footer";
import { Navigation } from "@/components/web/Navigation";
import { cn } from "@/lib/utils";
import ConvexClientProvider from "@/components/convex/ConvexClientProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

import "./globals.css";

const geistMonoHeading = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-heading",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        "font-mono",
        jetbrainsMono.variable,
        geistMonoHeading.variable,
      )}
      suppressHydrationWarning
    >
      <body className="min-h-full">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProvider>
            <ConvexClientProvider>
              <Navigation />
              {children}
              <Footer />
            </ConvexClientProvider>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
