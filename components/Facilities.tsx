"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Zap, Shield, Camera, Wifi } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const AMENITIES = [
  { icon: Zap,    label: "LED Floodlighting",   desc: "5000-lux broadcast-grade LEDs" },
  { icon: Shield, label: "Turf-Certified",       desc: "FIFA & World Rugby approved"   },
  { icon: Camera, label: "Video Analysis",        desc: "Record & replay every session" },
  { icon: Wifi,   label: "Smart Booking App",    desc: "iOS & Android, instant confirm" },
];

const GALLERY = [
  {
    src: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=900&q=85",
    alt: "5-a-side pitch under LED floodlights",
    span: "col-span-2 row-span-2",
    label: "Pitch Alpha",
  },
  {
    src: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&q=85",
    alt: "7-a-side football pitch aerial",
    span: "col-span-1 row-span-1",
    label: "Pitch Beta",
  },
  {
    src: "https://images.unsplash.com/photo-1578928079935-ea1aadc7e2e5?w=600&q=85",
    alt: "Indoor arena football match",
    span: "col-span-1 row-span-1",
    label: "Main Arena",
  },
  {
    src: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=900&q=85",
    alt: "Player action shot on turf",
    span: "col-span-2 row-span-1",
    label: "Game Night",
  },
];

export default function Facilities() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header reveal
      gsap.from(".facilities-header > *", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.12,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ".facilities-header",
          start: "top 80%",
        },
      });

      // Gallery parallax
      gsap.utils.toArray<HTMLElement>(".gallery-item").forEach((el, i) => {
        gsap.from(el, {
          opacity: 0,
          y: 60,
          duration: 0.8,
          delay: i * 0.08,
          ease: "expo.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
          },
        });
      });

      // Amenity cards
      gsap.from(".amenity-card", {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ".amenities-row",
          start: "top 85%",
        },
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
              <div className="w-8 h-px bg-[#39ff14]" />
              <span className="section-label">World-Class Facilities</span>
            </div>
            <h2
              className="text-white leading-none"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
              }}
            >
              THREE PITCHES.
              <br />
              <span
                style={{
                  background: "linear-gradient(to right, #39ff14, #00ffcc)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                ONE ARENA.
              </span>
            </h2>
          </div>
          <p className="text-[#5a5a72] max-w-xs text-sm leading-relaxed md:text-right">
            From intimate 5-a-side cages to a full-size hybrid-grass main arena—
            every pitch is built for peak performance.
          </p>
        </div>

        {/* Gallery grid */}
        <div className="grid grid-cols-3 grid-rows-3 gap-3 h-[560px] mb-16">
          {GALLERY.map((item) => (
            <div
              key={item.label}
              className={`gallery-item relative overflow-hidden rounded-2xl group cursor-pointer ${item.span}`}
            >
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#07070e]/80 via-transparent to-transparent" />
              {/* Label */}
              <div className="absolute bottom-4 left-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                <div className="w-1.5 h-1.5 rounded-full bg-[#39ff14]" />
                <span
                  className="text-white text-sm tracking-wide"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {item.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Amenities */}
        <div className="amenities-row grid grid-cols-2 md:grid-cols-4 gap-4">
          {AMENITIES.map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="amenity-card glass-card p-6 group hover:border-[#39ff14]/20 transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-[#39ff14]/10 border border-[#39ff14]/20 flex items-center justify-center mb-5 group-hover:bg-[#39ff14]/20 transition-colors">
                <Icon size={20} className="text-[#39ff14]" />
              </div>
              <h4
                className="text-white text-lg mb-1 tracking-[0.04em]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {label}
              </h4>
              <p className="text-[#5a5a72] text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
