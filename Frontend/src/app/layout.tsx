import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { IntroProvider } from "@/components/intro/IntroProvider";
import { Preloader } from "@/components/intro/Preloader";
import { SmoothScroll } from "@/components/SmoothScroll";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Footer } from "@/components/site/Footer";

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "54 Law Partners — Commercially grounded counsel",
  description:
    "A Nairobi firm advising on transactions, disputes and regulation across East and Central Africa.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sourceSerif.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        {/* Without JavaScript nothing would ever be un-hidden. */}
        <noscript>
          <style>{`[data-anim]{visibility:visible!important}.preloader{display:none!important}[data-scene]{height:auto!important}[data-scene-sticky]{position:relative!important;height:auto!important}[data-panel]{grid-row-start:auto!important}`}</style>
        </noscript>
      </head>
      {/* Browser extensions add attributes to <html> and <body> before React
          loads; suppressHydrationWarning ignores those, and only those. */}
      <body className="min-h-full bg-ink text-ivory" suppressHydrationWarning>
        <IntroProvider>
          <SmoothScroll>
            <Preloader />
            <SiteHeader />
            <main>{children}</main>
            <Footer />
          </SmoothScroll>
        </IntroProvider>
      </body>
    </html>
  );
}
