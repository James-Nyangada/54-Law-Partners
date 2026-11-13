import Image from "next/image";
import type { Person } from "@/content/people";

/**
 * A lawyer's portrait. Until the firm supplies photography, a plate stands in:
 * a forest field with a fine engraved line pattern. It is deliberately quiet,
 * so it reads as a frame awaiting a photograph rather than an illustration.
 *
 * Portraits are greyscale at rest and take their colour on hover (wireframe),
 * except on touch screens, where they are always in colour.
 */
export function Portrait({
  person,
  sizes,
  className = "",
  priority,
}: {
  person: Person;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden bg-forest-deep ${className}`}>
      {person.portrait ? (
        <Image
          src={person.portrait}
          alt={person.name}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover grayscale transition-[filter,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] group-hover:grayscale-0 compact:grayscale-0"
        />
      ) : (
        <Plate seed={person.id} />
      )}
    </div>
  );
}

function Plate({ seed }: { seed: string }) {
  const shift = [...seed].reduce((sum, char) => sum + char.charCodeAt(0), 0) % 40;
  return (
    <div aria-hidden="true" className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]">
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_70%_15%,#1d4a37_0%,#0f3b2a_38%,#0b0e0c_100%)]" />
      <svg className="absolute inset-0 h-full w-full opacity-[0.22]" viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice">
        {Array.from({ length: 22 }, (_, i) => (
          <path
            key={i}
            d={`M-20 ${60 + i * 22} C 120 ${30 + i * 22 + shift}, 260 ${100 + i * 22 - shift}, 420 ${50 + i * 22}`}
            fill="none"
            stroke="#6fcfa0"
            strokeWidth="0.6"
          />
        ))}
      </svg>
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-onyx/70 to-transparent" />
    </div>
  );
}
