export type BookingRow = {
  id: string;
  date: string;
  time: string;
  duration: number;
  player_name: string;
  team_name: string | null;
  email: string;
  phone: string;
  players: number;
  price: number;
  deposit_paid: number;
  status: "confirmed" | "pending" | "cancelled";
  notes: string | null;
  created_at: string;
};

export type BookingInsert = Omit<BookingRow, "id" | "created_at">;

export type PricingRow = {
  id: string;
  duration: number;
  regular: number;
  peak: number;
  weekend: number;
};

export type PackageRow = {
  id: string;
  name: string;
  features: string[];
  is_popular: boolean;
  sort_order: number;
};

export type FaqRow = {
  id: string;
  question: string;
  answer: string;
  icon: string;
  sort_order: number;
};

export type Database = {
  public: {
    Tables: {
      bookings: {
        Row: BookingRow;
        Insert: BookingInsert;
        Update: Partial<BookingInsert>;
      };
      pricing: {
        Row: PricingRow;
        Insert: Omit<PricingRow, "id">;
        Update: Partial<Omit<PricingRow, "id">>;
      };
      packages: {
        Row: PackageRow;
        Insert: Omit<PackageRow, "id">;
        Update: Partial<Omit<PackageRow, "id">>;
      };
      faq: {
        Row: FaqRow;
        Insert: Omit<FaqRow, "id">;
        Update: Partial<Omit<FaqRow, "id">>;
      };
    };
  };
};
