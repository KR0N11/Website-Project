"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Menu, X, Flame } from "lucide-react";

const NAV_LINKS = [
  { label: "Pitches",  href: "#facilities" },
  { label: "Book",     href: "#booking" },
  { label: "Events",   href: "#events" },
  { label: "About",    href: "#about" },
];

export default function Navbar() {
  const navRef  = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const [open, setOpen]         = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(navRef.current, { y: -80, opacity: 0, duration: 1, ease: "expo.out", delay: 0.2 });
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
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div ref={logoRef} className="flex items-center gap-2 cursor-pointer" onMouseEnter={pulseLogo}>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F97316] to-[#EA580C] flex items-center justify-center shadow-[0_0_12px_rgba(249,115,22,0.4)]">
                <Flame size={15} className="text-white fill-white" />
              </div>
              <span className="text-white text-2xl tracking-[0.12em]" style={{ fontFamily: "var(--font-display)" }}>
                MTL<span className="text-[#F97316]">WC</span>
              </span>
            </div>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-10">
              {NAV_LINKS.map((link) => (
                <a key={link.label} href={link.href}
                  className="text-[#90a8d8] hover:text-white text-sm tracking-[0.08em] uppercase transition-colors duration-200 relative group">
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#F97316] transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
              <a href="/admin" className="text-[#60a8d8]/60 hover:text-[#F97316] text-xs tracking-[0.08em] uppercase transition-colors duration-200 border border-white/10 px-3 py-1 rounded-md hover:border-[#F97316]/40">
                Admin
              </a>
            </div>

            {/* CTA */}
            <div className="hidden md:flex items-center gap-4">
              <a href="#booking" className="btn-neon text-sm py-3 px-6">Book Now</a>
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
        <a href="/admin" onClick={() => setOpen(false)}
          className="text-[#F97316]/60 text-2xl tracking-[0.1em] mt-2" style={{ fontFamily: "var(--font-display)" }}>
          Admin Portal
        </a>
        <a href="#booking" onClick={() => setOpen(false)} className="btn-neon mt-4">Book Now</a>
      </div>
    </>
  );
}
