"use client";
import { useState, useCallback, useMemo, useEffect } from "react";
import type { BookingState, PitchType, TimeSlot, BookingDetails, PackOption } from "@/types/booking";
import { PITCHES, SLOT_TIMES, MAX_SLOTS, generateTimeSlots, getPriceForDuration, getCategoryLabel } from "@/lib/pitches";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";

const PACKS: PackOption[] = [
  { id: "pack-fete", name: "Pack Fête", features: ["90 min de jeu sur terrain", "Salle privée avec collations", "Console PS5 & FIFA incluse", "Breuvages et gâteau offerts"], is_popular: false },
  { id: "pack-entreprise", name: "Pack Entreprise", features: ["2h de terrain réservé", "Arbitre certifié inclus", "Salon VIP & vestiaires privés", "Facturation corporative disponible"], is_popular: true },
  { id: "pack-tournoi", name: "Pack Tournoi", features: ["Créneaux multi-terrains flexibles", "Gestion complète des tableaux", "Arbitrage professionnel", "Trophées et prix remis sur place"], is_popular: false },
];

const INITIAL_STATE: BookingState = {
  selectedDate: null,
  selectedPitch: null,
  selectedSlot: null,
  selectedSlots: [],
  selectedPack: null,
  playerCount: 10,
  step: 1,
};

const INITIAL_DETAILS: BookingDetails = {
  name: "",
  email: "",
  phone: "",
  teamName: "",
  notes: "",
};

function slotTimeIndex(time: string): number {
  return SLOT_TIMES.indexOf(time);
}

