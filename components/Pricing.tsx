"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check } from "lucide-react";
import { supabase } from "@/lib/supabase";

gsap.registerPlugin(ScrollTrigger);

type PricingRow = { id: string; duration: number; regular: number; peak: number; weekend: number };
type PackageRow = { id: string; name: string; features: string[]; is_popular: boolean; sort_order: number };

const FALLBACK_PRICING: PricingRow[] = [
  { id: "1", duration: 30,  regular: 50,  peak: 50,  weekend: 50  },
  { id: "2", duration: 60,  regular: 80,  peak: 100, weekend: 110 },
  { id: "3", duration: 90,  regular: 110, peak: 135, weekend: 150 },
  { id: "4", duration: 120, regular: 140, peak: 170, weekend: 185 },
];

const FALLBACK_PACKAGES: PackageRow[] = [
  { id: "1", name: "Pack Anniversaire", features: ["90 min terrain", "60 min espace relaxe", "PS5 FIFA incluse", "Boissons incluses"], is_popular: false, sort_order: 1 },
  { id: "2", name: "Pack Corporate",    features: ["2h terrain", "Arbitre professionnel", "Espace détente", "Facturation entreprise"], is_popular: true, sort_order: 2 },
  { id: "3", name: "Pack Tournoi Privé", features: ["Bloc multi-heures", "Organisation bracket", "Arbitrage complet", "Récompenses"], is_popular: false, sort_order: 3 },
];

export default function Pricing() {
  const sectionRef = useRef<HTMLElement>(null);
  const [pricing, setPricing] = useState<PricingRow[]>(FALLBACK_PRICING);
  const [packages, setPackages] = useState<PackageRow[]>(FALLBACK_PACKAGES);

  useEffect(() => {
    async function fetchData() {
      try {
        const [pricingRes, packagesRes] = await Promise.all([
          supabase.from("pricing").select("*").order("duration"),
          supabase.from("packages").select("*").order("sort_order"),
        ]);
        if (pricingRes.data?.length) setPricing(pricingRes.data as PricingRow[]);
        if (packagesRes.data?.length) setPackages(packagesRes.data as PackageRow[]);
      } catch {
        // Use fallback data
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".pricing-header > *", {
        opacity: 0, y: 40, duration: 0.8, stagger: 0.12, ease: "expo.out",
        scrollTrigger: { trigger: ".pricing-header", start: "top 80%" },
      });
      gsap.from(".pricing-table", {
        opacity: 0, y: 50, duration: 0.8, ease: "expo.out",
        scrollTrigger: { trigger: ".pricing-table", start: "top 85%" },
      });
      gsap.from(".pack-card", {
        opacity: 0, y: 40, duration: 0.7, stagger: 0.12, ease: "expo.out",
        scrollTrigger: { trigger: ".pack-card", start: "top 90%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="tarifs" className="py-32 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="pricing-header text-center mb-16">
          <span className="section-label block mb-4">Tarifs &amp; Forfaits</span>
          <h2 className="text-white leading-none"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3rem, 8vw, 6rem)" }}>
            Des forfaits{" "}
            <span style={{ background: "linear-gradient(to right, #F97316, #FBBF24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              sur mesure
            </span>
          </h2>
          <p className="text-[#6080b8] mt-4 max-w-lg mx-auto">
            Location à l&apos;heure ou forfaits événements complets. Paiement en ligne sécurisé.
          </p>
        </div>

        {/* Pricing Table */}
        <div className="pricing-table glass-card overflow-hidden mb-16">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-6 py-5 text-white text-sm tracking-[0.15em] uppercase" style={{ fontFamily: "var(--font-display)" }}>Durée</th>
                <th className="text-center px-6 py-5 text-white text-sm tracking-[0.15em] uppercase" style={{ fontFamily: "var(--font-display)" }}>Régulier</th>
                <th className="text-center px-6 py-5 text-white text-sm tracking-[0.15em] uppercase" style={{ fontFamily: "var(--font-display)" }}>Pointe</th>
                <th className="text-center px-6 py-5 text-white text-sm tracking-[0.15em] uppercase" style={{ fontFamily: "var(--font-display)" }}>Week-end</th>
              </tr>
            </thead>
            <tbody>
              {pricing.map((row) => (
                <tr key={row.id} className="border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-5">
                    <span className="text-[#F97316] font-semibold tracking-[0.1em] uppercase" style={{ fontFamily: "var(--font-display)" }}>
                      {row.duration} min
                    </span>
                  </td>
                  <td className="text-center px-6 py-5 text-[#90a8d8]">{row.regular}$</td>
                  <td className="text-center px-6 py-5 text-[#90a8d8]">{row.peak}$</td>
                  <td className="text-center px-6 py-5">
                    <span className="text-[#F97316] font-semibold">{row.weekend}$</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-[#3d5a90] text-xs text-center py-4 border-t border-white/[0.05]">
            * Les prix sont à titre indicatif et peuvent varier. Taxes en sus (TPS/TVQ).
          </p>
        </div>

        {/* Packs */}
        <div className="grid md:grid-cols-3 gap-6">
          {packages.map((pack) => (
            <div
              key={pack.id}
              className={`pack-card glass-card p-8 relative transition-all duration-300 ${
                pack.is_popular
                  ? "border-[#F97316]/40 shadow-[0_0_30px_rgba(249,115,22,0.1)]"
                  : "hover:border-white/15"
              }`}
            >
              {pack.is_popular && (
                <span className="absolute top-4 right-4 bg-[#F97316] text-[#06080f] text-xs px-3 py-1 rounded-full font-semibold tracking-wider uppercase"
                  style={{ fontFamily: "var(--font-display)" }}>
                  Populaire
                </span>
              )}
              <h3 className="text-white text-2xl mb-6 tracking-[0.06em] uppercase" style={{ fontFamily: "var(--font-display)" }}>
                {pack.name}
              </h3>
              <ul className="space-y-3 mb-8">
                {pack.features.map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <Check size={16} className="text-[#F97316] shrink-0" />
                    <span className="text-[#90a8d8] text-sm">{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#booking"
                className={pack.is_popular ? "btn-neon w-full justify-center" : "btn-ghost w-full justify-center"}
              >
                Réserver
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
