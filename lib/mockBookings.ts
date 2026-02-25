export type AdminBooking = {
  id: string;
  pitchId: "5-a-side" | "7-a-side" | "full-pitch";
  pitchName: string;
  date: string;       // "2026-02-25"
  time: string;       // "18:00"
  timeLabel: string;  // "6:00 PM"
  playerName: string;
  teamName: string;
  email: string;
  phone: string;
  players: number;
  priceFull: number;
  depositPaid: number;
  status: "confirmed" | "pending" | "cancelled";
  bookedAt: string;   // ISO timestamp
};

const NAMES = [
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
] as const;

const PITCHES: Array<{ id: AdminBooking["pitchId"]; name: string; price: number }> = [
  { id: "5-a-side",   name: "Pitch Alpha", price: 90  },
  { id: "7-a-side",   name: "Pitch Beta",  price: 130 },
  { id: "full-pitch", name: "Main Arena",  price: 250 },
];

const TIMES = ["07:00","09:00","10:00","12:00","13:00","15:00","17:00","18:00","19:00","20:00","21:00"];
const LABELS: Record<string, string> = {
  "07:00":"7:00 AM","09:00":"9:00 AM","10:00":"10:00 AM","12:00":"12:00 PM",
  "13:00":"1:00 PM","15:00":"3:00 PM","17:00":"5:00 PM","18:00":"6:00 PM",
  "19:00":"7:00 PM","20:00":"8:00 PM","21:00":"9:00 PM",
};

function addDays(base: Date, n: number): string {
  const d = new Date(base);
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
}

function bookedAt(daysAgo: number, hoursAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(d.getHours() - hoursAgo);
  return d.toISOString();
}

const today = new Date();

export const MOCK_BOOKINGS: AdminBooking[] = [
  // ── Today ──────────────────────────────────────────────────────
  { id:"BK001", pitchId:"5-a-side",   pitchName:"Pitch Alpha", date:addDays(today,0), time:"09:00", timeLabel:"9:00 AM",  ...spreadName(0),  priceFull:90,  depositPaid:45,  status:"confirmed", bookedAt:bookedAt(2,4)  },
  { id:"BK002", pitchId:"7-a-side",   pitchName:"Pitch Beta",  date:addDays(today,0), time:"12:00", timeLabel:"12:00 PM", ...spreadName(1),  priceFull:130, depositPaid:65,  status:"confirmed", bookedAt:bookedAt(1,8)  },
  { id:"BK003", pitchId:"full-pitch", pitchName:"Main Arena",  date:addDays(today,0), time:"18:00", timeLabel:"6:00 PM",  ...spreadName(3),  priceFull:250, depositPaid:125, status:"confirmed", bookedAt:bookedAt(3,2)  },
  { id:"BK004", pitchId:"5-a-side",   pitchName:"Pitch Alpha", date:addDays(today,0), time:"20:00", timeLabel:"8:00 PM",  ...spreadName(4),  priceFull:90,  depositPaid:45,  status:"pending",   bookedAt:bookedAt(0,1)  },
  // ── Tomorrow ────────────────────────────────────────────────────
  { id:"BK005", pitchId:"5-a-side",   pitchName:"Pitch Alpha", date:addDays(today,1), time:"07:00", timeLabel:"7:00 AM",  ...spreadName(2),  priceFull:90,  depositPaid:45,  status:"confirmed", bookedAt:bookedAt(4,6)  },
  { id:"BK006", pitchId:"7-a-side",   pitchName:"Pitch Beta",  date:addDays(today,1), time:"13:00", timeLabel:"1:00 PM",  ...spreadName(5),  priceFull:130, depositPaid:65,  status:"confirmed", bookedAt:bookedAt(2,3)  },
  { id:"BK007", pitchId:"full-pitch", pitchName:"Main Arena",  date:addDays(today,1), time:"17:00", timeLabel:"5:00 PM",  ...spreadName(7),  priceFull:250, depositPaid:125, status:"confirmed", bookedAt:bookedAt(1,5)  },
  { id:"BK008", pitchId:"5-a-side",   pitchName:"Pitch Alpha", date:addDays(today,1), time:"19:00", timeLabel:"7:00 PM",  ...spreadName(6),  priceFull:90,  depositPaid:45,  status:"confirmed", bookedAt:bookedAt(3,9)  },
  { id:"BK009", pitchId:"7-a-side",   pitchName:"Pitch Beta",  date:addDays(today,1), time:"21:00", timeLabel:"9:00 PM",  ...spreadName(8),  priceFull:130, depositPaid:65,  status:"pending",   bookedAt:bookedAt(0,2)  },
  // ── Day +2 ──────────────────────────────────────────────────────
  { id:"BK010", pitchId:"5-a-side",   pitchName:"Pitch Alpha", date:addDays(today,2), time:"10:00", timeLabel:"10:00 AM", ...spreadName(9),  priceFull:90,  depositPaid:45,  status:"confirmed", bookedAt:bookedAt(5,3)  },
  { id:"BK011", pitchId:"7-a-side",   pitchName:"Pitch Beta",  date:addDays(today,2), time:"15:00", timeLabel:"3:00 PM",  ...spreadName(10), priceFull:130, depositPaid:65,  status:"confirmed", bookedAt:bookedAt(2,7)  },
  { id:"BK012", pitchId:"full-pitch", pitchName:"Main Arena",  date:addDays(today,2), time:"18:00", timeLabel:"6:00 PM",  ...spreadName(11), priceFull:250, depositPaid:125, status:"cancelled", bookedAt:bookedAt(6,1)  },
  // ── Day +3 ──────────────────────────────────────────────────────
  { id:"BK013", pitchId:"5-a-side",   pitchName:"Pitch Alpha", date:addDays(today,3), time:"09:00", timeLabel:"9:00 AM",  ...spreadName(3),  priceFull:90,  depositPaid:45,  status:"confirmed", bookedAt:bookedAt(1,3)  },
  { id:"BK014", pitchId:"7-a-side",   pitchName:"Pitch Beta",  date:addDays(today,3), time:"12:00", timeLabel:"12:00 PM", ...spreadName(5),  priceFull:130, depositPaid:65,  status:"pending",   bookedAt:bookedAt(0,4)  },
  { id:"BK015", pitchId:"full-pitch", pitchName:"Main Arena",  date:addDays(today,3), time:"20:00", timeLabel:"8:00 PM",  ...spreadName(1),  priceFull:250, depositPaid:125, status:"confirmed", bookedAt:bookedAt(3,6)  },
];

function spreadName(i: number) {
  const [playerName, teamName, email, phone, players] = NAMES[i];
  return { playerName, teamName, email, phone, players };
}
