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
  selectedDuration: 1,
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
          .select("time, duration")
          .eq("date", dateStr)
          .neq("status", "cancelled");

        if (data) {
          const hours = new Set<string>();
          for (const b of data as { time: string; duration: number }[]) {
            const startHour = parseInt(b.time.split(":")[0], 10);
            const durationHours = Math.ceil((b.duration || 60) / 60);
            for (let i = 0; i < durationHours; i++) {
              hours.add(`${String(startHour + i).padStart(2, "0")}:00`);
            }
          }
          setBookedHours(hours);
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

  const totalPrice = useMemo(() => {
    if (!selectedPitchConfig) return 0;
    return selectedPitchConfig.price * state.selectedDuration;
  }, [selectedPitchConfig, state.selectedDuration]);

  const selectedPackConfig = useMemo(
    () => PACKS.find((p) => p.id === state.selectedPack) ?? null,
    [state.selectedPack]
  );

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
    setState((s) => ({ ...s, selectedPitch: pitchId, selectedSlot: null }));
  }, []);

  const selectDate = useCallback((date: Date) => {
    setState((s) => ({ ...s, selectedDate: date, selectedSlot: null }));
  }, []);

  const selectSlot = useCallback((slot: TimeSlot) => {
    setState((s) => ({ ...s, selectedSlot: slot }));
  }, []);

  const selectDuration = useCallback((hours: number) => {
    setState((s) => ({ ...s, selectedDuration: hours, selectedSlot: null }));
  }, []);

  const selectPack = useCallback((packId: string | null) => {
    setState((s) => ({ ...s, selectedPack: packId }));
  }, []);

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
  }, []);

  const submitBooking = useCallback(async () => {
    if (!selectedPitchConfig || !state.selectedDate || !state.selectedSlot) return;
    setIsSubmitting(true);
    try {
      const dateStr = format(state.selectedDate, "yyyy-MM-dd");
      const durationMinutes = state.selectedDuration * 60;
      const price = totalPrice;

      const bookingData = {
        date: dateStr,
        time: state.selectedSlot.time,
        duration: durationMinutes,
        player_name: details.name,
        team_name: details.teamName || null,
        email: details.email,
        phone: details.phone,
        players: state.playerCount,
        price,
        deposit_paid: 0,
        status: "pending" as const,
        notes: [
          details.notes,
          state.selectedPack ? `Pack: ${selectedPackConfig?.name}` : null,
          state.selectedDuration > 1 ? `Durée: ${state.selectedDuration}h` : null,
        ].filter(Boolean).join(" | ") || null,
      };

      const { error } = await supabase.from("bookings").insert(bookingData);

      if (error) {
        console.error("Booking error:", error);
      }

      // Send confirmation email
      try {
        await fetch("/api/send-confirmation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            playerName: details.name,
            email: details.email,
            phone: details.phone,
            teamName: details.teamName,
            pitchName: selectedPitchConfig.name,
            date: dateStr,
            time: state.selectedSlot.label,
            duration: state.selectedDuration,
            price,
            pack: selectedPackConfig?.name ?? null,
            notes: details.notes || null,
          }),
        });
      } catch (emailErr) {
        console.error("Email error:", emailErr);
      }

      setIsComplete(true);
    } catch (err) {
      console.error("Booking error:", err);
      setIsComplete(true);
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedPitchConfig, selectedPackConfig, state.selectedDate, state.selectedSlot, state.selectedDuration, state.selectedPack, state.playerCount, details, totalPrice]);

  return {
    state,
    details,
    isSubmitting,
    isComplete,
    selectedPitchConfig,
    selectedPackConfig,
    timeSlots,
    totalPrice,
    canAdvance,
    pitches: PITCHES,
    packs: PACKS,
    selectPitch,
    selectDate,
    selectSlot,
    selectDuration,
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
