"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Calendar, Trophy, Users, Gamepad2 } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  { icon: Calendar,  title: "En ligne 24/7",    sub: "Réservation" },
  { icon: Trophy,    title: "Saisonniers",       sub: "Tournois" },
  { icon: Users,     title: "Hebdomadaires",     sub: "Ligues" },
  { icon: Gamepad2,  title: "Espace Relaxe",     sub: "FIFA PS5" },
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef      = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const logoRef    = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const subRef     = useRef<HTMLParagraphElement>(null);
  const ctaRef     = useRef<HTMLDivElement>(null);
  const featRef    = useRef<HTMLDivElement>(null);

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
        .from(logoRef.current,    { opacity: 0, y: 60, duration: 0.9 }, "-=0.4")
        .from(taglineRef.current, { opacity: 0, y: 40, duration: 0.8 }, "-=0.5")
        .from(subRef.current,     { opacity: 0, y: 30, duration: 0.7 }, "-=0.4")
        .from(ctaRef.current,     { opacity: 0, y: 30, duration: 0.7 }, "-=0.3")
        .from(featRef.current,    { opacity: 0, y: 20, duration: 0.6 }, "-=0.2");
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
      </div>

      {/* Main content */}
      <div className="relative flex-1 flex items-center justify-center text-center max-w-7xl mx-auto w-full px-6 lg:px-10 pt-32 pb-24">
        <div className="w-full max-w-4xl">
          {/* Eyebrow */}
          <div ref={eyebrowRef} className="mb-6">
            <span className="section-label tracking-[0.5em]">Montréal &bull; Terrain Intérieur</span>
          </div>

          {/* Logo text */}
          <div ref={logoRef} className="mb-6">
            <h1 className="text-white leading-[0.9]"
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(5rem, 16vw, 13rem)" }}>
              MTLW<span style={{ background: "linear-gradient(to right, #F97316, #FBBF24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>CUP</span>
            </h1>
          </div>

          {/* Tagline */}
          <div ref={taglineRef} className="mb-8">
            <h2 className="text-[#90a8d8] tracking-[0.3em] uppercase"
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.2rem, 3vw, 2.2rem)" }}>
              Réserve. Joue. Domine.
            </h2>
          </div>

          {/* Subtitle */}
          <p ref={subRef} className="text-[#6080b8] text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-light">
            Terrain intérieur de 42 pieds, tournois, ligues compétitives et
            événements privés au cœur de Montréal.
          </p>

          {/* CTAs */}
          <div ref={ctaRef} className="flex flex-wrap items-center justify-center gap-4 mb-20">
            <a href="#booking" className="btn-neon text-base flex items-center gap-2">
              <Calendar size={18} />
              Réserver un terrain
            </a>
            <a href="#services" className="btn-ghost text-base">
              Voir les services
            </a>
          </div>
        </div>
      </div>

      {/* Feature bar */}
      <div ref={featRef} className="relative border-t border-white/[0.05] bg-[#080f1c]/80 backdrop-blur-sm py-8">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {FEATURES.map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex flex-col items-center text-center gap-2">
              <Icon size={28} className="text-[#F97316]" />
              <span className="text-white text-sm tracking-[0.15em] uppercase" style={{ fontFamily: "var(--font-display)" }}>
                {title}
              </span>
              <span className="text-[#3d5a90] text-xs tracking-widest uppercase">{sub}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
