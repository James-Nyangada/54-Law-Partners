"use client";

import { useEffect, useRef } from "react";
import {
  ensureGsap,
  ScrollTrigger,
  EASE,
  DURATION,
  STAGGER,
  prefersReducedMotion,
} from "@/lib/motion";
import { useIntro } from "../intro/IntroProvider";
import { Magnetic } from "./Magnetic";
import { useLocale } from "@/i18n/useLocale";

/**
 * Swap this for a photograph once art direction lands: a Nairobi skyline at
 * dusk or a serious boardroom interior, heavily darkened, portrait format.
 */
const HERO_IMAGE = "/hero-nairobi-dusk.svg";

export function Hero() {
  const { phase, reportHeroImageReady } = useIntro();
  const { t } = useLocale();
  const glowRef = useRef<HTMLDivElement>(null);

  const rootRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const ruleRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const supportRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const dimRef = useRef<HTMLDivElement>(null);

  const playedRef = useRef(false);
  const timelinesRef = useRef<gsap.core.Timeline[]>([]);

  // A cached image can finish before React attaches its load handler.
  useEffect(() => {
    const image = imageRef.current;
    if (image?.complete) reportHeroImageReady();
  }, [reportHeroImageReady]);

  // Steps 3 to 7 — the hero entrance, played once as the curtain slides off.
  useEffect(() => {
    if (prefersReducedMotion() || phase !== "revealing" || playedRef.current) return;

    const gsap = ensureGsap();
    const headline = headlineRef.current;
    if (!headline) return;

    playedRef.current = true;
    const lines = headline.querySelectorAll<HTMLSpanElement>(".line-mask > span");

    // Starting state. Set inline so it overrides the stylesheet's hidden rule.
    gsap.set(headline, { autoAlpha: 1 });
    gsap.set(lines, { yPercent: 110 });
    gsap.set([eyebrowRef.current, supportRef.current, actionsRef.current, cueRef.current], {
      autoAlpha: 0,
      y: 24,
    });
    gsap.set(ruleRef.current, { autoAlpha: 1, scaleX: 0, transformOrigin: "left center" });
    gsap.set(frameRef.current, { autoAlpha: 1, clipPath: "inset(100% 0% 0% 0%)" });
    gsap.set(imageRef.current, { scale: 1.2 });

    // Offsets are measured from the moment the curtain begins to travel, so the
    // whole opening sequence lands at roughly 3.2 seconds.
    const tl = gsap.timeline({ delay: 0.5, defaults: { ease: EASE } });

    // 3 — the eyebrow fades in as a 1px emerald rule draws itself left to right.
    tl.to(eyebrowRef.current, { autoAlpha: 1, y: 0, duration: DURATION.entrance }, 0);
    tl.to(ruleRef.current, { scaleX: 1, duration: 1 }, 0.05);

    // 4 — the three headline lines rise from behind their masks, 120ms apart.
    tl.to(lines, { yPercent: 0, duration: 1, stagger: STAGGER.headline }, 0.18);

    // 5 — the frame opens from the bottom edge upward while the photograph
    //     settles from 1.2 scale to 1.
    tl.to(frameRef.current, { clipPath: "inset(0% 0% 0% 0%)", duration: DURATION.reveal }, 0.22);
    tl.to(imageRef.current, { scale: 1, duration: DURATION.reveal }, 0.22);

    // 6 — the supporting line and the buttons fade up together.
    tl.to(
      [supportRef.current, actionsRef.current],
      { autoAlpha: 1, y: 0, duration: DURATION.entrance, stagger: STAGGER.group },
      0.65,
    );

    // 7 — the scroll cue arrives last.
    tl.to(cueRef.current, { autoAlpha: 1, y: 0, duration: 0.5 }, 1.1);

    timelinesRef.current.push(tl);

    // The dot travels down the cue line on a loop.
    const dot = dotRef.current;
    if (dot) {
      const loop = gsap.timeline({ repeat: -1, delay: 1.6 });
      loop
        .fromTo(dot, { y: 0, opacity: 0 }, { opacity: 1, duration: 0.3, ease: "none" })
        .to(dot, { y: 72, duration: 1.5, ease: "power1.inOut" }, 0)
        .to(dot, { opacity: 0, duration: 0.35, ease: "none" }, 1.15)
        .to({}, { duration: 0.4 });
      timelinesRef.current.push(loop);
    }
  }, [phase]);

  // The glow eases toward the cursor, up to 48px each way, over 1.4s.
  useEffect(() => {
    const glow = glowRef.current;
    if (!glow || prefersReducedMotion()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const gsap = ensureGsap();
    const xTo = gsap.quickTo(glow, "x", { duration: 1.4, ease: EASE });
    const yTo = gsap.quickTo(glow, "y", { duration: 1.4, ease: EASE });
    const onMove = (event: PointerEvent) => {
      xTo((event.clientX / window.innerWidth - 0.5) * 96);
      yTo((event.clientY / window.innerHeight - 0.5) * 96);
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      gsap.killTweensOf(glow);
    };
  }, []);

  // On scroll — parallax separation and the dim toward black.
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const gsap = ensureGsap();
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      // The headline drifts upward at 60% of scroll speed, so relative to the
      // page it lags by 40% of the distance travelled.
      gsap.to(contentRef.current, {
        y: () => window.innerHeight * 0.4,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      // The image travels at 115%, so it runs 15% ahead of the page.
      gsap.to(frameRef.current, {
        y: () => -window.innerHeight * 0.15,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      // The whole hero dims toward black over the first 600px.
      gsap.to(dimRef.current, {
        opacity: 0.88,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "+=600",
          scrub: true,
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  // Once the opening sequence is over the layout is final; re-measure triggers.
  useEffect(() => {
    if (phase !== "done") return;
    ScrollTrigger.refresh();
  }, [phase]);

  useEffect(() => {
    const timelines = timelinesRef.current;
    return () => {
      timelines.forEach((tl) => tl.kill());
    };
  }, []);

  return (
    <section
      id="hero"
      ref={rootRef}
      className="relative h-svh min-h-[620px] w-full overflow-hidden bg-onyx [--hero-pad:clamp(1.5rem,5vw,7rem)]"
    >
      {/*
        A forest radial behind the headline, so the black is never flat. It
        drifts a little after the cursor, slowly, like light across a room.
      */}
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-[-18vmin] top-1/2 h-[150vmin] w-[150vmin] -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgb(15 59 42 / 0.95), rgb(15 59 42 / 0.5) 45%, rgb(15 59 42 / 0) 100%)",
        }}
      />

      {/*
        The image occupies columns 9 to 12 and runs from the top of the viewport
        to the bottom edge with no margin. The frame is 15% taller than the hero
        so the parallax has somewhere to travel.
      */}
      <div
        ref={frameRef}
        data-anim
        className="absolute left-0 right-0 top-0 h-[115%] overflow-hidden lg:left-[calc(66.6667%+var(--hero-pad)/3)]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imageRef}
          src={HERO_IMAGE}
          alt=""
          aria-hidden="true"
          decoding="async"
          fetchPriority="high"
          onLoad={reportHeroImageReady}
          onError={reportHeroImageReady}
          className="h-full w-full origin-center object-cover"
        />
        {/* On narrow screens the copy sits over the photograph, so darken more. */}
        <div className="absolute inset-0 bg-onyx/75 lg:bg-onyx/20" />
      </div>

      {/* Twelve column grid: the headline occupies columns 1 to 7. */}
      <div className="relative z-10 grid h-full grid-cols-12 items-center pl-[var(--hero-pad)] pr-[var(--hero-pad)] lg:pr-0">
        <div ref={contentRef} className="col-span-12 lg:col-span-7">
          <p
            ref={eyebrowRef}
            data-anim
            className="text-[14px] uppercase leading-none tracking-[0.22em] text-mint"
          >
            {t.hero.eyebrow}
          </p>

          <span
            ref={ruleRef}
            data-anim
            className="mt-5 block h-px w-full max-w-[26rem] bg-emerald"
          />

          <h1
            ref={headlineRef}
            data-anim
            className="mt-9 font-serif text-[clamp(1.75rem,4.8vw,7.5rem)] font-normal leading-[0.98] tracking-[-0.02em] text-bone"
          >
            {/* Keyed by position, so switching language keeps the same elements. */}
            {t.hero.headline.map((line, index) => (
              <span key={index} className="line-mask">
                <span className="whitespace-nowrap">{line}</span>
              </span>
            ))}
          </h1>

          <p
            ref={supportRef}
            data-anim
            className="mt-9 max-w-full text-[20px] leading-[1.55] text-sage"
          >
            {t.hero.support}
          </p>

          <div ref={actionsRef} data-anim className="mt-11 flex flex-wrap items-center gap-x-10 gap-y-5">
            <Magnetic>
              <a
                href="#practice-areas"
                className="group inline-block bg-mint px-9 py-4 text-[13px] uppercase tracking-[0.16em] text-onyx transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-bone"
              >
                {t.hero.practice}
              </a>
            </Magnetic>

            <Magnetic strength={0.2}>
              <a
                href="#contact"
                className="group relative inline-block py-4 text-[13px] uppercase tracking-[0.16em] text-bone"
              >
                {t.hero.speak}
                <span className="absolute bottom-3 left-0 h-px w-full origin-left scale-x-0 bg-emerald transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
              </a>
            </Magnetic>
          </div>
        </div>
      </div>

      {/* The scroll cue: a thin vertical line with a dot travelling down it. */}
      <div
        ref={cueRef}
        data-anim
        aria-hidden="true"
        className="absolute bottom-0 left-[var(--hero-pad)] z-10 hidden lg:block"
      >
        <div className="relative h-24 w-px bg-bone/20">
          <span
            ref={dotRef}
            className="absolute left-1/2 top-0 block h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-mint"
          />
        </div>
      </div>

      {/* The dim toward black. */}
      <div
        ref={dimRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 bg-black opacity-0"
      />
    </section>
  );
}
