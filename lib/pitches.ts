import type { PitchConfig, TimeSlot } from "@/types/booking";

export const PITCHES: PitchConfig[] = [
  {
    id: "5-a-side",
    name: "Pitch Alpha",
    capacity: "5v5",
    surface: "Third-Gen Turf",
    description: "Our most popular pitch. Fast, tight gameplay on premium 3G turf with high-lux LED flood lighting.",
    price: 65,
    image: "https://images.unsplash.com/photo-1518604666860-9ed391f76460?w=800&q=80",
    features: ["LED Floodlit", "3G Turf", "Spectator Rail", "Locker Access"],
  },
  {
    id: "7-a-side",
    name: "Pitch Beta",
    capacity: "7v7",
    surface: "Fourth-Gen Turf",
    description: "Mid-format pitch with FIFA-approved 4G surface. Perfect for competitive leagues and team training.",
    price: 95,
    image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&q=80",
    features: ["FIFA Approved", "4G Turf", "Covered Stand", "Video Analysis"],
  },
  {
    id: "full-pitch",
    name: "Main Arena",
    capacity: "11v11",
    surface: "Hybrid Grass",
    description: "Full-size indoor arena with hybrid natural/synthetic grass. Cinematic lighting rig and scoreboard.",
    price: 180,
    image: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800&q=80",
    features: ["Hybrid Grass", "Scoreboard", "PA System", "Event Ready"],
  },
];

const SLOT_HOURS = [
  "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00",
  "19:00", "20:00", "21:00", "22:00",
];

function formatHour(h: string): string {
  const [hr] = h.split(":");
  const n = parseInt(hr, 10);
  const ampm = n >= 12 ? "PM" : "AM";
  const display = n > 12 ? n - 12 : n === 0 ? 12 : n;
  return `${display}:00 ${ampm}`;
}

// Deterministic pseudo-random availability seeded by date + hour + pitch
function isSlotAvailable(date: Date, hour: string, pitchId: string): boolean {
  const seed =
    date.getFullYear() * 10000 +
    (date.getMonth() + 1) * 100 +
    date.getDate() +
    parseInt(hour, 10) +
    pitchId.length;
  return (seed % 7) !== 0; // ~85% available
}

export function generateTimeSlots(date: Date, pitchId: string, pricePerHour: number): TimeSlot[] {
  return SLOT_HOURS.map((h) => ({
    id: `${pitchId}-${h}`,
    time: h,
    label: formatHour(h),
    available: isSlotAvailable(date, h, pitchId),
    price: pricePerHour,
  }));
}
