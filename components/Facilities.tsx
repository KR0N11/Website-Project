"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const GALLERY = [
  {
    src: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=900&q=85",
    alt: "Match en cours sur terrain intérieur",
    span: "col-span-2 row-span-2",
    label: "Soirée Match",
  },
  {
    src: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=600&q=85",
    alt: "Ballon de soccer sur gazon synthétique",
    span: "col-span-1 row-span-1",
    label: "Terrain",
  },
  {
    src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=85",
    alt: "Action de futsal intérieur",
    span: "col-span-1 row-span-1",
    label: "Tournoi",
  },
  {
    src: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=900&q=85",
    alt: "Arena de soccer intérieur",
    span: "col-span-2 row-span-1",
    label: "Arena",
  },
];

export default function Facilities() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".facilities-header > *", {
        opacity: 0, y: 40, duration: 0.8, stagger: 0.12, ease: "expo.out",
        scrollTrigger: { trigger: ".facilities-header", start: "top 80%" },
      });
      gsap.utils.toArray<HTMLElement>(".gallery-item").forEach((el, i) => {
        gsap.from(el, { opacity: 0, y: 60, duration: 0.8, delay: i * 0.08, ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 85%" } });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="galerie" className="py-32 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="facilities-header text-center mb-16">
          <span className="section-label block mb-4">Notre espace</span>
          <h2 className="text-white leading-none"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3rem, 8vw, 6rem)" }}>
            Galerie
          </h2>
        </div>

        {/* Gallery grid */}
        <div className="grid grid-cols-3 grid-rows-3 gap-3 h-[560px]">
          {GALLERY.map((item) => (
            <div key={item.label} className={`gallery-item relative overflow-hidden rounded-2xl group cursor-pointer ${item.span}`}>
              <img src={item.src} alt={item.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06080f]/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                <div className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
                <span className="text-white text-sm tracking-wide" style={{ fontFamily: "var(--font-display)" }}>
                  {item.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
