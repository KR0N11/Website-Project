"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown, Clock, CreditCard, AlertTriangle, Users, ShieldCheck, HelpCircle } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

type FaqRow = { id: string; question: string; answer: string; icon: string; sort_order: number };

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  clock: Clock,
  "credit-card": CreditCard,
  "alert-triangle": AlertTriangle,
  users: Users,
  "shield-check": ShieldCheck,
  "help-circle": HelpCircle,
};

const FALLBACK_FAQ: FaqRow[] = [
  { id: "1", question: "Quels sont les horaires d'ouverture ?", answer: "Le terrain est disponible du lundi au dimanche, de 8h à 23h.", icon: "clock", sort_order: 1 },
  { id: "2", question: "Quels modes de paiement acceptez-vous ?", answer: "Nous acceptons Visa, Mastercard et Interac.", icon: "credit-card", sort_order: 2 },
  { id: "3", question: "Quelle est votre politique d'annulation ?", answer: "Plus de 48h : remboursement complet. Entre 24h-48h : crédit. Moins de 24h : aucun remboursement.", icon: "alert-triangle", sort_order: 3 },
  { id: "4", question: "Combien de joueurs peuvent jouer ?", answer: "Idéal pour 5v5 ou 6v6. Capacité totale de 30 personnes.", icon: "users", sort_order: 4 },
  { id: "5", question: "Fournissez-vous l'équipement ?", answer: "Ballons, dossards et buts fournis. Apportez vos chaussures d'intérieur.", icon: "shield-check", sort_order: 5 },
  { id: "6", question: "Peut-on réserver pour un événement privé ?", answer: "Oui ! Packs Anniversaire, Corporate et Tournoi disponibles.", icon: "help-circle", sort_order: 6 },
];

export default function FAQ() {
  const sectionRef = useRef<HTMLElement>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [faqItems, setFaqItems] = useState<FaqRow[]>(FALLBACK_FAQ);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".faq-title",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: "expo.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", toggleActions: "play none none none" } }
      );
      gsap.fromTo(".faq-item",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "expo.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%", toggleActions: "play none none none" } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="faq" className="py-32 px-6 overflow-hidden">
      <div className="max-w-3xl mx-auto">
        {/* Title */}
        <div className="faq-title text-center mb-16">
          <span className="section-label block mb-4">Questions fréquentes</span>
          <h2 className="text-white leading-none"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3rem, 8vw, 5rem)" }}>
            Besoin d&apos;{" "}
            <span style={{ background: "linear-gradient(to right, #F97316, #FBBF24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              aide
            </span>
            {" "}?
          </h2>
          <p className="text-[#6080b8] mt-4 max-w-lg mx-auto">
            Tout ce que vous devez savoir avant de réserver votre terrain.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqItems.map((item) => {
            const isOpen = openId === item.id;
            const Icon = ICON_MAP[item.icon] ?? HelpCircle;
            return (
              <div
                key={item.id}
                className={`faq-item glass-card overflow-hidden transition-all duration-300 ${
                  isOpen ? "border-[#F97316]/30" : ""
                }`}
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="w-full flex items-center gap-4 px-6 py-5 text-left"
                >
                  <Icon size={20} className="text-[#F97316] shrink-0" />
                  <span className="text-white text-sm tracking-[0.1em] uppercase flex-1" style={{ fontFamily: "var(--font-display)" }}>
                    {item.question}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`text-[#6080b8] shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="px-6 pb-5 pl-16 text-[#90a8d8] text-sm leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
