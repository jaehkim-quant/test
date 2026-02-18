import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LocaleProvider } from "@/components/LocaleProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 절대 URL이어야 카카오톡 등에서 OG 이미지를 제대로 가져옵니다.
const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ??
  (process.env.VERCEL_URL != null ? `https://${process.env.VERCEL_URL}` : undefined);

export const metadata: Metadata = {
  metadataBase: baseUrl ? new URL(baseUrl) : undefined,
  title: "Link-in-Bio",
  description: "Share your links in one place",
  icons: {
    icon: "/icon.png",
  },
  openGraph: {
    title: "JaehKim Link-in-Bio",
    description: "Share your links in one place",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "JaehKim Link-in-Bio",
    description: "Share your links in one place",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var k='linkbio-theme';var v=localStorage.getItem(k);var d=document.documentElement;if(v==='dark'||v==='light'){d.setAttribute('data-theme',v);}else{d.setAttribute('data-theme',window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');}})();`,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <LocaleProvider>{children}</LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
