"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Zap, Shield, Camera, Wifi } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const AMENITIES = [
  { icon: Zap,    label: "Éclairage LED",         desc: "LEDs 5000 lux qualité diffusion sur chaque terrain" },
  { icon: Shield, label: "Certifié FIFA",          desc: "Gazon 3G & 4G conforme aux normes FIFA Quality Pro" },
  { icon: Camera, label: "Analyse vidéo",          desc: "Enregistrez et repassez chaque session via l'appli" },
  { icon: Wifi,   label: "Réservation en ligne",   desc: "iOS & Android — confirmation instantanée"           },
];

const GALLERY = [
  {
    src: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=900&q=85",
    alt: "Joueurs en compétition sur gazon intérieur",
    span: "col-span-2 row-span-2",
    label: "Soirée de match",
  },
  {
    src: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=600&q=85",
    alt: "Ballon sur gazon 3G",
    span: "col-span-1 row-span-1",
    label: "Terrain Alpha",
  },
  {
    src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=85",
    alt: "Action de futsal intérieur",
    span: "col-span-1 row-span-1",
    label: "Terrain Bêta",
  },
  {
    src: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=900&q=85",
    alt: "Arène de soccer intérieur grandeur nature",
    span: "col-span-2 row-span-1",
    label: "Arène Principale",
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
      gsap.from(".amenity-card", {
        opacity: 0, y: 30, duration: 0.6, stagger: 0.1, ease: "expo.out",
        scrollTrigger: { trigger: ".amenities-row", start: "top 85%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="facilities" className="py-32 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="facilities-header flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-px bg-[#F97316]" />
              <span className="section-label">Installations de classe mondiale</span>
            </div>
            <h2 className="text-white leading-none"
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 7vw, 5.5rem)" }}>
              TROIS TERRAINS.
              <br />
              <span style={{ background: "linear-gradient(to right, #F97316, #FBBF24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                UNE ARÈNE.
              </span>
            </h2>
          </div>
          <p className="text-[#3d5a90] max-w-xs text-sm leading-relaxed md:text-right">
            Des petits terrains 5-à-côté aux grandes arènes intérieures —
            chaque surface conçue pour la performance à Montréal.
          </p>
        </div>

        {/* Gallery grid */}
        <div className="grid grid-cols-3 grid-rows-3 gap-3 h-[560px] mb-16">
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

        {/* Amenities */}
        <div className="amenities-row grid grid-cols-2 md:grid-cols-4 gap-4">
          {AMENITIES.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="amenity-card glass-card p-6 group hover:border-[#F97316]/20 transition-all duration-300">
              <div className="w-11 h-11 rounded-xl bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center mb-5 group-hover:bg-[#F97316]/20 transition-colors">
                <Icon size={20} className="text-[#F97316]" />
              </div>
              <h4 className="text-white text-lg mb-1 tracking-[0.04em]" style={{ fontFamily: "var(--font-display)" }}>
                {label}
              </h4>
              <p className="text-[#3d5a90] text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
