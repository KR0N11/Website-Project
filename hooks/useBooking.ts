"use client";
import { useState, useCallback, useMemo, useEffect } from "react";
import type { BookingState, PitchType, TimeSlot, BookingDetails } from "@/types/booking";
import { PITCHES, generateTimeSlots } from "@/lib/pitches";
import { format } from "date-fns";

const INITIAL_STATE: BookingState = {
  selectedDate: null,
  selectedPitch: null,
  selectedSlot: null,
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

  // ── Derived ────────────────────────────────────────────────────────────────
  const selectedPitchConfig = useMemo(
    () => PITCHES.find((p) => p.id === state.selectedPitch) ?? null,
    [state.selectedPitch]
  );

  // Fetch booked hours from DB whenever pitch+date changes
  useEffect(() => {
    if (!state.selectedDate || !state.selectedPitch) {
      setBookedHours(new Set());
      return;
    }
    const dateStr = format(state.selectedDate, "yyyy-MM-dd");
    fetch("/api/bookings")
      .then((r) => r.json())
      .then((all: Array<{ pitchId: string; date: string; time: string; status: string }>) => {
        const hours = new Set(
          all
            .filter(
              (b) =>
                b.pitchId === state.selectedPitch &&
                b.date === dateStr &&
                b.status !== "cancelled",
            )
            .map((b) => b.time),
        );
        setBookedHours(hours);
      })
      .catch(() => setBookedHours(new Set()));
  }, [state.selectedDate, state.selectedPitch]);

  const timeSlots = useMemo(() => {
    if (!state.selectedDate || !state.selectedPitch || !selectedPitchConfig) return [];
    return generateTimeSlots(state.selectedDate, state.selectedPitch, selectedPitchConfig.price, bookedHours);
  }, [state.selectedDate, state.selectedPitch, selectedPitchConfig, bookedHours]);

  const depositAmount = useMemo(() => {
    if (!selectedPitchConfig) return 0;
    return Math.round(selectedPitchConfig.price * 0.5);
  }, [selectedPitchConfig]);

  const canAdvance = useMemo(() => {
    switch (state.step) {
      case 1: return !!state.selectedPitch;
      case 2: return !!state.selectedDate && !!state.selectedSlot;
      case 3: return !!details.name && !!details.email && !!details.phone;
      case 4: return true;
      default: return false;
    }
  }, [state.step, state.selectedPitch, state.selectedDate, state.selectedSlot, details]);

  // ── Mutations ──────────────────────────────────────────────────────────────
  const selectPitch = useCallback((pitchId: PitchType) => {
    setState((s) => ({
      ...s,
      selectedPitch: pitchId,
      selectedSlot: null,
    }));
  }, []);

  const selectDate = useCallback((date: Date) => {
    setState((s) => ({ ...s, selectedDate: date, selectedSlot: null }));
  }, []);

  const selectSlot = useCallback((slot: TimeSlot) => {
    setState((s) => ({ ...s, selectedSlot: slot }));
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

  /**
   * Creates a booking in the DB and redirects to Stripe hosted checkout.
   * On success: Stripe redirects to /booking/success
   * On cancel:  Stripe redirects to /booking/cancel
   */
  const submitBooking = useCallback(async () => {
    if (!selectedPitchConfig || !state.selectedDate || !state.selectedSlot) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pitchId: state.selectedPitch,
          pitchName: selectedPitchConfig.name,
          date: format(state.selectedDate, "yyyy-MM-dd"),
          time: state.selectedSlot.time,
          timeLabel: state.selectedSlot.label,
          playerName: details.name,
          teamName: details.teamName,
          email: details.email,
          phone: details.phone,
          players: state.playerCount,
          priceFull: selectedPitchConfig.price,
          depositPaid: depositAmount,
        }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error ?? "Checkout failed");
      }

      const { url } = await res.json();
      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      console.error("submitBooking error:", err);
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedPitchConfig, state.selectedDate, state.selectedSlot, state.selectedPitch,
      state.playerCount, details, depositAmount]);

  return {
    // State
    state,
    details,
    isSubmitting,
    isComplete,
    // Derived
    selectedPitchConfig,
    timeSlots,
    depositAmount,
    canAdvance,
    pitches: PITCHES,
    // Actions
    selectPitch,
    selectDate,
    selectSlot,
    setPlayerCount,
    updateDetail,
    nextStep,
    prevStep,
    goToStep,
    reset,
    submitBooking,
  };
}
