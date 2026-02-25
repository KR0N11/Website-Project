"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Clock,
  Users,
  CreditCard,
  Lock,
  Star,
  Zap,
} from "lucide-react";
import { format } from "date-fns";
import { useBooking } from "@/hooks/useBooking";
import BookingCalendar from "@/components/BookingCalendar";
import type { PitchType } from "@/types/booking";

gsap.registerPlugin(ScrollTrigger);

const STEP_LABELS = ["Pitch", "Date & Time", "Details", "Payment"];

export default function Booking() {
  const sectionRef = useRef<HTMLElement>(null);
  const {
    state,
    details,
    isSubmitting,
    isComplete,
    selectedPitchConfig,
    timeSlots,
    depositAmount,
    canAdvance,
    pitches,
    selectPitch,
    selectDate,
    selectSlot,
    updateDetail,
    nextStep,
    prevStep,
    reset,
    submitBooking,
  } = useBooking();

  // Scroll-triggered entry
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".booking-header", {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: "expo.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });
      gsap.from(".booking-panel", {
        opacity: 0,
        y: 60,
        duration: 0.9,
        ease: "expo.out",
        delay: 0.15,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // ── Success screen ────────────────────────────────────────────────────────
  if (isComplete) {
    return (
      <section ref={sectionRef} id="booking" className="py-32 px-6">
        <div className="max-w-lg mx-auto text-center glass-card p-14">
          <div className="w-20 h-20 rounded-full bg-[#39ff14]/10 border border-[#39ff14]/30 flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={40} className="text-[#39ff14]" />
          </div>
          <h2
            className="text-white text-5xl mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            BOOKING CONFIRMED
          </h2>
          <p className="text-[#8888a0] mb-3">
            Confirmation sent to <strong className="text-white">{details.email}</strong>
          </p>
          {selectedPitchConfig && state.selectedDate && state.selectedSlot && (
            <div className="glass-card p-5 mt-8 mb-8 text-left space-y-3">
              <div className="flex justify-between">
                <span className="text-[#5a5a72] text-sm">Pitch</span>
                <span className="text-white text-sm">{selectedPitchConfig.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5a5a72] text-sm">Date</span>
                <span className="text-white text-sm">
                  {format(state.selectedDate, "EEE, dd MMM yyyy")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5a5a72] text-sm">Time</span>
                <span className="text-white text-sm">{state.selectedSlot.label}</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-3">
                <span className="text-[#5a5a72] text-sm">Deposit Paid</span>
                <span className="text-[#39ff14] font-semibold">£{depositAmount}</span>
              </div>
            </div>
          )}
          <button onClick={reset} className="btn-ghost w-full justify-center">
            Book Another Pitch
          </button>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} id="booking" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="booking-header text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-8 h-px bg-[#39ff14]" />
            <span className="section-label">Real-Time Availability</span>
            <div className="w-8 h-px bg-[#39ff14]" />
          </div>
          <h2
            className="text-white leading-none mb-4"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(3rem, 8vw, 6rem)",
            }}
          >
            BOOK YOUR PITCH
          </h2>
          <p className="text-[#5a5a72] max-w-md mx-auto">
            Reserve your slot in under 2 minutes. 50% deposit secures your booking.
          </p>
        </div>

        {/* Progress stepper */}
        <div className="booking-panel max-w-4xl mx-auto mb-10">
          <div className="flex items-center justify-between mb-12">
            {STEP_LABELS.map((label, i) => {
              const step = (i + 1) as 1 | 2 | 3 | 4;
              const active    = state.step === step;
              const completed = state.step > step;
              return (
                <div key={label} className="flex items-center gap-2 flex-1">
                  <div className={`flex items-center gap-2 ${i < STEP_LABELS.length - 1 ? "flex-1" : ""}`}>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 transition-all duration-300 ${
                        completed
                          ? "bg-[#39ff14] text-[#07070e]"
                          : active
                          ? "border-2 border-[#39ff14] text-[#39ff14]"
                          : "border border-white/20 text-[#5a5a72]"
                      }`}
                    >
                      {completed ? <CheckCircle2 size={16} /> : step}
                    </div>
                    <span
                      className={`text-xs uppercase tracking-widest hidden sm:block ${
                        active ? "text-white" : "text-[#5a5a72]"
                      }`}
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {label}
                    </span>
                  </div>
                  {i < STEP_LABELS.length - 1 && (
                    <div
                      className={`flex-1 h-px mx-3 transition-all duration-500 ${
                        completed ? "bg-[#39ff14]/50" : "bg-white/10"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Step 1: Select Pitch ──────────────────────────────────────── */}
          {state.step === 1 && (
            <div className="grid md:grid-cols-3 gap-6">
              {pitches.map((pitch) => {
                const selected = state.selectedPitch === pitch.id;
                return (
                  <button
                    key={pitch.id}
                    onClick={() => selectPitch(pitch.id as PitchType)}
                    className={`glass-card p-0 overflow-hidden text-left transition-all duration-300 group ${
                      selected
                        ? "border-[#39ff14]/50 shadow-[0_0_30px_rgba(57,255,20,0.15)]"
                        : "hover:border-white/20"
                    }`}
                  >
                    {/* Pitch image */}
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={pitch.image}
                        alt={pitch.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#07070e] via-transparent to-transparent" />
                      {selected && (
                        <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[#39ff14] flex items-center justify-center">
                          <CheckCircle2 size={14} className="text-[#07070e]" />
                        </div>
                      )}
                      <div className="absolute bottom-3 left-3">
                        <span
                          className="text-[#39ff14] text-sm"
                          style={{ fontFamily: "var(--font-mono)" }}
                        >
                          {pitch.capacity}
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3
                        className="text-white text-2xl mb-1"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {pitch.name}
                      </h3>
                      <p className="text-[#5a5a72] text-sm mb-4 leading-relaxed">
                        {pitch.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-5">
                        {pitch.features.map((f) => (
                          <span
                            key={f}
                            className="text-[#8888a0] text-xs px-2 py-0.5 rounded border border-white/10"
                          >
                            {f}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-[#39ff14] text-2xl font-semibold">
                            £{pitch.price}
                          </span>
                          <span className="text-[#5a5a72] text-sm"> / hour</span>
                        </div>
                        <span className="text-[#5a5a72] text-xs">{pitch.surface}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* ── Step 2: Date & Time ───────────────────────────────────────── */}
          {state.step === 2 && (
            <div className="grid md:grid-cols-2 gap-8">
              <BookingCalendar selected={state.selectedDate} onSelect={selectDate} />

              {/* Time slots */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Clock size={16} className="text-[#39ff14]" />
                  <h3
                    className="text-white text-lg tracking-[0.06em]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {state.selectedDate
                      ? format(state.selectedDate, "EEE, dd MMM").toUpperCase()
                      : "SELECT A DATE"}
                  </h3>
                </div>

                {!state.selectedDate ? (
                  <p className="text-[#5a5a72] text-sm text-center py-16">
                    Pick a date on the calendar to see available slots
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto no-scrollbar pr-1">
                    {timeSlots.map((slot) => {
                      const isSelected = state.selectedSlot?.id === slot.id;
                      return (
                        <button
                          key={slot.id}
                          disabled={!slot.available}
                          onClick={() => slot.available && selectSlot(slot)}
                          className={`px-4 py-3 rounded-lg text-sm transition-all duration-200 flex justify-between items-center ${
                            !slot.available
                              ? "opacity-30 cursor-not-allowed text-[#5a5a72]"
                              : isSelected
                              ? "bg-[#39ff14] text-[#07070e] font-semibold shadow-[0_0_12px_rgba(57,255,20,0.35)]"
                              : "border border-white/10 text-[#b8b8c3] hover:border-white/30 hover:text-white"
                          }`}
                        >
                          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>
                            {slot.label}
                          </span>
                          <span className={`text-xs ${isSelected ? "text-[#07070e]/70" : "text-[#5a5a72]"}`}>
                            £{slot.price}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Selected summary */}
                {state.selectedSlot && (
                  <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[#8888a0] text-sm">Selected</span>
                    <div className="text-right">
                      <div
                        className="text-[#39ff14] text-lg"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {state.selectedSlot.label}
                      </div>
                      <div className="text-[#5a5a72] text-xs">£{state.selectedSlot.price} / hr</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Step 3: Player Details ────────────────────────────────────── */}
          {state.step === 3 && (
            <div className="glass-card p-8 max-w-xl mx-auto">
              <div className="flex items-center gap-2 mb-8">
                <Users size={18} className="text-[#39ff14]" />
                <h3
                  className="text-white text-xl tracking-[0.06em]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  YOUR DETAILS
                </h3>
              </div>

              <div className="space-y-5">
                {[
                  { field: "name",     label: "Full Name",    type: "text",  placeholder: "Alex Johnson"         },
                  { field: "email",    label: "Email",        type: "email", placeholder: "alex@arena.fc"        },
                  { field: "phone",    label: "Phone",        type: "tel",   placeholder: "+44 7700 000000"      },
                  { field: "teamName", label: "Team Name",    type: "text",  placeholder: "FC Night Wolves"      },
                  { field: "notes",    label: "Notes",        type: "text",  placeholder: "Any special requests" },
                ].map(({ field, label, type, placeholder }) => (
                  <div key={field}>
                    <label
                      className="block text-[#8888a0] text-xs tracking-widest uppercase mb-2"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {label}
                      {["name", "email", "phone"].includes(field) && (
                        <span className="text-[#39ff14] ml-1">*</span>
                      )}
                    </label>
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={details[field as keyof typeof details]}
                      onChange={(e) =>
                        updateDetail(field as keyof typeof details, e.target.value)
                      }
                      className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-[#3d3d55] focus:outline-none focus:border-[#39ff14]/50 focus:bg-white/[0.06] transition-all text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 4: Payment ───────────────────────────────────────────── */}
          {state.step === 4 && (
            <div className="max-w-xl mx-auto space-y-6">
              {/* Booking summary */}
              <div className="glass-card p-6">
                <h3
                  className="text-white text-xl mb-5 tracking-[0.06em]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  BOOKING SUMMARY
                </h3>
                <div className="space-y-3 text-sm">
                  {[
                    { label: "Pitch",  value: selectedPitchConfig?.name ?? "—" },
                    { label: "Date",   value: state.selectedDate ? format(state.selectedDate, "EEE, dd MMM yyyy") : "—" },
                    { label: "Time",   value: state.selectedSlot?.label ?? "—" },
                    { label: "Player", value: details.name },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between">
                      <span className="text-[#5a5a72]">{label}</span>
                      <span className="text-white">{value}</span>
                    </div>
                  ))}
                  <div className="pt-4 mt-4 border-t border-white/10 flex justify-between items-baseline">
                    <span className="text-[#8888a0]">Full Price</span>
                    <span className="text-white">£{selectedPitchConfig?.price ?? 0}</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-[#39ff14] font-medium">Deposit Due (50%)</span>
                    <span className="text-[#39ff14] text-xl font-semibold">£{depositAmount}</span>
                  </div>
                </div>
              </div>

              {/* Stripe mockup */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-5">
                  <CreditCard size={18} className="text-[#39ff14]" />
                  <h3
                    className="text-white text-xl tracking-[0.06em]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    PAYMENT
                  </h3>
                  <div className="ml-auto flex items-center gap-1 text-[#5a5a72] text-xs">
                    <Lock size={11} />
                    <span>SSL Secured</span>
                  </div>
                </div>

                {/* Card input mockup */}
                <div className="space-y-4">
                  <div>
                    <label className="section-label block mb-2">Card Number</label>
                    <div className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-[#3d3d55] text-sm flex justify-between items-center">
                      <span>•••• •••• •••• ••••</span>
                      <div className="flex gap-1">
                        {["visa", "mc", "amex"].map((c) => (
                          <div
                            key={c}
                            className="w-8 h-5 rounded bg-white/10 border border-white/10"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="section-label block mb-2">Expiry</label>
                      <div className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-[#3d3d55] text-sm">
                        MM / YY
                      </div>
                    </div>
                    <div>
                      <label className="section-label block mb-2">CVC</label>
                      <div className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-[#3d3d55] text-sm">
                        •••
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-[#3d3d55] text-xs mt-5 flex items-center gap-1">
                  <Zap size={12} className="text-[#39ff14]/50" />
                  Powered by Stripe. Card details are never stored on our servers.
                </p>
              </div>

              {/* Ratings */}
              <div className="flex items-center justify-center gap-1 text-[#39ff14]">
                {[1,2,3,4,5].map((s) => <Star key={s} size={14} fill="#39ff14" />)}
                <span className="text-[#8888a0] text-xs ml-2">
                  Trusted by 2,400+ players
                </span>
              </div>
            </div>
          )}

          {/* ── Navigation buttons ────────────────────────────────────────── */}
          <div className="flex items-center justify-between mt-10 pt-8 border-t border-white/[0.06]">
            <button
              onClick={prevStep}
              disabled={state.step === 1}
              className={`flex items-center gap-2 text-sm transition-all ${
                state.step === 1
                  ? "opacity-0 pointer-events-none"
                  : "text-[#8888a0] hover:text-white"
              }`}
            >
              <ChevronLeft size={16} />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", letterSpacing: "0.1em" }}>
                BACK
              </span>
            </button>

            {state.step < 4 ? (
              <button
                onClick={nextStep}
                disabled={!canAdvance}
                className={`flex items-center gap-2 transition-all duration-300 ${
                  canAdvance ? "btn-neon" : "opacity-40 cursor-not-allowed btn-neon"
                }`}
              >
                Continue
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={submitBooking}
                disabled={isSubmitting}
                className="btn-neon min-w-[180px]"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Processing…
                  </span>
                ) : (
                  <>
                    <Lock size={15} />
                    Pay £{depositAmount} Deposit
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
