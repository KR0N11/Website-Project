"use client";
import { useState } from "react";
import {
  Clock, CreditCard, AlertTriangle, Users, Shield, Calendar, ChevronDown,
} from "lucide-react";

const FAQ_ITEMS = [
  {
    icon: Clock,
    question: "Quels sont les horaires d'ouverture ?",
    answer: "Le terrain est disponible du lundi au dimanche, de 7h à 23h. Les réservations en ligne sont disponibles 24h/24, 7j/7.",
  },
  {
    icon: AlertTriangle,
    question: "Quelle est votre politique d'annulation ?",
    answer: "Plus de 48h avant : remboursement complet. Entre 24h et 48h : crédit sur votre compte. Moins de 24h avant : aucun remboursement.",
  },
  {
    icon: Users,
    question: "Combien de joueurs peuvent jouer ?",
    answer: "Idéal pour 5v5 ou 6v6. Capacité totale de 30 personnes, incluant joueurs et spectateurs.",
  },
  {
    icon: Shield,
    question: "Fournissez-vous l'équipement ?",
    answer: "Ballons, dossards et buts sont fournis. Apportez vos propres chaussures d'intérieur. Casiers disponibles sur place.",
  },
  {
    icon: Calendar,
    question: "Peut-on réserver pour un événement privé ?",
    answer: "Oui ! Nous offrons des packs Anniversaire, Corporate et Tournoi personnalisés. Contactez-nous pour un devis sur mesure.",
  },
  {
    icon: CreditCard,
    question: "Quels modes de paiement acceptez-vous ?",
    answer: "Nous acceptons Visa, Mastercard et Interac. Le paiement en ligne est sécurisé via Stripe. Un dépôt de 50% est requis pour confirmer votre réservation.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-32 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-8 h-px bg-[#F97316]" />
            <span className="section-label">Questions fréquentes</span>
            <div className="w-8 h-px bg-[#F97316]" />
          </div>
          <h2
            className="text-white leading-none mb-4"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.5rem, 7vw, 5rem)",
            }}
          >
            TOUT CE QUE
            <br />
            <span
              style={{
                background: "linear-gradient(to right, #F97316, #FBBF24)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              VOUS DEVEZ SAVOIR
            </span>
          </h2>
          <p className="text-[#3d5a90] max-w-md mx-auto text-sm">
            Tout ce qu&apos;il faut savoir avant de réserver votre terrain.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {FAQ_ITEMS.map(({ icon: Icon, question, answer }, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={question}
                className="glass-card overflow-hidden transition-all duration-300"
                style={{
                  borderColor: isOpen ? "rgba(249,115,22,0.3)" : undefined,
                  boxShadow: isOpen ? "0 0 20px rgba(249,115,22,0.06)" : undefined,
                }}
              >
                <button
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300"
                      style={{
                        background: isOpen ? "rgba(249,115,22,0.2)" : "rgba(249,115,22,0.08)",
                        border: `1px solid ${isOpen ? "rgba(249,115,22,0.4)" : "rgba(249,115,22,0.15)"}`,
                      }}
                    >
                      <Icon size={16} className="text-[#F97316]" />
                    </div>
                    <span
                      className="text-sm uppercase tracking-widest transition-colors duration-200"
                      style={{
                        fontFamily: "var(--font-mono)",
                        color: isOpen ? "#fff" : "#90a8d8",
                      }}
                    >
                      {question}
                    </span>
                  </div>
                  <ChevronDown
                    size={16}
                    className="text-[#F97316] shrink-0 transition-transform duration-300"
                    style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                  />
                </button>

                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{ maxHeight: isOpen ? "200px" : "0px" }}
                >
                  <p className="px-6 pb-5 text-[#6080b8] text-sm leading-relaxed pl-[4.25rem]">
                    {answer}
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
