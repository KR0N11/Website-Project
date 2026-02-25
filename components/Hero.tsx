"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Play, ChevronDown } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const TICKER_ITEMS = [
  "BOOK YOUR PITCH",
  "5-A-SIDE",
  "7-A-SIDE",
  "FULL ARENA",
  "PREMIUM TURF",
  "LED FLOODLIT",
  "BOOK YOUR PITCH",
  "5-A-SIDE",
  "7-A-SIDE",
  "FULL ARENA",
  "PREMIUM TURF",
  "LED FLOODLIT",
];

export default function Hero() {
  const sectionRef  = useRef<HTMLElement>(null);
  const bgRef       = useRef<HTMLDivElement>(null);
  const overlayRef  = useRef<HTMLDivElement>(null);
  const eyebrowRef  = useRef<HTMLDivElement>(null);
  const line1Ref    = useRef<HTMLDivElement>(null);
  const line2Ref    = useRef<HTMLDivElement>(null);
  const subRef      = useRef<HTMLParagraphElement>(null);
  const ctaRef      = useRef<HTMLDivElement>(null);
  const statsRef    = useRef<HTMLDivElement>(null);
  const tickerRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Parallax background ──────────────────────────────────────────────
      gsap.to(bgRef.current, {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      // ── Overlay fade on scroll ────────────────────────────────────────────
      gsap.to(overlayRef.current, {
        opacity: 0.85,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "60% top",
          scrub: true,
        },
      });

      // ── Entry animation timeline ──────────────────────────────────────────
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      tl.from(eyebrowRef.current, { opacity: 0, y: 20, duration: 0.7 })
        .from(line1Ref.current,   { opacity: 0, y: 60, duration: 0.9 }, "-=0.4")
        .from(line2Ref.current,   { opacity: 0, y: 60, duration: 0.9 }, "-=0.7")
        .from(subRef.current,     { opacity: 0, y: 30, duration: 0.7 }, "-=0.5")
        .from(ctaRef.current,     { opacity: 0, y: 30, duration: 0.7 }, "-=0.4")
        .from(statsRef.current,   { opacity: 0, y: 20, duration: 0.6 }, "-=0.3");

      // ── Floating neon orbs ────────────────────────────────────────────────
      gsap.to(".orb-1", {
        y: -30,
        x: 15,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".orb-2", {
        y: 25,
        x: -20,
        duration: 7,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1,
      });
      gsap.to(".orb-3", {
        y: -20,
        x: 10,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 2,
      });

      // ── Ticker ────────────────────────────────────────────────────────────
      gsap.to(tickerRef.current, {
        x: "-50%",
        duration: 30,
        repeat: -1,
        ease: "none",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex flex-col overflow-hidden"
    >
      {/* ── Background image (parallax container) ── */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          ref={bgRef}
          className="absolute inset-[-20%] bg-cover bg-center will-change-transform"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1800&q=90')",
          }}
        />
        {/* Multi-layer overlay */}
        <div
          ref={overlayRef}
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(7,7,14,0.92) 0%, rgba(7,7,14,0.75) 50%, rgba(7,7,14,0.88) 100%)",
          }}
        />
        {/* Neon gradient tint */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 20% 60%, rgba(57,255,20,0.12) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 20%, rgba(0,255,204,0.08) 0%, transparent 50%)",
          }}
        />
        {/* Pitch grid */}
        <div className="absolute inset-0 pitch-grid opacity-60" />
      </div>

      {/* ── Floating orbs ── */}
      <div
        className="orb-1 absolute top-[20%] right-[15%] w-64 h-64 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(57,255,20,0.08) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="orb-2 absolute top-[50%] left-[5%] w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0,255,204,0.06) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="orb-3 absolute bottom-[10%] right-[25%] w-48 h-48 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(57,255,20,0.1) 0%, transparent 70%)",
          filter: "blur(30px)",
        }}
      />

      {/* ── Main content ── */}
      <div className="relative flex-1 flex items-center max-w-7xl mx-auto w-full px-6 lg:px-10 pt-32 pb-24">
        <div className="w-full max-w-5xl">
          {/* Eyebrow */}
          <div
            ref={eyebrowRef}
            className="flex items-center gap-4 mb-8"
          >
            <div className="w-8 h-px bg-[#39ff14]" />
            <span className="section-label">Indoor Soccer Arena — London, UK</span>
          </div>

          {/* Headline */}
          <div className="overflow-hidden mb-2">
            <div
              ref={line1Ref}
              className="text-white leading-[0.9] will-change-transform"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(4rem, 14vw, 11rem)",
              }}
            >
              WHERE
            </div>
          </div>
          <div className="overflow-hidden mb-6">
            <div
              ref={line2Ref}
              className="leading-[0.9] will-change-transform"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(4rem, 14vw, 11rem)",
                background: "linear-gradient(to right, #39ff14, #00ffcc)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              LEGENDS PLAY
            </div>
          </div>

          {/* Subheading */}
          <p
            ref={subRef}
            className="text-[#8888a0] text-lg md:text-xl max-w-lg mb-12 leading-relaxed font-light"
          >
            State-of-the-art indoor pitches, floodlit and fully equipped.
            Book in seconds, play like a pro.
          </p>

          {/* CTAs */}
          <div ref={ctaRef} className="flex flex-wrap items-center gap-4 mb-16">
            <a href="#booking" className="btn-neon text-base">
              Book a Pitch
              <ArrowRight size={18} />
            </a>
            <button className="btn-ghost text-base group">
              <Play size={16} className="group-hover:text-[#07070e] transition-colors" />
              Watch Reel
            </button>
          </div>

          {/* Stats row */}
          <div
            ref={statsRef}
            className="flex flex-wrap gap-10"
          >
            {[
              { value: "3", label: "Premium Pitches" },
              { value: "16", label: "Daily Time Slots" },
              { value: "4.9★", label: "Player Rating" },
            ].map((s) => (
              <div key={s.label}>
                <div
                  className="text-white leading-none mb-1"
                  style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
                >
                  {s.value}
                </div>
                <div className="text-[#5a5a72] text-sm tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Side label */}
        <div
          className="hidden xl:flex absolute right-10 top-1/2 -translate-y-1/2 items-center gap-3"
          style={{ writingMode: "vertical-rl" }}
        >
          <span className="text-[#3d3d55] text-xs tracking-[0.4em] uppercase">Scroll Down</span>
          <div className="w-px h-16 bg-gradient-to-b from-[#39ff14]/50 to-transparent" />
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div className="relative flex justify-center pb-8">
        <a href="#facilities" aria-label="Scroll down">
          <ChevronDown
            size={28}
            className="text-[#39ff14] animate-bounce opacity-70"
          />
        </a>
      </div>

      {/* ── Ticker tape ── */}
      <div className="relative border-t border-white/[0.06] bg-[#0c0c17]/80 backdrop-blur-sm overflow-hidden py-4">
        <div
          ref={tickerRef}
          className="flex whitespace-nowrap will-change-transform"
          style={{ width: "max-content" }}
        >
          {TICKER_ITEMS.map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-6 px-6 text-sm tracking-[0.3em] text-[#3d3d55] uppercase"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {item}
              <span className="text-[#39ff14] text-xs">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
