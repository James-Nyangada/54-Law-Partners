import type { ReactNode } from "react";
import type { Locale } from "@/i18n/types";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Photo } from "@/components/ui/Photo";

/**
 * The head of every inner page: breadcrumb, eyebrow, title, introduction and,
 * where the design has one, an image to the right. Dark by default; the
 * Insights pages sit on bone.
 */
export function PageHeader({
  locale,
  trail,
  eyebrow,
  title,
  intro,
  image,
  aside,
  surface = "dark",
  children,
}: {
  locale: Locale;
  trail: { label: string; href?: string }[];
  eyebrow?: ReactNode;
  title: ReactNode;
  intro?: ReactNode;
  image?: { src: string; alt: string; position?: string };
  aside?: ReactNode;
  surface?: "dark" | "light";
  children?: ReactNode;
}) {
  const light = surface === "light";
  return (
    <section
      className={`${light ? "surface-light bg-bone text-onyx" : "surface-dark bg-onyx text-bone"} border-b ${light ? "border-line-light" : "border-line-dark"} pt-[calc(var(--header-h)+clamp(40px,6vw,88px))] pb-[clamp(48px,6vw,88px)]`}
    >
      <div className="shell grid gap-y-12 lg:grid-cols-12 lg:items-end lg:gap-x-6">
        <div className={image || aside ? "lg:col-span-8" : "lg:col-span-10"}>
          <Breadcrumbs locale={locale} trail={trail} />
          {eyebrow ? <div className="eyebrow mt-8 text-[var(--accent)]" data-reveal="fade">{eyebrow}</div> : null}
          <h1 className={`type-display ${eyebrow ? "mt-5" : "mt-8"} max-w-[22ch]`} data-reveal="lines">
            {title}
          </h1>
          {intro ? (
            <div className="type-lead mt-7 max-w-[56ch] text-[var(--muted-text)]" data-reveal="up" data-delay="0.15">
              {intro}
            </div>
          ) : null}
          {children}
        </div>
        {image ? (
          <div className="lg:col-span-4">
            <Photo
              src={image.src}
              alt={image.alt}
              position={image.position}
              sizes="(min-width: 1024px) 30vw, 100vw"
              priority
              className="aspect-[4/3] border border-line-raised lg:aspect-[4/4.2]"
            />
          </div>
        ) : null}
        {aside ? <div className="lg:col-span-4 lg:justify-self-end" data-reveal="up">{aside}</div> : null}
      </div>
    </section>
  );
}
