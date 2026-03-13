"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Calendar, Trophy, Users, PartyPopper, Gamepad2, HeartHandshake } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const SERVICES = [
  {
    icon: Calendar,
    color: "text-[#FBBF24]",
    bg: "bg-[#FBBF24]/10 border-[#FBBF24]/20",
    title: "Réservation en ligne",
    desc: "Réservez votre terrain intérieur de 42 pieds en quelques clics. Créneaux de 30, 60, 90 ou 120 minutes avec confirmation instantanée.",
  },
  {
    icon: Trophy,
    color: "text-[#F97316]",
    bg: "bg-[#F97316]/10 border-[#F97316]/20",
    title: "Tournois saisonniers",
    desc: "Inscrivez votre équipe à nos tournois avec classements en direct, arbitrage professionnel et trophées à gagner.",
  },
  {
    icon: Users,
    color: "text-[#22C55E]",
    bg: "bg-[#22C55E]/10 border-[#22C55E]/20",
    title: "Ligues hebdomadaires",
    desc: "Rejoignez nos ligues compétitives 5v5 et 6v6. Calendrier, statistiques et classements mis à jour en temps réel.",
  },
  {
    icon: PartyPopper,
    color: "text-[#EF4444]",
    bg: "bg-[#EF4444]/10 border-[#EF4444]/20",
    title: "Événements sur mesure",
    desc: "Fêtes d'anniversaire, team building, sorties scolaires. Forfaits tout inclus avec terrain, salle privée et collations.",
  },
  {
    icon: Gamepad2,
    color: "text-[#6366F1]",
    bg: "bg-[#6366F1]/10 border-[#6366F1]/20",
    title: "Zone détente & PS5",
    desc: "Profitez de notre salon avec écran géant, PS5 et FIFA. Inclus dans le Pack Fête ou disponible en option avec votre réservation.",
  },
  {
    icon: HeartHandshake,
    color: "text-[#FBBF24]",
    bg: "bg-[#FBBF24]/10 border-[#FBBF24]/20",
    title: "Coaching & arbitrage",
    desc: "Ajoutez un coach certifié ou un arbitre professionnel à votre session. Idéal pour les tournois et événements corporatifs.",
  },
];

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".services-title", {
        opacity: 0, y: 50, duration: 0.8, ease: "expo.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      });
      gsap.from(".service-card", {
        opacity: 0, y: 40, duration: 0.7, stagger: 0.1, ease: "expo.out",
        scrollTrigger: { trigger: ".service-card", start: "top 85%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="services" className="py-32 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="services-title text-center mb-16">
          <span className="section-label block mb-4">Nos services</span>
          <h2 className="text-white leading-none"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3rem, 8vw, 6rem)" }}>
            Tout pour{" "}
            <span style={{ background: "linear-gradient(to right, #F97316, #FBBF24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              jouer
            </span>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map(({ icon: Icon, color, bg, title, desc }) => (
            <div key={title} className="service-card glass-card p-8 group hover:border-white/15 transition-all duration-300">
              <div className={`w-14 h-14 rounded-xl ${bg} border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <Icon size={26} className={color} />
              </div>
              <h3 className="text-white text-xl mb-3 tracking-[0.06em] uppercase" style={{ fontFamily: "var(--font-display)" }}>
                {title}
              </h3>
              <p className="text-[#6080b8] text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
