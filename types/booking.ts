export type PitchType = "5-a-side" | "7-a-side" | "full-pitch";

export type TimeSlot = {
  id: string;
  time: string;       // "09:00"
  label: string;      // "9h00"
  available: boolean;
  price: number;
};

export type PitchConfig = {
  id: PitchType;
  name: string;
  capacity: string;
  surface: string;
  description: string;
  price: number;      // per hour
  image: string;
  features: string[];
};

export type PackOption = {
  id: string;
  name: string;
  features: string[];
  is_popular: boolean;
};

export type BookingState = {
  selectedDate: Date | null;
  selectedPitch: PitchType | null;
  selectedSlot: TimeSlot | null;
  selectedSlots: TimeSlot[];    // multiple consecutive hours
  selectedPack: string | null;
  playerCount: number;
  step: 1 | 2 | 3 | 4; // 1=pitch, 2=date+time, 3=details, 4=payment
};

export type BookingDetails = {
  name: string;
  email: string;
  phone: string;
  teamName: string;
  notes: string;
};
