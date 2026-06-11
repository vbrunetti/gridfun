import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ChromeProvider } from "@/components/chrome/chrome-provider";
import { SiteShell } from "@/components/chrome/site-shell";
import { CaseStudiesScrollProvider } from "@/components/case-studies/case-studies-scroll-context";
import { CaseStudyDetailScrollProvider } from "@/components/case-studies/case-study-detail-scroll-context";
import { HeroScrubProvider } from "@/components/sections/primary-hero/hero-scrub-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Portfolio",
    template: "%s · Portfolio",
  },
  description: "UX design portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <ChromeProvider>
          <HeroScrubProvider>
            <CaseStudiesScrollProvider>
              <CaseStudyDetailScrollProvider>
                <SiteShell>{children}</SiteShell>
              </CaseStudyDetailScrollProvider>
            </CaseStudiesScrollProvider>
          </HeroScrubProvider>
        </ChromeProvider>
      </body>
    </html>
  );
}
