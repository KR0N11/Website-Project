"use client";
import { useState, useCallback, useMemo, useEffect } from "react";
import type { BookingState, PitchType, TimeSlot, BookingDetails } from "@/types/booking";
import { PITCHES, generateTimeSlots } from "@/lib/pitches";
import { supabase } from "@/lib/supabase";
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

  const selectPitch = useCallback((pitchId: PitchType) => {
    setState((s) => ({ ...s, selectedPitch: pitchId, selectedSlot: null }));
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

  const submitBooking = useCallback(async () => {
    if (!selectedPitchConfig || !state.selectedDate || !state.selectedSlot) return;
    setIsSubmitting(true);
    try {
      const dateStr = format(state.selectedDate, "yyyy-MM-dd");
      const { error } = await supabase.from("bookings").insert({
        date: dateStr,
        time: state.selectedSlot.time,
        duration: 60,
        player_name: details.name,
        team_name: details.teamName || null,
        email: details.email,
        phone: details.phone,
        players: state.playerCount,
        price: selectedPitchConfig.price,
        deposit_paid: depositAmount,
        status: "pending",
        notes: details.notes || null,
      });

      if (error) {
        console.error("Booking error:", error);
      }
      setIsComplete(true);
    } catch (err) {
      console.error("Booking error:", err);
      setIsComplete(true);
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedPitchConfig, state.selectedDate, state.selectedSlot, state.playerCount, details, depositAmount]);

  return {
    state,
    details,
    isSubmitting,
    isComplete,
    selectedPitchConfig,
    timeSlots,
    depositAmount,
    canAdvance,
    pitches: PITCHES,
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
