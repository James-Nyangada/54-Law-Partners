import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { Inter, Source_Serif_4 } from "next/font/google";

const serif = Source_Serif_4({ variable: "--font-source-serif", subsets: ["latin"], display: "swap" });
const sans = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Page not found — 54 Law Partners",
};

/**
 * The 404, in both languages, since an unmatched address carries no reliable
 * language. Guides the visitor back rather than dead-ending (site map).
 */
export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body className="surface-dark min-h-screen bg-onyx text-bone">
        <main className="relative flex min-h-screen flex-col overflow-hidden">
          <div aria-hidden="true" className="absolute -left-[15%] top-1/3 h-[90vmin] w-[90vmin] rounded-full bg-[radial-gradient(closest-side,rgb(31_138_95/0.2),transparent)]" />
          <header className="shell flex h-[var(--header-h)] items-center border-b border-line-dark">
            <Link href="/" className="font-serif text-[21px] text-bone">54 Law Partners</Link>
          </header>
          <div className="shell relative flex flex-1 flex-col justify-center py-20">
            <p className="font-serif text-[clamp(120px,22vw,300px)] leading-none tracking-[-0.03em] text-transparent [-webkit-text-stroke:1px_var(--color-emerald)]">
              404
            </p>
            <div className="mt-10 grid gap-12 md:grid-cols-2">
              <div>
                <h1 className="type-section">This page could not be found.</h1>
                <p className="mt-4 text-sage">The link may be mistyped, or the page may have moved.</p>
                <Link href="/" className="mt-8 inline-flex min-h-12 items-center rounded-[2px] bg-mint px-6 text-[14.5px] font-medium text-onyx transition-colors hover:bg-mint-light">
                  Back to the home page
                </Link>
              </div>
              <div lang="fr">
                <h2 className="type-section">Cette page est introuvable.</h2>
                <p className="mt-4 text-sage">Le lien est peut-être mal saisi, ou la page a été déplacée.</p>
                <Link href="/fr" className="mt-8 inline-flex min-h-12 items-center rounded-[2px] border border-line-raised px-6 text-[14.5px] font-medium text-bone transition-colors hover:border-emerald hover:bg-forest">
                  Retour à l’accueil
                </Link>
              </div>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
