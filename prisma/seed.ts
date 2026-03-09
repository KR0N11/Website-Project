import path from "path";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../lib/generated/prisma";

const dbPath = path.resolve(process.cwd(), "dev.db");
const adapter = new PrismaLibSql({ url: `file://${dbPath}` });
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

type PitchId = "5-a-side" | "7-a-side" | "full-pitch";

const NAMES: [string, string, string, string, number][] = [
  ["Alex Tremblay",  "Les Loups FC",       "alex@gmail.com",    "+1 514-555-0101", 10],
  ["Marie Côté",     "MTL Ballers",        "marie@gmail.com",   "+1 514-555-0102", 5 ],
  ["Jordan Smith",   "FC Plateau",         "jordan@gmail.com",  "+1 514-555-0103", 7 ],
  ["Yasmine Diallo", "Les Étoiles",        "yasmine@gmail.com", "+1 514-555-0104", 14],
  ["Kevin Park",     "United Nordiques",   "kevin@gmail.com",   "+1 514-555-0105", 5 ],
  ["Fiona Leblanc",  "Rosemont FC",        "fiona@gmail.com",   "+1 514-555-0106", 10],
  ["Omar Hassan",    "Al-Maghrib MTL",     "omar@gmail.com",    "+1 514-555-0107", 7 ],
  ["Sofia Martins",  "Verdun Vipers",      "sofia@gmail.com",   "+1 514-555-0108", 11],
  ["Luc Fortin",     "NDG Athletic",       "luc@gmail.com",     "+1 514-555-0109", 5 ],
  ["Nadia Ouellet",  "Les Guerrières",     "nadia@gmail.com",   "+1 514-555-0110", 10],
  ["Ben Kowalski",   "Hochelaga United",   "ben@gmail.com",     "+1 514-555-0111", 7 ],
  ["Camille Roy",    "Sainte-Marie FC",    "camille@gmail.com", "+1 514-555-0112", 14],
];

const LABELS: Record<string, string> = {
  "07:00": "7:00 AM", "09:00": "9:00 AM", "10:00": "10:00 AM",
  "12:00": "12:00 PM", "13:00": "1:00 PM", "15:00": "3:00 PM",
  "17:00": "5:00 PM", "18:00": "6:00 PM", "19:00": "7:00 PM",
  "20:00": "8:00 PM", "21:00": "9:00 PM",
};

function addDays(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
}

function bookedAt(daysAgo: number, hoursAgo: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(d.getHours() - hoursAgo);
  return d;
}

function spreadName(i: number) {
  const [playerName, teamName, email, phone, players] = NAMES[i];
  return { playerName, teamName, email, phone, players };
}

function pitchInfo(pitchId: PitchId) {
  const map: Record<PitchId, { pitchName: string; price: number }> = {
    "5-a-side":   { pitchName: "Pitch Alpha", price: 90  },
    "7-a-side":   { pitchName: "Pitch Beta",  price: 130 },
    "full-pitch": { pitchName: "Main Arena",  price: 250 },
  };
  return map[pitchId];
}

function makeBooking(
  id: string,
  pitchId: PitchId,
  dayOffset: number,
  time: string,
  nameIdx: number,
  status: "confirmed" | "pending" | "cancelled",
  daysAgo: number,
  hoursAgo: number,
) {
  const { pitchName, price } = pitchInfo(pitchId);
  const { playerName, teamName, email, phone, players } = spreadName(nameIdx);
  return {
    id,
    pitchId,
    pitchName,
    date: addDays(dayOffset),
    time,
    timeLabel: LABELS[time],
    playerName,
    teamName,
    email,
    phone,
    players,
    priceFull: price,
    depositPaid: Math.round(price * 0.5),
    status,
    bookedAt: bookedAt(daysAgo, hoursAgo),
  };
}

async function main() {
  await prisma.booking.deleteMany();

  await prisma.booking.createMany({
    data: [
      makeBooking("BK001", "5-a-side",   0, "09:00", 0,  "confirmed", 2, 4),
      makeBooking("BK002", "7-a-side",   0, "12:00", 1,  "confirmed", 1, 8),
      makeBooking("BK003", "full-pitch", 0, "18:00", 3,  "confirmed", 3, 2),
      makeBooking("BK004", "5-a-side",   0, "20:00", 4,  "pending",   0, 1),
      makeBooking("BK005", "5-a-side",   1, "07:00", 2,  "confirmed", 4, 6),
      makeBooking("BK006", "7-a-side",   1, "13:00", 5,  "confirmed", 2, 3),
      makeBooking("BK007", "full-pitch", 1, "17:00", 7,  "confirmed", 1, 5),
      makeBooking("BK008", "5-a-side",   1, "19:00", 6,  "confirmed", 3, 9),
      makeBooking("BK009", "7-a-side",   1, "21:00", 8,  "pending",   0, 2),
      makeBooking("BK010", "5-a-side",   2, "10:00", 9,  "confirmed", 5, 3),
      makeBooking("BK011", "7-a-side",   2, "15:00", 10, "confirmed", 2, 7),
      makeBooking("BK012", "full-pitch", 2, "18:00", 11, "cancelled", 6, 1),
      makeBooking("BK013", "5-a-side",   3, "09:00", 3,  "confirmed", 1, 3),
      makeBooking("BK014", "7-a-side",   3, "12:00", 5,  "pending",   0, 4),
      makeBooking("BK015", "full-pitch", 3, "20:00", 1,  "confirmed", 3, 6),
    ],
  });

  console.log("✅ Seeded 15 bookings");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
