"use client";
import { useState, useMemo, useEffect } from "react";
import { format, addDays, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import {
  LayoutGrid, List, DollarSign, CalendarDays, Users, TrendingUp,
  CheckCircle2, Clock, XCircle, ChevronLeft, ChevronRight,
  LogOut, Search, Eye, X, Lock,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type AdminBooking = {
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

const ADMIN_PIN = "1234";

const STATUS_STYLES: Record<string, { bg: string; text: string; icon: typeof CheckCircle2 }> = {
  confirmed: { bg: "rgba(34,197,94,0.12)",  text: "#4ade80", icon: CheckCircle2 },
  pending:   { bg: "rgba(251,191,36,0.12)", text: "#FBBF24", icon: Clock       },
  cancelled: { bg: "rgba(239,68,68,0.12)",  text: "#f87171", icon: XCircle     },
};

function formatTime(t: string) {
  const n = parseInt(t.split(":")[0], 10);
  return `${n}h00`;
}

function totalRevenue(bookings: AdminBooking[]) {
  return bookings.filter(b => b.status !== "cancelled").reduce((s, b) => s + b.deposit_paid, 0);
}

function BookingModal({ booking, onClose }: { booking: AdminBooking; onClose: () => void }) {
  const sc = STATUS_STYLES[booking.status];
  const StatusIcon = sc.icon;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="glass-card p-8 max-w-md w-full relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-[#3d5a90] hover:text-white transition-colors">
          <X size={20} />
        </button>
        <div className="flex items-center justify-between mb-6">
          <span className="text-[#3d5a90] text-xs tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>
            {booking.id.slice(0, 8)}
          </span>
          <span className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full"
            style={{ background: sc.bg, color: sc.text }}>
            <StatusIcon size={12} />
            {booking.status.toUpperCase()}
          </span>
        </div>
        <h2 className="text-white text-3xl mb-1" style={{ fontFamily: "var(--font-display)" }}>
          {booking.player_name}
        </h2>
        <p className="text-[#6080b8] text-sm mb-6">{booking.team_name ?? "—"}</p>
        <div className="space-y-3 mb-6">
          {[
            { label: "Date",    value: format(parseISO(booking.date), "EEE dd MMM", { locale: fr }) },
            { label: "Heure",   value: formatTime(booking.time) },
            { label: "Joueurs", value: `${booking.players} joueurs` },
            { label: "Courriel", value: booking.email },
            { label: "Tél.",    value: booking.phone },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between py-2 border-b border-white/[0.05]">
              <span className="text-[#3d5a90] text-sm">{label}</span>
              <span className="text-white text-sm">{value}</span>
            </div>
          ))}
        </div>
        <div className="glass-card p-4 flex justify-between items-center">
          <div>
            <div className="text-[#3d5a90] text-xs mb-1">Prix total</div>
            <div className="text-white font-semibold">{booking.price}$ CAD</div>
          </div>
          <div className="text-right">
            <div className="text-[#3d5a90] text-xs mb-1">Dépôt payé</div>
            <div className="text-[#F97316] font-semibold text-lg">{booking.deposit_paid}$ CAD</div>
          </div>
          <div className="text-right">
            <div className="text-[#3d5a90] text-xs mb-1">Solde dû</div>
            <div className="text-white font-semibold">{booking.price - booking.deposit_paid}$ CAD</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const SCHEDULE_TIMES = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00"];

function ScheduleGrid({ date, bookings, onSelect }: { date: Date; bookings: AdminBooking[]; onSelect: (b: AdminBooking) => void }) {
  const dateStr = format(date, "yyyy-MM-dd");
  const dayBookings = bookings.filter(b => b.date === dateStr);

  return (
    <div className="glass-card overflow-hidden">
      <div className="grid border-b border-white/[0.06]" style={{ gridTemplateColumns: "80px 1fr" }}>
        <div className="py-3 px-3 text-[#3d5a90] text-xs text-center" style={{ fontFamily: "var(--font-mono)" }}>HEURE</div>
        <div className="py-3 px-3 text-center border-l border-white/[0.06]">
          <span className="text-xs font-semibold tracking-wider text-[#F97316]" style={{ fontFamily: "var(--font-display)" }}>
            RÉSERVATIONS
          </span>
        </div>
      </div>
      {SCHEDULE_TIMES.map((time, ti) => {
        const booking = dayBookings.find(b => b.time === time);
        return (
          <div key={time} className={`grid border-b border-white/[0.04] ${ti % 2 === 0 ? "bg-white/[0.01]" : ""}`}
            style={{ gridTemplateColumns: "80px 1fr" }}>
            <div className="py-3 px-3 flex items-center justify-center text-[#3d5a90] text-xs"
              style={{ fontFamily: "var(--font-mono)" }}>
              {formatTime(time)}
            </div>
            <div className="py-2 px-2 border-l border-white/[0.04]">
              {booking ? (
                <button onClick={() => onSelect(booking)}
                  className="w-full rounded-lg px-3 py-2 text-left transition-all hover:opacity-90 group"
                  style={{ background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.35)" }}>
                  <div className="text-xs font-semibold truncate text-[#FB923C]">{booking.player_name}</div>
                  <div className="text-xs truncate mt-0.5 text-[#FB923C]/70">{booking.team_name ?? "—"}</div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[0.6rem] px-1.5 py-0.5 rounded-full"
                      style={{ background: STATUS_STYLES[booking.status].bg, color: STATUS_STYLES[booking.status].text }}>
                      {booking.status}
                    </span>
                    <Eye size={10} className="text-[#FB923C] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ) : (
                <div className="w-full rounded-lg px-3 py-2 border border-white/[0.04] text-center">
                  <span className="text-[#2a3f6a] text-xs">—</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function AdminPage() {
  const [pin, setPin]           = useState("");
  const [authed, setAuthed]     = useState(false);
  const [pinError, setPinError] = useState(false);
  const [view, setView]         = useState<"schedule" | "list">("schedule");
  const [scheduleDate, setScheduleDate] = useState(new Date());
  const [search, setSearch]     = useState("");
  const [selected, setSelected] = useState<AdminBooking | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "confirmed" | "pending" | "cancelled">("all");
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading]   = useState(true);

  // Fetch bookings from Supabase (real data only)
  useEffect(() => {
    if (!authed) return;
    async function fetchBookings() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .order("date")
          .order("time");
        if (error) {
          console.error("Supabase fetch error:", error);
          setBookings([]);
        } else {
          setBookings((data as AdminBooking[]) ?? []);
        }
      } catch (err) {
        console.error("Fetch bookings error:", err);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, [authed]);

  const confirmed  = bookings.filter(b => b.status === "confirmed");
  const pending    = bookings.filter(b => b.status === "pending");
  const revenue    = totalRevenue(bookings);
  const todayStr   = format(new Date(), "yyyy-MM-dd");
  const todayCount = bookings.filter(b => b.date === todayStr && b.status !== "cancelled").length;

  const filtered = useMemo(() => {
    return bookings.filter(b => {
      const matchStatus = statusFilter === "all" || b.status === statusFilter;
      const q = search.toLowerCase();
      const matchSearch = !q || b.player_name.toLowerCase().includes(q)
        || (b.team_name ?? "").toLowerCase().includes(q) || b.id.toLowerCase().includes(q)
        || b.email.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    }).sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
  }, [bookings, search, statusFilter]);

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#06080f]"
        style={{ backgroundImage: "radial-gradient(at 50% 30%, rgba(249,115,22,0.12) 0%, transparent 60%)" }}>
        <div className="glass-card p-10 w-full max-w-sm text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F97316] to-[#EA580C] flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(249,115,22,0.35)]">
            <Lock size={24} className="text-white" />
          </div>
          <h1 className="text-white text-4xl mb-1" style={{ fontFamily: "var(--font-display)" }}>PORTAIL ADMIN</h1>
          <p className="text-[#3d5a90] text-sm mb-8">MTLWCUP — Accès restreint</p>
          <div className="mb-4">
            <input type="password" placeholder="Entrer le NIP" value={pin}
              onChange={(e) => { setPin(e.target.value); setPinError(false); }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (pin === ADMIN_PIN) setAuthed(true);
                  else setPinError(true);
                }
              }}
              className={`w-full text-center text-xl tracking-[0.5em] bg-white/[0.03] border rounded-lg px-4 py-4 text-white focus:outline-none transition-all ${
                pinError ? "border-red-500/60 focus:border-red-500" : "border-white/10 focus:border-[#F97316]/50"
              }`} />
            {pinError && <p className="text-red-400 text-xs mt-2">NIP incorrect. Réessayez.</p>}
          </div>
          <button onClick={() => { if (pin === ADMIN_PIN) setAuthed(true); else setPinError(true); }}
            className="btn-neon w-full justify-center">Déverrouiller</button>
          <p className="text-[#2a3f6a] text-xs mt-6">Accès administrateur uniquement</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06080f]" style={{ backgroundImage: "radial-gradient(at 30% 0%, rgba(249,115,22,0.08) 0%, transparent 50%)" }}>
      <header className="border-b border-white/[0.05] bg-[#080f1c]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <span className="text-white text-xl tracking-[0.1em]" style={{ fontFamily: "var(--font-display)" }}>
              MTLW<span className="text-[#F97316]">CUP</span>
              <span className="text-[#3d5a90] text-base ml-2 tracking-widest">ADMIN</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" className="text-[#3d5a90] hover:text-white text-sm transition-colors">&larr; Site public</a>
            <button onClick={() => setAuthed(false)}
              className="flex items-center gap-1.5 text-[#3d5a90] hover:text-white text-sm transition-colors">
              <LogOut size={14} /> Déconnexion
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {loading ? (
          <div className="text-center py-20 text-[#6080b8]">Chargement des réservations...</div>
        ) : bookings.length === 0 && !search ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center mx-auto mb-6">
              <CalendarDays size={28} className="text-[#F97316]/50" />
            </div>
            <h3 className="text-white text-2xl mb-2" style={{ fontFamily: "var(--font-display)" }}>Aucune réservation</h3>
            <p className="text-[#3d5a90] text-sm max-w-md mx-auto">
              Les réservations apparaîtront ici une fois que des clients auront soumis leurs demandes. Assurez-vous que Supabase est configuré dans votre fichier .env.local.
            </p>
          </div>
        ) : (
          <>
            {/* KPI cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {[
                { icon: DollarSign, label: "Dépôts collectés", value: `${revenue.toLocaleString()}$`, sub: "CAD cette semaine", color: "#F97316" },
                { icon: CalendarDays, label: "Aujourd'hui", value: String(todayCount), sub: "réservations", color: "#FBBF24" },
                { icon: CheckCircle2, label: "Confirmées", value: String(confirmed.length), sub: "sessions à venir", color: "#4ade80" },
                { icon: Clock, label: "En attente", value: String(pending.length), sub: "à confirmer", color: "#90a8d8" },
              ].map(({ icon: Icon, label, value, sub, color }) => (
                <div key={label} className="glass-card p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                      <Icon size={16} style={{ color }} />
                    </div>
                    <TrendingUp size={14} className="text-[#2a3f6a]" />
                  </div>
                  <div className="text-white text-3xl mb-0.5" style={{ fontFamily: "var(--font-display)" }}>{value}</div>
                  <div className="text-white text-xs font-medium mb-0.5">{label}</div>
                  <div className="text-[#3d5a90] text-xs">{sub}</div>
                </div>
              ))}
            </div>

            {/* View toggle */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-2xl tracking-[0.06em]" style={{ fontFamily: "var(--font-display)" }}>
                CALENDRIER DES RÉSERVATIONS
              </h2>
              <div className="flex items-center gap-2">
                <button onClick={() => setView("schedule")}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm transition-all ${
                    view === "schedule" ? "bg-[#F97316] text-white" : "text-[#3d5a90] hover:text-white border border-white/10"
                  }`}>
                  <LayoutGrid size={14} /> Calendrier
                </button>
                <button onClick={() => setView("list")}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm transition-all ${
                    view === "list" ? "bg-[#F97316] text-white" : "text-[#3d5a90] hover:text-white border border-white/10"
                  }`}>
                  <List size={14} /> Liste
                </button>
              </div>
            </div>

            {view === "schedule" && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <button onClick={() => setScheduleDate(d => addDays(d, -1))}
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-[#6080b8] hover:text-white border border-white/10 hover:border-white/30 transition-all">
                    <ChevronLeft size={16} />
                  </button>
                  <div className="glass-card px-5 py-2 text-white font-medium" style={{ fontFamily: "var(--font-display)", letterSpacing: "0.06em" }}>
                    {format(scheduleDate, "EEEE d MMMM yyyy", { locale: fr }).toUpperCase()}
                    {format(scheduleDate, "yyyy-MM-dd") === todayStr && (
                      <span className="ml-3 text-xs text-[#F97316] border border-[#F97316]/30 px-2 py-0.5 rounded-full">AUJOURD&apos;HUI</span>
                    )}
                  </div>
                  <button onClick={() => setScheduleDate(d => addDays(d, 1))}
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-[#6080b8] hover:text-white border border-white/10 hover:border-white/30 transition-all">
                    <ChevronRight size={16} />
                  </button>
                  <div className="flex gap-2 ml-4 overflow-x-auto no-scrollbar">
                    {[0,1,2,3,4,5,6].map(n => {
                      const d = addDays(new Date(), n);
                      const ds = format(d, "yyyy-MM-dd");
                      const active = ds === format(scheduleDate, "yyyy-MM-dd");
                      const count = bookings.filter(b => b.date === ds && b.status !== "cancelled").length;
                      return (
                        <button key={n} onClick={() => setScheduleDate(d)}
                          className={`shrink-0 px-3 py-1.5 rounded-lg text-xs transition-all ${
                            active ? "bg-[#F97316] text-white" : "border border-white/10 text-[#6080b8] hover:text-white hover:border-white/20"
                          }`}>
                          <div style={{ fontFamily: "var(--font-mono)" }}>{format(d, "EEE", { locale: fr })}</div>
                          <div className="text-[0.65rem] opacity-70">{count > 0 ? `${count} rés.` : "—"}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <ScheduleGrid date={scheduleDate} bookings={bookings} onSelect={setSelected} />
              </div>
            )}

            {view === "list" && (
              <div>
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <div className="relative flex-1">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3d5a90]" />
                    <input value={search} onChange={e => setSearch(e.target.value)}
                      placeholder="Rechercher joueur, équipe, ID…"
                      className="w-full pl-9 pr-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-lg text-white text-sm placeholder-[#3d5a90] focus:outline-none focus:border-[#F97316]/40 transition-all" />
                  </div>
                  <div className="flex gap-2">
                    {(["all","confirmed","pending","cancelled"] as const).map(s => (
                      <button key={s} onClick={() => setStatusFilter(s)}
                        className={`px-3 py-2 rounded-lg text-xs capitalize transition-all ${
                          statusFilter === s ? "bg-[#F97316] text-white" : "border border-white/10 text-[#6080b8] hover:text-white"
                        }`}>
                        {s === "all" ? "Tout" : s === "confirmed" ? "Confirmée" : s === "pending" ? "En attente" : "Annulée"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="glass-card overflow-hidden">
                  <div className="grid text-xs uppercase tracking-widest text-[#3d5a90] px-5 py-3 border-b border-white/[0.06]"
                    style={{ gridTemplateColumns: "80px 1fr 1fr 120px 90px 90px 80px" }}>
                    <span>ID</span><span>Joueur</span><span>Date / Heure</span>
                    <span>Statut</span><span>Dépôt</span><span>Prix</span><span></span>
                  </div>
                  {filtered.length === 0 && (
                    <div className="text-center py-16 text-[#3d5a90] text-sm">Aucune réservation trouvée.</div>
                  )}
                  {filtered.map((b, i) => {
                    const sc = STATUS_STYLES[b.status];
                    const StatusIcon = sc.icon;
                    return (
                      <div key={b.id} onClick={() => setSelected(b)}
                        className={`grid items-center px-5 py-4 cursor-pointer hover:bg-white/[0.03] transition-colors ${
                          i < filtered.length - 1 ? "border-b border-white/[0.04]" : ""
                        }`}
                        style={{ gridTemplateColumns: "80px 1fr 1fr 120px 90px 90px 80px" }}>
                        <span className="text-[#3d5a90] text-xs" style={{ fontFamily: "var(--font-mono)" }}>{b.id.slice(0, 8)}</span>
                        <div>
                          <div className="text-white text-sm font-medium">{b.player_name}</div>
                          <div className="text-[#3d5a90] text-xs mt-0.5 flex items-center gap-1">
                            <Users size={10} /> {b.team_name ?? "—"} &middot; {b.players}j
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-[#FB923C]">{format(parseISO(b.date), "dd MMM", { locale: fr })}</div>
                          <div className="text-[#3d5a90] text-xs mt-0.5">{formatTime(b.time)}</div>
                        </div>
                        <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full w-fit"
                          style={{ background: sc.bg, color: sc.text }}>
                          <StatusIcon size={11} /> {b.status}
                        </span>
                        <span className="text-[#F97316] font-semibold text-sm">{b.deposit_paid}$</span>
                        <span className="text-white text-sm">{b.price}$</span>
                        <button onClick={(e) => { e.stopPropagation(); setSelected(b); }}
                          className="flex items-center gap-1 text-[#3d5a90] hover:text-white text-xs transition-colors">
                          <Eye size={13} /> Voir
                        </button>
                      </div>
                    );
                  })}
                </div>
                {filtered.length > 0 && (
                  <div className="flex items-center justify-between mt-4 px-2 text-sm">
                    <span className="text-[#3d5a90]">{filtered.length} réservation{filtered.length !== 1 ? "s" : ""}</span>
                    <span className="text-[#F97316] font-semibold">
                      {totalRevenue(filtered).toLocaleString()}$ CAD dépôts
                    </span>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
      {selected && <BookingModal booking={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
