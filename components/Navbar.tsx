"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Menu, X, LogIn, UserPlus, ShieldCheck } from "lucide-react";

const NAV_LINKS = [
  { label: "Services",  href: "#services" },
  { label: "Galerie",   href: "#galerie" },
  { label: "Tarifs",    href: "#tarifs" },
  { label: "FAQ",       href: "#faq" },
];

export default function Navbar() {
  const navRef  = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const [open, setOpen]         = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(navRef.current, { y: -80, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "expo.out", delay: 0.2 });
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const pulseLogo = () => {
    gsap.to(logoRef.current, { scale: 1.05, duration: 0.15, yoyo: true, repeat: 1, ease: "power2.inOut" });
  };

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#06080f]/90 backdrop-blur-xl border-b border-white/[0.06]"
            : "bg-gradient-to-b from-[#06080f]/70 to-transparent backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-24">
            {/* Logo */}
            <div ref={logoRef} className="flex items-center gap-1 cursor-pointer" onMouseEnter={pulseLogo}>
              <span className="text-white text-xl tracking-[0.08em]" style={{ fontFamily: "var(--font-display)" }}>
                MTLW<span className="text-[#F97316]">CUP</span>
              </span>
            </div>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <a key={link.label} href={link.href}
                  className="text-[#90a8d8] hover:text-white text-sm tracking-[0.08em] uppercase transition-colors duration-200 relative group">
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#F97316] transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="hidden md:flex items-center gap-3">
              <a href="/admin" className="flex items-center gap-2 text-[#F97316] hover:text-[#FBBF24] text-sm tracking-[0.08em] uppercase transition-colors duration-200">
                <ShieldCheck size={16} />
                Admin
              </a>
              <a href="#" className="flex items-center gap-2 text-[#90a8d8] hover:text-white text-sm tracking-[0.08em] uppercase transition-colors duration-200">
                <LogIn size={16} />
                Connexion
              </a>
              <a href="#" className="btn-neon text-sm py-2.5 px-5 flex items-center gap-2">
                <UserPlus size={16} />
                S&apos;inscrire
              </a>
            </div>

            {/* Mobile toggle */}
            <button className="md:hidden text-white p-2" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`fixed inset-0 z-40 bg-[#06080f]/98 backdrop-blur-xl transition-all duration-500 flex flex-col items-center justify-center gap-10 ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}>
        {NAV_LINKS.map((link) => (
          <a key={link.label} href={link.href} onClick={() => setOpen(false)}
            className="text-white text-5xl tracking-[0.1em]" style={{ fontFamily: "var(--font-display)" }}>
            {link.label}
          </a>
        ))}
        <a href="/admin" onClick={() => setOpen(false)} className="flex items-center gap-2 text-[#F97316] text-lg mt-4 tracking-[0.1em] uppercase">
          <ShieldCheck size={20} /> Admin
        </a>
      </div>
    </>
  );
}
