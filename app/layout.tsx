import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ Update metadata
export const metadata: Metadata = {
  title: "Capital Distance Finder",
  description:
    "Capital Distance Finder — calculate and visualize distances between world capitals with SSE, Haversine, and Next.js.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Fallback title for browsers */}
        <title>Capital Distance Finder</title>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
      >
        <div className="min-h-screen flex flex-col">
          {/* Optional simple site header */}
          <header className="border-b bg-white py-4 shadow-sm">
            <div className="mx-auto max-w-6xl px-4">
              <h1 className="text-2xl font-bold text-green-700">
                Capital Distance Finder
              </h1>
            </div>
          </header>

          {/* Main page */}
          <main className="flex-1">{children}</main>

          {/* Footer */}
          <footer className="border-t bg-white py-4 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Capital Distance Finder · Built with Next.js
          </footer>
        </div>
      </body>
    </html>
  );
}