export function useBooking() {
  const [state, setState] = useState<BookingState>(INITIAL_STATE);
  const [details, setDetails] = useState<BookingDetails>(INITIAL_DETAILS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<Set<string>>(new Set());
  const [packRequiresApproval, setPackRequiresApproval] = useState(false);

  const selectedPitchConfig = useMemo(
    () => PITCHES.find((p) => p.id === state.selectedPitch) ?? null,
    [state.selectedPitch]
  );

  // Fetch booked slots from Supabase when date/pitch changes
  useEffect(() => {
    if (!state.selectedDate || !state.selectedPitch) return;
    const dateStr = format(state.selectedDate, "yyyy-MM-dd");

    async function fetchBookedSlots() {
      try {
        const { data } = await supabase
          .from("bookings")
          .select("time, duration")
          .eq("date", dateStr)
          .neq("status", "cancelled");

        if (data) {
          const allBooked = new Set<string>();
          for (const b of data as { time: string; duration: number }[]) {
            const slots = Math.ceil((b.duration || 30) / 30);
            const [hr, min] = b.time.split(":").map(Number);
            let totalMin = hr * 60 + min;
            for (let i = 0; i < slots; i++) {
              const h = Math.floor(totalMin / 60);
              const m = totalMin % 60;
              allBooked.add(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
              totalMin += 30;
            }
          }
          setBookedSlots(allBooked);
        }
      } catch {
        setBookedSlots(new Set());
      }
    }

    fetchBookedSlots();
  }, [state.selectedDate, state.selectedPitch]);

  const timeSlots = useMemo(() => {
    if (!state.selectedDate || !state.selectedPitch) return [];
    return generateTimeSlots(state.selectedDate, state.selectedPitch, bookedSlots);
  }, [state.selectedDate, state.selectedPitch, bookedSlots]);

  // Duration in minutes based on number of selected slots
  const totalDuration = state.selectedSlots.length * 30;

  // Price based on total duration and first slot's category
  const totalPrice = useMemo(() => {
    if (state.selectedSlots.length === 0) return 0;
    const category = state.selectedSlots[0].category;
    return getPriceForDuration(totalDuration, category);
  }, [state.selectedSlots, totalDuration]);

  const depositAmount = useMemo(() => {
    return Math.round(totalPrice * 0.5);
  }, [totalPrice]);

  const priceCategory = useMemo(() => {
    if (state.selectedSlots.length === 0) return "";
    return getCategoryLabel(state.selectedSlots[0].category);
  }, [state.selectedSlots]);

  // End time label
  const endTimeLabel = useMemo(() => {
    if (state.selectedSlots.length === 0) return "";
    const sorted = [...state.selectedSlots].sort((a, b) => a.time.localeCompare(b.time));
    const last = sorted[sorted.length - 1];
    const [hr, min] = last.time.split(":").map(Number);
    const totalMin = hr * 60 + min + 30;
    const endHr = Math.floor(totalMin / 60);
    const endMin = totalMin % 60;
    return `${endHr}h${String(endMin).padStart(2, "0")}`;
  }, [state.selectedSlots]);

  // Start time label
  const startTimeLabel = useMemo(() => {
    if (state.selectedSlots.length === 0) return "";
    const sorted = [...state.selectedSlots].sort((a, b) => a.time.localeCompare(b.time));
    return sorted[0].label;
  }, [state.selectedSlots]);

  const canAdvance = useMemo(() => {
    switch (state.step) {
      case 1: return !!state.selectedPitch;
      case 2: return !!state.selectedDate && state.selectedSlots.length > 0;
      case 3: return !!details.name && !!details.email && !!details.phone;
      case 4: return true;
      default: return false;
    }
  }, [state.step, state.selectedPitch, state.selectedDate, state.selectedSlots.length, details]);

  const selectPitch = useCallback((pitchId: PitchType) => {
    setState((s) => ({ ...s, selectedPitch: pitchId, selectedSlot: null, selectedSlots: [] }));
  }, []);

  const selectDate = useCallback((date: Date) => {
    setState((s) => ({ ...s, selectedDate: date, selectedSlot: null, selectedSlots: [] }));
  }, []);

  // Multi-slot selection: click to set start, click again to set end (auto-fills range)
  const selectSlot = useCallback((slot: TimeSlot, allSlots?: TimeSlot[]) => {
    setState((s) => {
      const slotIdx = slotTimeIndex(slot.time);

      // Already selected? Deselect
      const idx = s.selectedSlots.findIndex((sl) => sl.id === slot.id);
      if (idx !== -1) {
        if (s.selectedSlots.length === 1) {
          return { ...s, selectedSlot: null, selectedSlots: [] };
        }
        // Remove from edge only
        if (idx === 0 || idx === s.selectedSlots.length - 1) {
          const updated = s.selectedSlots.filter((_, i) => i !== idx);
          return { ...s, selectedSlots: updated, selectedSlot: updated[0] };
        }
        return s;
      }

      // No slots yet — start fresh
      if (s.selectedSlots.length === 0) {
        return { ...s, selectedSlots: [slot], selectedSlot: slot };
      }

      // Build a range from first selected to clicked slot (or clicked to first)
      const sorted = [...s.selectedSlots].sort((a, b) => a.time.localeCompare(b.time));
      const firstIdx = slotTimeIndex(sorted[0].time);
      const startIdx = Math.min(firstIdx, slotIdx);
      const endIdx = Math.max(firstIdx, slotIdx);
      const rangeLength = endIdx - startIdx + 1;

      // If range exceeds max, start fresh with just this slot
      if (rangeLength > MAX_SLOTS) {
        return { ...s, selectedSlots: [slot], selectedSlot: slot };
      }

      // Auto-fill the range using the available timeSlots
      const slotsSource = allSlots || [];
      const rangeSlots: TimeSlot[] = [];
      for (let i = startIdx; i <= endIdx; i++) {
        const time = SLOT_TIMES[i];
        if (!time) break;
        const found = slotsSource.find((sl) => sl.time === time);
        if (found && found.available) {
          rangeSlots.push(found);
        } else {
          // Gap has unavailable slot — start fresh
          return { ...s, selectedSlots: [slot], selectedSlot: slot };
        }
      }

      return { ...s, selectedSlots: rangeSlots, selectedSlot: rangeSlots[0] };
    });
  }, []);

  const selectPack = useCallback((packId: string | null) => {
    setState((s) => ({ ...s, selectedPack: s.selectedPack === packId ? null : packId }));
  }, []);

  const selectedPackConfig = useMemo(
    () => PACKS.find((p) => p.id === state.selectedPack) ?? null,
    [state.selectedPack]
  );

  const setPlayerCount = useCallback((n: number) => {
    setState((s) => ({ ...s, playerCount: n }));
  }, []);

  const updateDetail = useCallback(
    (field: keyof BookingDetails, value: string) => {
      setDetails((d) => ({ ...d, [field]: value }));
    },
    []
  );

  const nextStep = useCallback(() => {
    if (!canAdvance) return;
    setState((s) => ({ ...s, step: Math.min(4, s.step + 1) as BookingState["step"] }));
  }, [canAdvance]);

  const prevStep = useCallback(() => {
    setState((s) => ({ ...s, step: Math.max(1, s.step - 1) as BookingState["step"] }));
  }, []);

  const goToStep = useCallback((step: BookingState["step"]) => {
    setState((s) => ({ ...s, step }));
  }, []);

  const reset = useCallback(() => {
    setState(INITIAL_STATE);
    setDetails(INITIAL_DETAILS);
    setIsComplete(false);
    setPackRequiresApproval(false);
  }, []);

  const submitBooking = useCallback(async () => {
    if (!selectedPitchConfig || !state.selectedDate || state.selectedSlots.length === 0) return;
    setIsSubmitting(true);
    try {
      const dateStr = format(state.selectedDate, "yyyy-MM-dd");
      const hasPack = !!state.selectedPack;
      const bookingStatus = hasPack ? "awaiting_approval" : "pending";
      const sorted = [...state.selectedSlots].sort((a, b) => a.time.localeCompare(b.time));

      const { error } = await supabase.from("bookings").insert({
        date: dateStr,
        time: sorted[0].time,
        duration: totalDuration,
        player_name: details.name,
        team_name: details.teamName || null,
        email: details.email,
        phone: details.phone,
        players: state.playerCount,
        price: totalPrice,
        deposit_paid: hasPack ? 0 : depositAmount,
        status: bookingStatus,
        notes: details.notes
          ? `${details.notes}${hasPack ? ` | Pack: ${state.selectedPack}` : ""}`
          : hasPack ? `Pack: ${state.selectedPack}` : null,
      });

      if (error) {
        console.error("Booking error:", error);
      }

      if (hasPack) {
        setPackRequiresApproval(true);
      }
      setIsComplete(true);
    } catch (err) {
      console.error("Booking error:", err);
      setIsComplete(true);
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedPitchConfig, state.selectedDate, state.selectedSlots, state.selectedPack, state.playerCount, details, totalPrice, depositAmount, totalDuration]);

  return {
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
    pitches: PITCHES,
    packs: PACKS,
    selectPitch,
    selectDate,
    selectSlot,
    selectPack,
    setPlayerCount,
    updateDetail,
    nextStep,
    prevStep,
    goToStep,
    reset,
    submitBooking,
  };
}
