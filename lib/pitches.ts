import type { PitchConfig, TimeSlot } from "@/types/booking";

export const PITCHES: PitchConfig[] = [
  {
    id: "5-a-side",
    name: "Pitch Alpha",
    capacity: "5v5",
    surface: "Third-Gen Turf",
    description: "Our fastest pitch. Tight 5-a-side on premium 3G turf under 5000-lux LED floodlights. Perfect for quick sessions.",
    price: 90,
    image: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800&q=80",
    features: ["LED Floodlit", "3G Turf", "Spectator Rail", "Locker Access"],
  },
  {
    id: "7-a-side",
    name: "Pitch Beta",
    capacity: "7v7",
    surface: "Fourth-Gen Turf",
    description: "Mid-format pitch with FIFA-approved 4G surface. The go-to for competitive leagues and team training blocks.",
    price: 130,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
    features: ["FIFA Approved", "4G Turf", "Covered Stand", "Video Analysis"],
  },
  {
    id: "full-pitch",
    name: "Main Arena",
    capacity: "11v11",
    surface: "Hybrid Grass",
    description: "Full-size indoor arena with hybrid natural/synthetic turf. Cinematic LED rig, digital scoreboard, PA system.",
    price: 250,
    image: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800&q=80",
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

function isSlotAvailable(date: Date, hour: string, pitchId: string): boolean {
  const h = parseInt(hour, 10);
  // Knuth multiplicative hash — mixes inputs so no two hours share the
  // same congruence class (fixes the systematic 13/20 unavailable pattern).
  let n = (date.getFullYear() * 366 + date.getMonth() * 31 + date.getDate());
  n = ((n * 2654435761) >>> 0);
  n = ((n ^ (h * 40503))    >>> 0);
  n = ((n ^ pitchId.charCodeAt(0)) >>> 0);
  n ^= n >>> 16;
  n  = ((n * 0x45d9f3b) >>> 0);
  n ^= n >>> 16;
  return (n % 5) !== 0; // ~80 % available, evenly distributed across all hours
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
