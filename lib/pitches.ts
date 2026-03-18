import type { PitchConfig, TimeSlot, PriceCategory } from "@/types/booking";
import { getDay } from "date-fns";

export const PITCHES: PitchConfig[] = [
  {
    id: "5-a-side",
    name: "Terrain 5v5",
    capacity: "5 contre 5",
    surface: "Gazon synthétique 3G",
    description: "Terrain compact idéal pour les matchs rapides entre amis.",
    image: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800&q=80",
    features: ["Éclairage LED", "Gazon 3G", "Vestiaires", "10 joueurs max"],
  },
  {
    id: "7-a-side",
    name: "Terrain 7v7",
    capacity: "7 contre 7",
    surface: "Gazon synthétique 4G",
    description: "Format intermédiaire sur surface 4G certifiée FIFA.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
    features: ["Certifié FIFA", "Gazon 4G", "Tribune", "Analyse vidéo"],
  },
  {
    id: "full-pitch",
    name: "Aréna complet",
    capacity: "11 contre 11",
    surface: "Gazon hybride pro",
    description: "Aréna plein format avec gazon hybride professionnel.",
    image: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800&q=80",
    features: ["Gazon hybride", "Tableau de scores", "Sono intégrée", "Événements privés"],
  },
];

// Pricing: duration (in minutes) → category → price
// 2 consecutive 30-min slots = 60 min price, etc.
const PRICING: Record<number, Record<PriceCategory, number>> = {
  30:  { regular: 55,  peak: 65,  weekend: 70  },
  60:  { regular: 95,  peak: 115, weekend: 125 },
  90:  { regular: 130, peak: 155, weekend: 170 },
  120: { regular: 160, peak: 190, weekend: 210 },
};

// Max 4 consecutive 30-min slots (120 min)
export const MAX_SLOTS = 4;

// Peak hours: 17:00–22:00 on weekdays
const PEAK_START = 17;

export function getPriceCategory(date: Date, time: string): PriceCategory {
  const dayOfWeek = getDay(date); // 0=Sun, 6=Sat
  if (dayOfWeek === 0 || dayOfWeek === 6) return "weekend";
  const hour = parseInt(time.split(":")[0], 10);
  if (hour >= PEAK_START) return "peak";
  return "regular";
}

export function getPriceForDuration(durationMinutes: number, category: PriceCategory): number {
  const entry = PRICING[durationMinutes];
  if (entry) return entry[category];
  // Fallback: extrapolate from 30-min rate
  const blocks = durationMinutes / 30;
  return PRICING[30][category] * blocks;
}

export function getCategoryLabel(cat: PriceCategory): string {
  switch (cat) {
    case "regular": return "Régulier";
    case "peak":    return "Pointe";
    case "weekend": return "Week-end";
  }
}

// Generate 30-minute time slots from 08:00 to 22:00
const SLOT_TIMES: string[] = [];
for (let h = 8; h <= 22; h++) {
  SLOT_TIMES.push(`${String(h).padStart(2, "0")}:00`);
  if (h < 22) {
    SLOT_TIMES.push(`${String(h).padStart(2, "0")}:30`);
  }
}

export { SLOT_TIMES };

function formatTime(t: string): string {
  const [hr, min] = t.split(":");
  const n = parseInt(hr, 10);
  return `${n}h${min}`;
}

export function generateTimeSlots(
  date: Date,
  pitchId: string,
  bookedSlots: Set<string> = new Set(),
): TimeSlot[] {
  return SLOT_TIMES.map((t) => ({
    id: `${pitchId}-${t}`,
    time: t,
    label: formatTime(t),
    available: !bookedSlots.has(t),
    category: getPriceCategory(date, t),
  }));
}
