"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Check,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Clock,
  Users,
  CreditCard,
  Lock,
  Star,
  Zap,
  AlertTriangle,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useBooking } from "@/hooks/useBooking";
import BookingCalendar from "@/components/BookingCalendar";
import type { PitchType } from "@/types/booking";

gsap.registerPlugin(ScrollTrigger);

const STEP_LABELS = ["Formule", "Date & Heure", "Détails", "Paiement"];

export default function Booking() {
  const sectionRef = useRef<HTMLElement>(null);
  const {
    state,
    details,
    isSubmitting,
    isComplete,
    packRequiresApproval,
    selectedPitchConfig,
    selectedPackConfig,
    timeSlots,
    totalDuration,
    totalPrice,
    depositAmount,
    priceCategory,
    startTimeLabel,
    endTimeLabel,
    canAdvance,
    pitches,
    packs,
    selectPitch,
    selectDate,
    selectSlot,
    selectPack,
    updateDetail,
    nextStep,
    prevStep,
    reset,
    submitBooking,
  } = useBooking();

  useEffect(() => {
    if (isComplete) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".booking-header",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, ease: "expo.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", toggleActions: "play none none none" } }
      );
      gsap.fromTo(".booking-panel",
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 0.9, ease: "expo.out", delay: 0.15,
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", toggleActions: "play none none none" } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [isComplete]);

  if (isComplete) {
    return (
      <section ref={sectionRef} id="booking" className="py-32 px-6">
        <div className="max-w-lg mx-auto text-center glass-card p-14">
          {packRequiresApproval ? (
            <>
              <div className="w-20 h-20 rounded-full bg-[#FBBF24]/10 border border-[#FBBF24]/30 flex items-center justify-center mx-auto mb-8">
                <AlertTriangle size={40} className="text-[#FBBF24]" />
              </div>
              <h2 className="text-white text-4xl mb-4" style={{ fontFamily: "var(--font-display)" }}>
                EN ATTENTE D&apos;APPROBATION
              </h2>
              <p className="text-[#6080b8] mb-3">
                Votre réservation avec le forfait <strong className="text-[#FBBF24]">{selectedPackConfig?.name}</strong> nécessite une approbation.
              </p>
              <p className="text-[#3d5a90] text-sm mb-6">
                Contactez-nous à <strong className="text-white">mtlworldcup@gmail.com</strong> pour le suivi de votre demande.
              </p>
            </>
          ) : (
            <>
              <div className="w-20 h-20 rounded-full bg-[#F97316]/10 border border-[#F97316]/30 flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 size={40} className="text-[#F97316]" />
              </div>
              <h2 className="text-white text-5xl mb-4" style={{ fontFamily: "var(--font-display)" }}>
                RÉSERVATION CONFIRMÉE
              </h2>
              <p className="text-[#6080b8] mb-3">
                Confirmation envoyée à <strong className="text-white">{details.email}</strong>
              </p>
            </>
          )}
          {selectedPitchConfig && state.selectedDate && state.selectedSlots.length > 0 && (
            <div className="glass-card p-5 mt-8 mb-8 text-left space-y-3">
              <div className="flex justify-between">
                <span className="text-[#3d5a90] text-sm">Terrain</span>
                <span className="text-white text-sm">{selectedPitchConfig.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#3d5a90] text-sm">Date</span>
                <span className="text-white text-sm">
                  {format(state.selectedDate, "EEE dd MMM yyyy", { locale: fr })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#3d5a90] text-sm">Créneau</span>
                <span className="text-white text-sm">
                  {startTimeLabel} — {endTimeLabel} ({totalDuration} min)
                </span>
              </div>
              {!packRequiresApproval && (
                <div className="flex justify-between border-t border-white/10 pt-3">
                  <span className="text-[#3d5a90] text-sm">Dépôt payé</span>
                  <span className="text-[#F97316] font-semibold">{depositAmount}$</span>
                </div>
              )}
            </div>
          )}
          <button onClick={reset} className="btn-ghost w-full justify-center">
            Réserver un autre terrain
          </button>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} id="booking" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="booking-header text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-8 h-px bg-[#F97316]" />
            <span className="section-label">Disponibilité en temps réel</span>
            <div className="w-8 h-px bg-[#F97316]" />
          </div>
          <h2 className="text-white leading-none mb-4"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3rem, 8vw, 6rem)" }}>
            Choisissez votre{" "}
            <span style={{ background: "linear-gradient(to right, #F97316, #FBBF24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              formule
            </span>
          </h2>
          <p className="text-[#3d5a90] max-w-md mx-auto">
            Sélectionnez votre terrain, choisissez votre créneau et réservez en moins de 2 minutes.
          </p>
        </div>

        <div className="booking-panel max-w-4xl mx-auto mb-10">
          {/* Progress stepper */}
          <div className="flex items-center justify-between mb-12">
            {STEP_LABELS.map((label, i) => {
              const step = (i + 1) as 1 | 2 | 3 | 4;
              const active    = state.step === step;
              const completed = state.step > step;
              return (
                <div key={label} className="flex items-center gap-2 flex-1">
                  <div className={`flex items-center gap-2 ${i < STEP_LABELS.length - 1 ? "flex-1" : ""}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 transition-all duration-300 ${
                      completed ? "bg-[#F97316] text-[#06080f]"
                        : active ? "border-2 border-[#F97316] text-[#F97316]"
                        : "border border-white/20 text-[#3d5a90]"
                    }`}>
                      {completed ? <CheckCircle2 size={16} /> : step}
                    </div>
                    <span className={`text-xs uppercase tracking-widest hidden sm:block ${active ? "text-white" : "text-[#3d5a90]"}`}
                      style={{ fontFamily: "var(--font-mono)" }}>
                      {label}
                    </span>
                  </div>
                  {i < STEP_LABELS.length - 1 && (
                    <div className={`flex-1 h-px mx-3 transition-all duration-500 ${completed ? "bg-[#F97316]/50" : "bg-white/10"}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Step 1: Select Pitch */}
          {state.step === 1 && (
            <div className="grid md:grid-cols-3 gap-6">
              {pitches.map((pitch) => {
                const selected = state.selectedPitch === pitch.id;
                return (
                  <button key={pitch.id} onClick={() => selectPitch(pitch.id as PitchType)}
                    className={`glass-card p-0 overflow-hidden text-left transition-all duration-300 group ${
                      selected ? "border-[#F97316]/50 shadow-[0_0_30px_rgba(249,115,22,0.15)]" : "hover:border-white/20"
                    }`}>
                    <div className="relative h-40 overflow-hidden">
                      <img src={pitch.image} alt={pitch.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#06080f] via-transparent to-transparent" />
                      {selected && (
                        <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[#F97316] flex items-center justify-center">
                          <CheckCircle2 size={14} className="text-[#06080f]" />
                        </div>
                      )}
                      <div className="absolute bottom-3 left-3">
                        <span className="text-[#F97316] text-sm" style={{ fontFamily: "var(--font-mono)" }}>
                          {pitch.capacity}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-white text-2xl mb-1" style={{ fontFamily: "var(--font-display)" }}>
                        {pitch.name}
                      </h3>
                      <p className="text-[#3d5a90] text-sm mb-4 leading-relaxed">{pitch.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {pitch.features.map((f) => (
                          <span key={f} className="text-[#6080b8] text-xs px-2 py-0.5 rounded border border-white/10">{f}</span>
                        ))}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Step 2: Pack + Date & Time */}
          {state.step === 2 && (
            <div className="space-y-6">
              {/* Pack selection */}
              <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white text-lg tracking-[0.06em]" style={{ fontFamily: "var(--font-display)" }}>
                    FORFAIT
                    <span className="text-[#3d5a90] text-xs font-normal ml-2 tracking-normal lowercase">optionnel</span>
                  </h3>
                  {state.selectedPack && (
                    <button onClick={() => selectPack(null)} className="text-[#3d5a90] text-xs hover:text-white transition-colors">
                      Retirer
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {packs.map((pack) => {
                    const selected = state.selectedPack === pack.id;
                    return (
                      <button key={pack.id} onClick={() => selectPack(pack.id)}
                        className={`relative text-left p-4 rounded-xl border transition-all duration-300 ${
                          selected
                            ? "border-[#F97316]/50 bg-[#F97316]/[0.08] shadow-[0_0_20px_rgba(249,115,22,0.12)]"
                            : "border-white/10 hover:border-white/20 bg-white/[0.02]"
                        }`}>
                        {pack.is_popular && (
                          <span className="absolute -top-2 right-3 bg-[#F97316] text-[#06080f] text-[0.55rem] px-2 py-0.5 rounded-full font-semibold tracking-wider uppercase"
                            style={{ fontFamily: "var(--font-display)" }}>
                            Populaire
                          </span>
                        )}
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-white text-sm font-semibold tracking-wide uppercase" style={{ fontFamily: "var(--font-display)" }}>
                            {pack.name}
                          </h4>
                          {selected && (
                            <div className="w-5 h-5 rounded-full bg-[#F97316] flex items-center justify-center shrink-0 ml-2">
                              <Check size={12} className="text-[#06080f]" />
                            </div>
                          )}
                        </div>
                        <ul className="space-y-1">
                          {pack.features.map((f) => (
                            <li key={f} className="flex items-start gap-1.5">
                              <Check size={10} className="text-[#F97316] shrink-0 mt-0.5" />
                              <span className="text-[#6080b8] text-[0.7rem] leading-tight">{f}</span>
                            </li>
                          ))}
                        </ul>
                      </button>
                    );
                  })}
                </div>
                {state.selectedPack && (
                  <p className="text-[#FBBF24] text-xs mt-4 flex items-center gap-1.5">
                    <AlertTriangle size={12} />
                    Les forfaits nécessitent une approbation avant le paiement.
                  </p>
                )}
              </div>

              {/* Date & Time */}
              <div className="grid md:grid-cols-2 gap-8">
                <BookingCalendar selected={state.selectedDate} onSelect={selectDate} />
                <div className="glass-card p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <Clock size={16} className="text-[#F97316]" />
                    <h3 className="text-white text-lg tracking-[0.06em]" style={{ fontFamily: "var(--font-display)" }}>
                      {state.selectedDate
                        ? format(state.selectedDate, "EEE dd MMM", { locale: fr }).toUpperCase()
                        : "CHOISIR UNE DATE"}
                    </h3>
                  </div>
                  {!state.selectedDate ? (
                    <p className="text-[#3d5a90] text-sm text-center py-16">
                      Choisissez une date pour voir les créneaux
                    </p>
                  ) : (
                    <>
                      <p className="text-[#3d5a90] text-xs mb-4">
                        Sélectionnez jusqu&apos;à 2h consécutives (max 4 créneaux de 30 min).
                      </p>
                      <div className="grid grid-cols-3 gap-2 max-h-80 overflow-y-auto no-scrollbar pr-1">
                        {timeSlots.map((slot) => {
                          const isSelected = state.selectedSlots.some((s) => s.id === slot.id);
                          return (
                            <button key={slot.id} disabled={!slot.available}
                              onClick={() => slot.available && selectSlot(slot, timeSlots)}
                              className={`py-2.5 rounded-lg text-center transition-all duration-150 ${
                                !slot.available
                                  ? "opacity-20 cursor-not-allowed text-[#3d5a90] bg-white/[0.02]"
                                  : isSelected
                                    ? "bg-[#F97316] text-[#06080f] font-semibold shadow-[0_0_10px_rgba(249,115,22,0.3)]"
                                    : "bg-white/[0.04] text-[#90a8d8] hover:bg-white/[0.10] hover:text-white border border-white/[0.06]"
                              }`}>
                              <span className="text-sm" style={{ fontFamily: "var(--font-mono)" }}>{slot.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                  {state.selectedSlots.length > 0 && (
                    <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                      <span className="text-white text-sm">
                        {startTimeLabel} — {endTimeLabel}
                        <span className="text-[#3d5a90] ml-2 text-xs">{totalDuration} min · {priceCategory}</span>
                      </span>
                      <span className="text-[#F97316] text-lg font-bold">{totalPrice}$</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Player Details */}
          {state.step === 3 && (
            <div className="glass-card p-8 max-w-xl mx-auto">
              <div className="flex items-center gap-2 mb-8">
                <Users size={18} className="text-[#F97316]" />
                <h3 className="text-white text-xl tracking-[0.06em]" style={{ fontFamily: "var(--font-display)" }}>
                  VOS DÉTAILS
                </h3>
              </div>
              <div className="space-y-5">
                {[
                  { field: "name",     label: "Nom complet",       type: "text",  placeholder: "Alex Tremblay" },
                  { field: "email",    label: "Courriel",          type: "email", placeholder: "alex@email.com" },
                  { field: "phone",    label: "Téléphone",         type: "tel",   placeholder: "+1 514 555 0000" },
                  { field: "teamName", label: "Nom d'équipe",      type: "text",  placeholder: "FC Montréal" },
                  { field: "notes",    label: "Notes",             type: "text",  placeholder: "Demandes spéciales" },
                ].map(({ field, label, type, placeholder }) => (
                  <div key={field}>
                    <label className="block text-[#6080b8] text-xs tracking-widest uppercase mb-2"
                      style={{ fontFamily: "var(--font-mono)" }}>
                      {label}
                      {["name", "email", "phone"].includes(field) && <span className="text-[#F97316] ml-1">*</span>}
                    </label>
                    <input type={type} placeholder={placeholder}
                      value={details[field as keyof typeof details]}
                      onChange={(e) => updateDetail(field as keyof typeof details, e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-[#2a3f6a] focus:outline-none focus:border-[#F97316]/50 focus:bg-white/[0.06] transition-all text-sm" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Payment */}
          {state.step === 4 && (
            <div className="max-w-xl mx-auto space-y-6">
              <div className="glass-card p-6">
                <h3 className="text-white text-xl mb-5 tracking-[0.06em]" style={{ fontFamily: "var(--font-display)" }}>
                  RÉSUMÉ
                </h3>
                <div className="space-y-3 text-sm">
                  {[
                    { label: "Terrain",  value: selectedPitchConfig?.name ?? "—" },
                    { label: "Date",     value: state.selectedDate ? format(state.selectedDate, "EEE dd MMM yyyy", { locale: fr }) : "—" },
                    { label: "Créneau",  value: state.selectedSlots.length > 0 ? `${startTimeLabel} — ${endTimeLabel} (${totalDuration} min)` : "—" },
                    { label: "Joueur",   value: details.name },
                    ...(selectedPackConfig ? [{ label: "Forfait", value: selectedPackConfig.name }] : []),
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between">
                      <span className="text-[#3d5a90]">{label}</span>
                      <span className="text-white">{value}</span>
                    </div>
                  ))}
                  <div className="pt-4 mt-4 border-t border-white/10 flex justify-between items-baseline">
                    <span className="text-[#6080b8]">Total</span>
                    <span className="text-white">{totalPrice}$</span>
                  </div>
                  {state.selectedPack ? (
                    <div className="flex justify-between items-baseline">
                      <span className="text-[#FBBF24] font-medium">Approbation requise</span>
                      <span className="text-[#FBBF24] text-sm">Paiement après approbation</span>
                    </div>
                  ) : (
                    <div className="flex justify-between items-baseline">
                      <span className="text-[#F97316] font-medium">Dépôt (50%)</span>
                      <span className="text-[#F97316] text-xl font-semibold">{depositAmount}$</span>
                    </div>
                  )}
                </div>
              </div>

              {!state.selectedPack && (
                <div className="glass-card p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <CreditCard size={18} className="text-[#F97316]" />
                    <h3 className="text-white text-xl tracking-[0.06em]" style={{ fontFamily: "var(--font-display)" }}>
                      PAIEMENT SÉCURISÉ
                    </h3>
                    <div className="ml-auto flex items-center gap-1 text-[#3d5a90] text-xs">
                      <Lock size={11} />
                      <span>SSL 256-bit</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="section-label block mb-2">Numéro de carte</label>
                      <div className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-[#2a3f6a] text-sm flex justify-between items-center">
                        <span>&bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull;</span>
                        <div className="flex gap-2 items-center">
                          <span className="text-[#3d5a90] text-[0.6rem] tracking-wider uppercase">Visa</span>
                          <span className="text-[#3d5a90] text-[0.6rem] tracking-wider uppercase">MC</span>
                          <span className="text-[#3d5a90] text-[0.6rem] tracking-wider uppercase">Amex</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="section-label block mb-2">Expiration</label>
                        <div className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-[#2a3f6a] text-sm">MM / AA</div>
                      </div>
                      <div>
                        <label className="section-label block mb-2">CVC</label>
                        <div className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-[#2a3f6a] text-sm">&bull;&bull;&bull;</div>
                      </div>
                    </div>
                  </div>
                  <p className="text-[#2a3f6a] text-xs mt-5 flex items-center gap-1">
                    <Zap size={12} className="text-[#F97316]/50" />
                    Propulsé par Stripe. Vos données ne sont jamais stockées sur nos serveurs.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-center gap-1 text-[#F97316]">
                {[1,2,3,4,5].map((s) => <Star key={s} size={14} fill="#F97316" />)}
                <span className="text-[#6080b8] text-xs ml-2">Plus de 500 réservations confirmées</span>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-10 pt-8 border-t border-white/[0.06]">
            <button onClick={prevStep} disabled={state.step === 1}
              className={`flex items-center gap-2 text-sm transition-all ${
                state.step === 1 ? "opacity-0 pointer-events-none" : "text-[#6080b8] hover:text-white"
              }`}>
              <ChevronLeft size={16} />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", letterSpacing: "0.1em" }}>RETOUR</span>
            </button>

            {state.step < 4 ? (
              <button onClick={nextStep} disabled={!canAdvance}
                className={`flex items-center gap-2 transition-all duration-300 ${canAdvance ? "btn-neon" : "opacity-40 cursor-not-allowed btn-neon"}`}>
                Continuer
                <ChevronRight size={16} />
              </button>
            ) : (
              <button onClick={submitBooking} disabled={isSubmitting} className="btn-neon min-w-[180px]">
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Traitement…
                  </span>
                ) : state.selectedPack ? (
                  <>
                    <Clock size={15} />
                    Soumettre pour approbation
                  </>
                ) : (
                  <>
                    <Lock size={15} />
                    Payer {depositAmount}$ dépôt
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
