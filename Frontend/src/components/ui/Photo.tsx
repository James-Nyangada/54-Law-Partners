import Image from "next/image";

/**
 * A photograph graded into the palette: the image is desaturated slightly and
 * a forest-to-onyx wash sits over it, so photographs from different sources
 * read as one set. `tone` sets how dark the grade runs.
 */
export function Photo({
  src,
  alt,
  sizes,
  priority,
  tone = "dark",
  position = "50% 50%",
  className = "",
  reveal = true,
  parallax,
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  tone?: "dark" | "deep" | "light" | "none";
  position?: string;
  className?: string;
  /** Opens with the frame-reveal on scroll. */
  reveal?: boolean;
  /** Drift, in percent of the image's height, while crossing the viewport. */
  parallax?: number;
}) {
  const wash =
    tone === "deep"
      ? "bg-[linear-gradient(180deg,rgb(11_14_12/0.55),rgb(11_14_12/0.82)),linear-gradient(135deg,rgb(15_59_42/0.55),transparent_70%)]"
      : tone === "dark"
        ? "bg-[linear-gradient(180deg,rgb(11_14_12/0.18),rgb(11_14_12/0.62)),linear-gradient(135deg,rgb(15_59_42/0.5),transparent_70%)]"
        : tone === "light"
          ? "bg-[linear-gradient(180deg,transparent,rgb(11_14_12/0.25)),linear-gradient(135deg,rgb(15_59_42/0.28),transparent_70%)]"
          : "";

  return (
    <div
      className={`relative overflow-hidden bg-forest-deep ${className}`}
      data-reveal={reveal ? "image" : undefined}
    >
      <div className={parallax ? "absolute inset-x-0 -inset-y-[12%]" : "absolute inset-0"} data-parallax={parallax}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover saturate-[0.72]"
          style={{ objectPosition: position }}
        />
      </div>
      {wash ? <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${wash}`} /> : null}
    </div>
  );
}
