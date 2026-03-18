"use client";
import { useState, useCallback, useMemo, useEffect } from "react";
import type { BookingState, PitchType, TimeSlot, BookingDetails, PackOption, Duration } from "@/types/booking";
import { PITCHES, DURATIONS, generateTimeSlots, getPrice, getPriceCategory, getCategoryLabel } from "@/lib/pitches";
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
  selectedDuration: 60,
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
          .select("time")
          .eq("date", dateStr)
          .neq("status", "cancelled");

        if (data) {
          setBookedSlots(new Set(data.map((b: { time: string }) => b.time)));
        }
      } catch {
        setBookedSlots(new Set());
      }
    }

    fetchBookedSlots();
  }, [state.selectedDate, state.selectedPitch]);

  const timeSlots = useMemo(() => {
    if (!state.selectedDate || !state.selectedPitch) return [];
    return generateTimeSlots(state.selectedDate, state.selectedPitch, state.selectedDuration, bookedSlots);
  }, [state.selectedDate, state.selectedPitch, state.selectedDuration, bookedSlots]);

  // Price is determined by duration + category of selected slot (or first available)
  const totalPrice = useMemo(() => {
    if (!state.selectedSlot || !state.selectedDate) return 0;
    return getPrice(state.selectedDuration, state.selectedSlot.category);
  }, [state.selectedSlot, state.selectedDate, state.selectedDuration]);

  const depositAmount = useMemo(() => {
    return Math.round(totalPrice * 0.5);
  }, [totalPrice]);

  // Price category label for display
  const priceCategory = useMemo(() => {
    if (!state.selectedSlot) return "";
    return getCategoryLabel(state.selectedSlot.category);
  }, [state.selectedSlot]);

  const canAdvance = useMemo(() => {
    switch (state.step) {
      case 1: return !!state.selectedPitch;
      case 2: return !!state.selectedDate && !!state.selectedSlot;
      case 3: return !!details.name && !!details.email && !!details.phone;
      case 4: return true;
      default: return false;
    }
  }, [state.step, state.selectedPitch, state.selectedDate, state.selectedSlot, details]);

  const selectPitch = useCallback((pitchId: PitchType) => {
    setState((s) => ({ ...s, selectedPitch: pitchId, selectedSlot: null, selectedSlots: [] }));
  }, []);

  const selectDate = useCallback((date: Date) => {
    setState((s) => ({ ...s, selectedDate: date, selectedSlot: null, selectedSlots: [] }));
  }, []);

  const selectDuration = useCallback((duration: Duration) => {
    setState((s) => ({ ...s, selectedDuration: duration, selectedSlot: null, selectedSlots: [] }));
  }, []);

  // Single start-time selection (duration determines the block)
  const selectSlot = useCallback((slot: TimeSlot) => {
    setState((s) => {
      if (s.selectedSlot?.id === slot.id) {
        return { ...s, selectedSlot: null, selectedSlots: [] };
      }
      return { ...s, selectedSlot: slot, selectedSlots: [slot] };
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

  // Format end time from start time + duration
  const endTimeLabel = useMemo(() => {
    if (!state.selectedSlot) return "";
    const [hr, min] = state.selectedSlot.time.split(":").map(Number);
    const totalMin = hr * 60 + min + state.selectedDuration;
    const endHr = Math.floor(totalMin / 60);
    const endMin = totalMin % 60;
    return `${endHr}h${String(endMin).padStart(2, "0")}`;
  }, [state.selectedSlot, state.selectedDuration]);

  const submitBooking = useCallback(async () => {
    if (!selectedPitchConfig || !state.selectedDate || !state.selectedSlot) return;
    setIsSubmitting(true);
    try {
      const dateStr = format(state.selectedDate, "yyyy-MM-dd");
      const hasPack = !!state.selectedPack;
      const bookingStatus = hasPack ? "awaiting_approval" : "pending";

      const { error } = await supabase.from("bookings").insert({
        date: dateStr,
        time: state.selectedSlot.time,
        duration: state.selectedDuration,
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
  }, [selectedPitchConfig, state.selectedDate, state.selectedSlot, state.selectedDuration, state.selectedPack, state.playerCount, details, totalPrice, depositAmount]);

  return {
    state,
    details,
    isSubmitting,
    isComplete,
    packRequiresApproval,
    selectedPitchConfig,
    selectedPackConfig,
    timeSlots,
    totalPrice,
    depositAmount,
    priceCategory,
    endTimeLabel,
    canAdvance,
    pitches: PITCHES,
    packs: PACKS,
    durations: DURATIONS,
    selectPitch,
    selectDate,
    selectDuration,
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
