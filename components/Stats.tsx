"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: 2400,  suffix: "+", label: "Players Monthly",      desc: "Active community of regular ballers" },
  { value: 98,    suffix: "%", label: "Satisfaction Rate",    desc: "Based on post-match app reviews"     },
  { value: 3,     suffix: "",  label: "Premium Pitches",      desc: "5v5, 7v7 & full arena"               },
  { value: 12,    suffix: "K+", label: "Hours Played / Year", desc: "Year-round, 7 days a week"           },
];

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Counter animation
      STATS.forEach((stat, i) => {
        const el = document.querySelector(`.stat-val-${i}`);
        if (!el) return;
        gsap.from(el, {
          textContent: 0,
          duration: 2,
          ease: "power2.out",
          snap: { textContent: 1 },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            once: true,
          },
          onUpdate() {
            const current = Math.round(parseFloat(this.targets()[0].textContent ?? "0"));
            el.textContent = current.toLocaleString();
          },
        });
      });

      gsap.from(".stat-card", {
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });

      gsap.from(".cta-block > *", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.12,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ".cta-block",
          start: "top 80%",
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="py-32 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Divider */}
        <div className="flex items-center gap-6 mb-24">
          <div className="flex-1 h-px bg-white/[0.06]" />
          <span className="section-label">By The Numbers</span>
          <div className="flex-1 h-px bg-white/[0.06]" />
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-32">
          {STATS.map((s, i) => (
            <div key={s.label} className="stat-card">
              {/* Neon line */}
              <div className="w-8 h-0.5 bg-[#39ff14] mb-6" />

              <div className="flex items-baseline gap-1 mb-2">
                <span
                  className={`stat-val-${i} text-white leading-none`}
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(2.8rem, 6vw, 5rem)",
                  }}
                >
                  {s.value.toLocaleString()}
                </span>
                <span
                  className="text-[#39ff14] leading-none"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                  }}
                >
                  {s.suffix}
                </span>
              </div>

              <div className="text-white text-sm font-medium mb-1">{s.label}</div>
              <div className="text-[#5a5a72] text-xs leading-relaxed">{s.desc}</div>
            </div>
          ))}
        </div>

        {/* CTA banner */}
        <div
          className="cta-block relative overflow-hidden rounded-3xl p-12 md:p-20 text-center"
          style={{
            background:
              "radial-gradient(ellipse 100% 120% at 50% 120%, rgba(57,255,20,0.15) 0%, transparent 60%), linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Background pitch lines */}
          <div className="absolute inset-0 pitch-grid opacity-50" />

          {/* Glow orb */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(57,255,20,0.12) 0%, transparent 65%)",
              filter: "blur(30px)",
            }}
          />

          <div className="relative">
            <span className="section-label block mb-6">Ready to Play?</span>
            <h2
              className="text-white leading-none mb-6"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(3rem, 9vw, 7rem)",
              }}
            >
              YOUR PITCH
              <br />
              <span
                style={{
                  background: "linear-gradient(to right, #39ff14, #00ffcc)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                AWAITS.
              </span>
            </h2>
            <p className="text-[#8888a0] max-w-md mx-auto mb-12 text-base leading-relaxed">
              Join thousands of players who trust ArenaFC for the best indoor
              football experience in London.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a href="#booking" className="btn-neon text-lg px-10 py-5">
                Book Now — From £65
              </a>
              <a href="mailto:play@arenafc.co.uk" className="btn-ghost text-base">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
