"use client";
import { useState, useCallback, useMemo } from "react";
import type { BookingState, PitchType, TimeSlot, BookingDetails } from "@/types/booking";
import { PITCHES, generateTimeSlots } from "@/lib/pitches";

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

  // ── Derived ────────────────────────────────────────────────────────────────
  const selectedPitchConfig = useMemo(
    () => PITCHES.find((p) => p.id === state.selectedPitch) ?? null,
    [state.selectedPitch]
  );

  const timeSlots = useMemo(() => {
    if (!state.selectedDate || !state.selectedPitch || !selectedPitchConfig) return [];
    return generateTimeSlots(state.selectedDate, state.selectedPitch, selectedPitchConfig.price);
  }, [state.selectedDate, state.selectedPitch, selectedPitchConfig]);

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
      selectedSlot: null, // reset slot when pitch changes
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
   * Simulates a Stripe checkout session creation.
   * In production: POST to /api/checkout → Stripe → redirect to Stripe hosted page.
   */
  const submitBooking = useCallback(async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((res) => setTimeout(res, 1800));
      setIsComplete(true);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

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
