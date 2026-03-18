"use client";
import { useState, useCallback, useMemo, useEffect } from "react";
import type { BookingState, PitchType, TimeSlot, BookingDetails, PackOption } from "@/types/booking";
import { PITCHES, generateTimeSlots } from "@/lib/pitches";
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

export function useBooking() {
  const [state, setState] = useState<BookingState>(INITIAL_STATE);
  const [details, setDetails] = useState<BookingDetails>(INITIAL_DETAILS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [bookedHours, setBookedHours] = useState<Set<string>>(new Set());
  const [packRequiresApproval, setPackRequiresApproval] = useState(false);

  const selectedPitchConfig = useMemo(
    () => PITCHES.find((p) => p.id === state.selectedPitch) ?? null,
    [state.selectedPitch]
  );

  // Fetch booked hours from Supabase when date/pitch changes
  useEffect(() => {
    if (!state.selectedDate || !state.selectedPitch) return;
    const dateStr = format(state.selectedDate, "yyyy-MM-dd");

    async function fetchBookedHours() {
      try {
        const { data } = await supabase
          .from("bookings")
          .select("time")
          .eq("date", dateStr)
          .neq("status", "cancelled");

        if (data) {
          setBookedHours(new Set(data.map((b: { time: string }) => b.time)));
        }
      } catch {
        setBookedHours(new Set());
      }
    }

    fetchBookedHours();
  }, [state.selectedDate, state.selectedPitch]);

  const timeSlots = useMemo(() => {
    if (!state.selectedDate || !state.selectedPitch || !selectedPitchConfig) return [];
    return generateTimeSlots(state.selectedDate, state.selectedPitch, selectedPitchConfig.price, bookedHours);
  }, [state.selectedDate, state.selectedPitch, selectedPitchConfig, bookedHours]);

  const totalHours = state.selectedSlots.length || (state.selectedSlot ? 1 : 0);

  const totalPrice = useMemo(() => {
    if (!selectedPitchConfig) return 0;
    return selectedPitchConfig.price * totalHours;
  }, [selectedPitchConfig, totalHours]);

  const depositAmount = useMemo(() => {
    return Math.round(totalPrice * 0.5);
  }, [totalPrice]);

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

  // Toggle a slot: add or remove from selectedSlots. Must be consecutive.
  const selectSlot = useCallback((slot: TimeSlot) => {
    setState((s) => {
      const existing = s.selectedSlots.find((sl) => sl.id === slot.id);
      if (existing) {
        // Remove this slot — only allow if it's at the start or end (keep consecutive)
        const filtered = s.selectedSlots.filter((sl) => sl.id !== slot.id);
        // Check if remaining are still consecutive
        if (filtered.length <= 1) {
          return { ...s, selectedSlots: filtered, selectedSlot: filtered[0] ?? null };
        }
        const sorted = [...filtered].sort((a, b) => a.time.localeCompare(b.time));
        let consecutive = true;
        for (let i = 1; i < sorted.length; i++) {
          const prevHr = parseInt(sorted[i - 1].time.split(":")[0], 10);
          const curHr = parseInt(sorted[i].time.split(":")[0], 10);
          if (curHr - prevHr !== 1) { consecutive = false; break; }
        }
        if (!consecutive) return s; // can't remove from middle
        return { ...s, selectedSlots: sorted, selectedSlot: sorted[0] };
      }

      // Adding a new slot — check it's consecutive with existing
      if (s.selectedSlots.length === 0) {
        return { ...s, selectedSlots: [slot], selectedSlot: slot };
      }

      const all = [...s.selectedSlots, slot].sort((a, b) => a.time.localeCompare(b.time));
      // Verify consecutiveness
      for (let i = 1; i < all.length; i++) {
        const prevHr = parseInt(all[i - 1].time.split(":")[0], 10);
        const curHr = parseInt(all[i].time.split(":")[0], 10);
        if (curHr - prevHr !== 1) {
          // Not consecutive — replace selection with just this slot
          return { ...s, selectedSlots: [slot], selectedSlot: slot };
        }
      }
      return { ...s, selectedSlots: all, selectedSlot: all[0] };
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
      // If a pack is selected, booking goes to "awaiting_approval" instead of "pending"
      const bookingStatus = hasPack ? "awaiting_approval" : "pending";

      // Insert one booking per selected hour
      for (const slot of state.selectedSlots) {
        const { error } = await supabase.from("bookings").insert({
          date: dateStr,
          time: slot.time,
          duration: 60,
          player_name: details.name,
          team_name: details.teamName || null,
          email: details.email,
          phone: details.phone,
          players: state.playerCount,
          price: selectedPitchConfig.price,
          deposit_paid: hasPack ? 0 : Math.round(selectedPitchConfig.price * 0.5),
          status: bookingStatus,
          notes: details.notes
            ? `${details.notes}${hasPack ? ` | Pack: ${state.selectedPack}` : ""}`
            : hasPack ? `Pack: ${state.selectedPack}` : null,
        });

        if (error) {
          console.error("Booking error:", error);
        }
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
  }, [selectedPitchConfig, state.selectedDate, state.selectedSlots, state.selectedPack, state.playerCount, details]);

  return {
    state,
    details,
    isSubmitting,
    isComplete,
    packRequiresApproval,
    selectedPitchConfig,
    selectedPackConfig,
    timeSlots,
    totalHours,
    totalPrice,
    depositAmount,
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
