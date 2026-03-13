"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Calendar } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".cta-block > *",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "expo.out",
          scrollTrigger: { trigger: ".cta-block", start: "top 80%", toggleActions: "play none none none" } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="py-32 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
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
            <span className="section-label block mb-6">Prêt à jouer ?</span>
            <h2 className="text-white leading-none mb-6"
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3rem, 9vw, 7rem)" }}>
              TON TERRAIN
              <br />
              <span style={{ background: "linear-gradient(to right, #F97316, #FBBF24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                T&apos;ATTEND.
              </span>
            </h2>
            <p className="text-[#6080b8] max-w-md mx-auto mb-12 text-base leading-relaxed">
              Rejoins des centaines de joueurs à Montréal qui font confiance à MTLWCUP
              pour la meilleure expérience de soccer intérieur en ville.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a href="#booking" className="btn-neon text-lg px-10 py-5 flex items-center gap-2">
                <Calendar size={20} />
                Réserver maintenant
              </a>
              <a href="mailto:info@mtlwcup.ca" className="btn-ghost text-base">Nous contacter</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
