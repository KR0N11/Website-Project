"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Play, ChevronDown } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const TICKER_ITEMS = [
  "RÉSERVEZ VOTRE TERRAIN", "5-A-SIDE", "7-A-SIDE", "ARENA PRINCIPAL",
  "GAZON PREMIUM", "MONTRÉAL QC", "RÉSERVEZ VOTRE TERRAIN", "5-A-SIDE",
  "7-A-SIDE", "ARENA PRINCIPAL", "GAZON PREMIUM", "MONTRÉAL QC",
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef      = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const line1Ref   = useRef<HTMLDivElement>(null);
  const line2Ref   = useRef<HTMLDivElement>(null);
  const subRef     = useRef<HTMLParagraphElement>(null);
  const ctaRef     = useRef<HTMLDivElement>(null);
  const statsRef   = useRef<HTMLDivElement>(null);
  const tickerRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(bgRef.current, {
        yPercent: 30, ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 1.2 },
      });
      gsap.to(overlayRef.current, {
        opacity: 0.9,
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "60% top", scrub: true },
      });

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.from(eyebrowRef.current, { opacity: 0, y: 20, duration: 0.7 })
        .from(line1Ref.current,   { opacity: 0, y: 60, duration: 0.9 }, "-=0.4")
        .from(line2Ref.current,   { opacity: 0, y: 60, duration: 0.9 }, "-=0.7")
        .from(subRef.current,     { opacity: 0, y: 30, duration: 0.7 }, "-=0.5")
        .from(ctaRef.current,     { opacity: 0, y: 30, duration: 0.7 }, "-=0.4")
        .from(statsRef.current,   { opacity: 0, y: 20, duration: 0.6 }, "-=0.3");

      gsap.to(".orb-1", { y: -30, x: 15,  duration: 5, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".orb-2", { y: 25,  x: -20, duration: 7, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1 });
      gsap.to(".orb-3", { y: -20, x: 10,  duration: 6, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 2 });

      gsap.to(tickerRef.current, { x: "-50%", duration: 30, repeat: -1, ease: "none" });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="hero" className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div ref={bgRef} className="absolute inset-[-20%] bg-cover bg-center will-change-transform"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1800&q=90')" }} />
        <div ref={overlayRef} className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, rgba(6,8,15,0.95) 0%, rgba(6,8,15,0.78) 50%, rgba(6,8,15,0.92) 100%)" }} />
        <div className="absolute inset-0 opacity-40"
          style={{ background: "radial-gradient(ellipse 70% 55% at 15% 65%, rgba(249,115,22,0.18) 0%, transparent 60%), radial-gradient(ellipse 50% 45% at 80% 15%, rgba(251,191,36,0.10) 0%, transparent 50%)" }} />
        <div className="absolute inset-0 pitch-grid opacity-50" />
      </div>

      {/* Orbs */}
      <div className="orb-1 absolute top-[20%] right-[15%] w-72 h-72 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)", filter: "blur(50px)" }} />
      <div className="orb-2 absolute top-[55%] left-[3%] w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(251,191,36,0.08) 0%, transparent 70%)", filter: "blur(60px)" }} />
      <div className="orb-3 absolute bottom-[12%] right-[22%] w-48 h-48 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(249,115,22,0.14) 0%, transparent 70%)", filter: "blur(35px)" }} />

      {/* Main content */}
      <div className="relative flex-1 flex items-center max-w-7xl mx-auto w-full px-6 lg:px-10 pt-32 pb-24">
        <div className="w-full max-w-5xl">
          {/* Eyebrow */}
          <div ref={eyebrowRef} className="flex items-center gap-4 mb-8">
            <div className="w-8 h-px bg-[#F97316]" />
            <span className="section-label">Terrain de soccer intérieur — Montréal, QC</span>
          </div>

          {/* Headline */}
          <div className="overflow-hidden mb-2">
            <div ref={line1Ref} className="text-white leading-[0.9] will-change-transform"
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(4rem, 14vw, 11rem)" }}>
              LÀ OÙ LES
            </div>
          </div>
          <div className="overflow-hidden mb-6">
            <div ref={line2Ref} className="leading-[0.9] will-change-transform"
              style={{
                fontFamily: "var(--font-display)", fontSize: "clamp(4rem, 14vw, 11rem)",
                background: "linear-gradient(to right, #F97316, #FBBF24)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>
              LÉGENDES JOUENT
            </div>
          </div>

          <p ref={subRef} className="text-[#90a8d8] text-lg md:text-xl max-w-lg mb-12 leading-relaxed font-light">
            La meilleure installation de soccer intérieur à Montréal. Gazon premium,
            éclairage cinématique, réservation instantanée en CAD — votre jeu au niveau supérieur.
          </p>

          <div ref={ctaRef} className="flex flex-wrap items-center gap-4 mb-16">
            <a href="#booking" className="btn-neon text-base">
              Réserver un terrain <ArrowRight size={18} />
            </a>
            <button className="btn-ghost text-base group">
              <Play size={16} />Voir la vidéo
            </button>
          </div>

          <div ref={statsRef} className="flex flex-wrap gap-10">
            {[
              { value: "3",    label: "Terrains premium" },
              { value: "16",   label: "Créneaux par jour" },
              { value: "4.9★", label: "Note des joueurs" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-white leading-none mb-1"
                  style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
                  {s.value}
                </div>
                <div className="text-[#3d5a90] text-sm tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden xl:flex absolute right-10 top-1/2 -translate-y-1/2 items-center gap-3"
          style={{ writingMode: "vertical-rl" }}>
          <span className="text-[#2a3f6a] text-xs tracking-[0.4em] uppercase">Défiler</span>
          <div className="w-px h-16 bg-gradient-to-b from-[#F97316]/50 to-transparent" />
        </div>
      </div>

      <div className="relative flex justify-center pb-8">
        <a href="#facilities" aria-label="Défiler vers le bas">
          <ChevronDown size={28} className="text-[#F97316] animate-bounce opacity-70" />
        </a>
      </div>

      {/* Ticker */}
      <div className="relative border-t border-white/[0.05] bg-[#080f1c]/80 backdrop-blur-sm overflow-hidden py-4">
        <div ref={tickerRef} className="flex whitespace-nowrap will-change-transform" style={{ width: "max-content" }}>
          {TICKER_ITEMS.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-6 px-6 text-sm tracking-[0.3em] text-[#2a3f6a] uppercase"
              style={{ fontFamily: "var(--font-display)" }}>
              {item}
              <span className="text-[#F97316] text-xs">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
