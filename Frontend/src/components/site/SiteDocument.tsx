import type { ReactNode } from "react";
import { Inter, Source_Serif_4 } from "next/font/google";
import type { Locale } from "@/i18n/types";
import { LocaleProvider } from "@/i18n/useLocale";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Curtain } from "@/components/motion/Curtain";
import { RouteMotion } from "@/components/motion/RouteMotion";
import { Cursor } from "@/components/motion/Cursor";
import { SiteHeader } from "./SiteHeader";
import { Footer } from "./Footer";

const serif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const sans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

/*
 * Runs before first paint: marks that scripts are running (so entrances can
 * start hidden), and honours reduced motion before anything moves.
 */
const BOOT = `(function(){var d=document.documentElement;d.classList.add('js');try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('motion-static')}catch(e){}})();`;

/** The document shared by both root layouts: English at /, French at /fr. */
export function SiteDocument({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <html lang={locale} suppressHydrationWarning className={`${serif.variable} ${sans.variable}`}>
      {/* App Router root layout: a plain <head> is the documented pattern here. */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
        <noscript>
          <style>{`[data-reveal],[data-hero],[data-header-item]{visibility:visible!important}[data-curtain]{display:none!important}`}</style>
        </noscript>
      </head>
      <body className="surface-dark min-h-screen bg-onyx text-bone" suppressHydrationWarning>
        <LocaleProvider locale={locale}>
          <SmoothScroll />
          <SiteHeader />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
          <RouteMotion />
          <Cursor />
          <Curtain />
        </LocaleProvider>
      </body>
    </html>
  );
}
