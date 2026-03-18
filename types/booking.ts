export type PitchType = "5-a-side" | "7-a-side" | "full-pitch";

export type Duration = 30 | 60 | 90 | 120;

export type PriceCategory = "regular" | "peak" | "weekend";

export type TimeSlot = {
  id: string;
  time: string;       // "09:00" or "09:30"
  label: string;      // "9h00" or "9h30"
  available: boolean;
  price: number;       // price for selected duration at this slot's category
  category: PriceCategory;
};

export type PitchConfig = {
  id: PitchType;
  name: string;
  capacity: string;
  surface: string;
  description: string;
  price: number;      // base display price (60min regular)
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
  selectedSlots: TimeSlot[];
  selectedPack: string | null;
  selectedDuration: Duration;
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
