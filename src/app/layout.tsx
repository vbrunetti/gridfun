import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { site } from "@/content/site";
import { ChromeProvider } from "@/components/chrome/chrome-provider";
import { SiteShell } from "@/components/chrome/site-shell";
import { CaseStudiesScrollProvider } from "@/components/case-studies/case-studies-scroll-context";
import { CaseStudyDetailScrollProvider } from "@/components/case-studies/case-study-detail-scroll-context";
import { HeroScrubProvider } from "@/components/sections/primary-hero/hero-scrub-context";
import { FigmaCaptureDev } from "@/components/dev/figma-capture-dev";
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
    default: site.meta.title,
    template: site.meta.titleTemplate,
  },
  description: site.meta.description,
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
        {process.env.NODE_ENV === "development" ? (
          <>
            <Script
              id="figma-html-to-design-capture"
              src="https://mcp.figma.com/mcp/html-to-design/capture.js"
              strategy="afterInteractive"
            />
            <FigmaCaptureDev />
          </>
        ) : null}
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
