"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: 2400,  suffix: "+",  label: "Players Monthly",        desc: "Active community of Montréal ballers" },
  { value: 98,    suffix: "%",  label: "Satisfaction Rate",      desc: "Based on post-match app reviews"      },
  { value: 3,     suffix: "",   label: "Premium Pitches",        desc: "5v5, 7v7 & full main arena"           },
  { value: 12,    suffix: "K+", label: "Hours Played / Year",    desc: "Open 7 days, year-round"              },
];

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      STATS.forEach((stat, i) => {
        const el = document.querySelector(`.stat-val-${i}`);
        if (!el) return;
        gsap.from(el, {
          textContent: 0, duration: 2, ease: "power2.out", snap: { textContent: 1 },
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%", once: true },
          onUpdate() { el.textContent = Math.round(parseFloat(this.targets()[0].textContent ?? "0")).toLocaleString(); },
        });
      });
      gsap.from(".stat-card", {
        opacity: 0, y: 50, duration: 0.8, stagger: 0.1, ease: "expo.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      });
      gsap.from(".cta-block > *", {
        opacity: 0, y: 40, duration: 0.8, stagger: 0.12, ease: "expo.out",
        scrollTrigger: { trigger: ".cta-block", start: "top 80%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="py-32 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-6 mb-24">
          <div className="flex-1 h-px bg-white/[0.05]" />
          <span className="section-label">By The Numbers</span>
          <div className="flex-1 h-px bg-white/[0.05]" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-32">
          {STATS.map((s, i) => (
            <div key={s.label} className="stat-card">
              <div className="w-8 h-0.5 mb-6" style={{ background: "linear-gradient(to right, #F97316, #FBBF24)" }} />
              <div className="flex items-baseline gap-1 mb-2">
                <span className={`stat-val-${i} text-white leading-none`}
                  style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.8rem, 6vw, 5rem)" }}>
                  {s.value.toLocaleString()}
                </span>
                <span className="text-[#F97316] leading-none"
                  style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}>
                  {s.suffix}
                </span>
              </div>
              <div className="text-white text-sm font-medium mb-1">{s.label}</div>
              <div className="text-[#3d5a90] text-xs leading-relaxed">{s.desc}</div>
            </div>
          ))}
        </div>

        {/* CTA banner */}
        <div className="cta-block relative overflow-hidden rounded-3xl p-12 md:p-20 text-center"
          style={{
            background: "radial-gradient(ellipse 100% 120% at 50% 115%, rgba(249,115,22,0.2) 0%, transparent 60%), linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
            border: "1px solid rgba(255,255,255,0.07)",
            backdropFilter: "blur(20px)",
          }}>
          <div className="absolute inset-0 pitch-grid opacity-40" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 65%)", filter: "blur(35px)" }} />
          <div className="relative">
            <span className="section-label block mb-6">Prêt à jouer?</span>
            <h2 className="text-white leading-none mb-6"
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3rem, 9vw, 7rem)" }}>
              YOUR PITCH
              <br />
              <span style={{ background: "linear-gradient(to right, #F97316, #FBBF24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                AWAITS.
              </span>
            </h2>
            <p className="text-[#6080b8] max-w-md mx-auto mb-12 text-base leading-relaxed">
              Join thousands of Montréal players who trust MTLWC for the best indoor
              soccer experience in the city.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a href="#booking" className="btn-neon text-lg px-10 py-5">Book Now — From $90 CAD</a>
              <a href="mailto:play@mtlwc.ca" className="btn-ghost text-base">Contact Us</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
