import type { PitchConfig, TimeSlot, Duration, PriceCategory } from "@/types/booking";
import { getDay } from "date-fns";

export const PITCHES: PitchConfig[] = [
  {
    id: "5-a-side",
    name: "Terrain 5v5",
    capacity: "5 contre 5",
    surface: "Gazon synthétique 3G",
    description: "Terrain compact idéal pour les matchs rapides entre amis. Gazon premium, éclairage LED et vestiaires inclus.",
    price: 95,
    image: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800&q=80",
    features: ["Éclairage LED", "Gazon 3G", "Vestiaires", "10 joueurs max"],
  },
  {
    id: "7-a-side",
    name: "Terrain 7v7",
    capacity: "7 contre 7",
    surface: "Gazon synthétique 4G",
    description: "Format intermédiaire sur surface 4G certifiée FIFA. Parfait pour ligues compétitives et entraînements d'équipe.",
    price: 95,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
    features: ["Certifié FIFA", "Gazon 4G", "Tribune", "Analyse vidéo"],
  },
  {
    id: "full-pitch",
    name: "Aréna complet",
    capacity: "11 contre 11",
    surface: "Gazon hybride pro",
    description: "Notre aréna plein format avec gazon hybride professionnel. Tableau d'affichage numérique, système audio et éclairage compétition.",
    price: 95,
    image: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800&q=80",
    features: ["Gazon hybride", "Tableau de scores", "Sono intégrée", "Événements privés"],
  },
];

// Pricing table: duration × category
// Matches the pricing table exactly
const PRICING: Record<Duration, Record<PriceCategory, number>> = {
  30:  { regular: 55,  peak: 65,  weekend: 70  },
  60:  { regular: 95,  peak: 115, weekend: 125 },
  90:  { regular: 130, peak: 155, weekend: 170 },
  120: { regular: 160, peak: 190, weekend: 210 },
};

export const DURATIONS: { value: Duration; label: string }[] = [
  { value: 30,  label: "30 min" },
  { value: 60,  label: "60 min" },
  { value: 90,  label: "90 min" },
  { value: 120, label: "120 min" },
];

// Peak hours: 17:00–22:00 on weekdays
const PEAK_START = 17;

export function getPriceCategory(date: Date, time: string): PriceCategory {
  const dayOfWeek = getDay(date); // 0=Sun, 6=Sat
  if (dayOfWeek === 0 || dayOfWeek === 6) return "weekend";
  const hour = parseInt(time.split(":")[0], 10);
  if (hour >= PEAK_START) return "peak";
  return "regular";
}

export function getPrice(duration: Duration, category: PriceCategory): number {
  return PRICING[duration][category];
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

function formatTime(t: string): string {
  const [hr, min] = t.split(":");
  const n = parseInt(hr, 10);
  return `${n}h${min}`;
}

export function generateTimeSlots(
  date: Date,
  pitchId: string,
  duration: Duration,
  bookedSlots: Set<string> = new Set(),
): TimeSlot[] {
  // How many consecutive 30-min blocks needed
  const blocksNeeded = duration / 30;

  return SLOT_TIMES.map((t) => {
    const category = getPriceCategory(date, t);
    const price = getPrice(duration, category);

    // Check if all blocks starting from this slot are available
    const startIdx = SLOT_TIMES.indexOf(t);
    let available = true;
    for (let i = 0; i < blocksNeeded; i++) {
      const slotTime = SLOT_TIMES[startIdx + i];
      if (!slotTime || bookedSlots.has(slotTime)) {
        available = false;
        break;
      }
    }
    // Also check the booking wouldn't go past 22:30
    if (startIdx + blocksNeeded > SLOT_TIMES.length) {
      available = false;
    }

    return {
      id: `${pitchId}-${t}`,
      time: t,
      label: formatTime(t),
      available,
      price,
      category,
    };
  });
}
