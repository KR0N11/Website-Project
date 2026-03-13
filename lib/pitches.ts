import type { PitchConfig, TimeSlot } from "@/types/booking";

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
    price: 130,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
    features: ["Certifié FIFA", "Gazon 4G", "Tribune", "Analyse vidéo"],
  },
  {
    id: "full-pitch",
    name: "Aréna complet",
    capacity: "11 contre 11",
    surface: "Gazon hybride pro",
    description: "Notre aréna plein format avec gazon hybride professionnel. Tableau d'affichage numérique, système audio et éclairage compétition.",
    price: 160,
    image: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800&q=80",
    features: ["Gazon hybride", "Tableau de scores", "Sono intégrée", "Événements privés"],
  },
];

const SLOT_HOURS = [
  "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00",
  "18:00", "19:00", "20:00", "21:00", "22:00",
];

function formatHour(h: string): string {
  const [hr] = h.split(":");
  const n = parseInt(hr, 10);
  return `${n}h00`;
}

export function generateTimeSlots(
  date: Date,
  pitchId: string,
  pricePerHour: number,
  bookedHours: Set<string> = new Set(),
): TimeSlot[] {
  return SLOT_HOURS.map((h) => ({
    id: `${pitchId}-${h}`,
    time: h,
    label: formatHour(h),
    available: !bookedHours.has(h),
    price: pricePerHour,
  }));
}
