"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Menu, X, Zap } from "lucide-react";

const NAV_LINKS = [
  { label: "Pitches",  href: "#facilities" },
  { label: "Book",     href: "#booking" },
  { label: "Events",   href: "#events" },
  { label: "About",    href: "#about" },
];

export default function Navbar() {
  const navRef   = useRef<HTMLElement>(null);
  const logoRef  = useRef<HTMLDivElement>(null);
  const [open, setOpen]         = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Mount animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(navRef.current, {
        y: -80,
        opacity: 0,
        duration: 1,
        ease: "expo.out",
        delay: 0.2,
      });
    });
    return () => ctx.revert();
  }, []);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Logo pulse on hover
  const pulseLogo = () => {
    gsap.to(logoRef.current, {
      scale: 1.05,
      duration: 0.15,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut",
    });
  };

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#07070e]/90 backdrop-blur-xl border-b border-white/[0.06]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div
              ref={logoRef}
              className="flex items-center gap-2 cursor-pointer"
              onMouseEnter={pulseLogo}
            >
              <div className="w-8 h-8 rounded-lg bg-[#39ff14] flex items-center justify-center">
                <Zap size={16} className="text-[#07070e] fill-current" />
              </div>
              <span
                className="text-white text-2xl tracking-[0.12em]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                ARENA<span className="text-[#39ff14]">FC</span>
              </span>
            </div>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-10">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[#b8b8c3] hover:text-white text-sm tracking-[0.08em] uppercase transition-colors duration-200 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#39ff14] transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>

            {/* CTA */}
            <div className="hidden md:flex items-center gap-4">
              <a href="#booking" className="btn-neon text-sm py-3 px-6">
                Book Now
              </a>
            </div>

            {/* Mobile toggle */}
            <button
              className="md:hidden text-white p-2"
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 bg-[#07070e]/98 backdrop-blur-xl transition-all duration-500 flex flex-col items-center justify-center gap-10 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            onClick={() => setOpen(false)}
            className="text-white text-5xl tracking-[0.1em]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {link.label}
          </a>
        ))}
        <a href="#booking" onClick={() => setOpen(false)} className="btn-neon mt-6">
          Book Now
        </a>
      </div>
    </>
  );
}
