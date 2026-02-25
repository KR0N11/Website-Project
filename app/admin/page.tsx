"use client";
import { useState, useMemo } from "react";
import { format, addDays, parseISO } from "date-fns";
import {
  LayoutGrid, List, DollarSign, CalendarDays, Users, TrendingUp,
  CheckCircle2, Clock, XCircle, ChevronLeft, ChevronRight,
  Flame, LogOut, Search, Eye, X,
} from "lucide-react";
import { MOCK_BOOKINGS, type AdminBooking } from "@/lib/mockBookings";

// ── Simple PIN gate ─────────────────────────────────────────────────────────
const ADMIN_PIN = "1234";

const PITCH_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "5-a-side":   { bg: "rgba(249,115,22,0.15)",  text: "#FB923C", border: "rgba(249,115,22,0.35)" },
  "7-a-side":   { bg: "rgba(251,191,36,0.12)",  text: "#FBBF24", border: "rgba(251,191,36,0.35)" },
  "full-pitch": { bg: "rgba(96,130,200,0.12)",  text: "#90a8d8", border: "rgba(96,130,200,0.30)" },
};

const STATUS_STYLES: Record<AdminBooking["status"], { bg: string; text: string; icon: typeof CheckCircle2 }> = {
  confirmed: { bg: "rgba(34,197,94,0.12)",  text: "#4ade80", icon: CheckCircle2 },
  pending:   { bg: "rgba(251,191,36,0.12)", text: "#FBBF24", icon: Clock       },
  cancelled: { bg: "rgba(239,68,68,0.12)",  text: "#f87171", icon: XCircle     },
};

function formatDate(d: string) {
  return format(parseISO(d), "EEE, MMM d");
}

// ── Revenue helpers ────────────────────────────────────────────────────────
function totalRevenue(bookings: AdminBooking[]) {
  return bookings.filter(b => b.status !== "cancelled").reduce((s, b) => s + b.depositPaid, 0);
}

// ── Booking detail modal ──────────────────────────────────────────────────
function BookingModal({ booking, onClose }: { booking: AdminBooking; onClose: () => void }) {
  const pc = PITCH_COLORS[booking.pitchId];
  const sc = STATUS_STYLES[booking.status];
  const StatusIcon = sc.icon;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="glass-card p-8 max-w-md w-full relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-[#3d5a90] hover:text-white transition-colors">
          <X size={20} />
        </button>

        {/* Booking ID + status */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-[#3d5a90] text-xs tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>
            {booking.id}
          </span>
          <span className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full"
            style={{ background: sc.bg, color: sc.text }}>
            <StatusIcon size={12} />
            {booking.status.toUpperCase()}
          </span>
        </div>

        <h2 className="text-white text-3xl mb-1" style={{ fontFamily: "var(--font-display)" }}>
          {booking.playerName}
        </h2>
        <p className="text-[#6080b8] text-sm mb-6">{booking.teamName}</p>

        <div className="space-y-3 mb-6">
          {[
            { label: "Pitch",   value: booking.pitchName, style: { color: pc.text } },
            { label: "Date",    value: formatDate(booking.date) },
            { label: "Time",    value: booking.timeLabel },
            { label: "Players", value: `${booking.players} players` },
            { label: "Email",   value: booking.email },
            { label: "Phone",   value: booking.phone },
          ].map(({ label, value, style }) => (
            <div key={label} className="flex justify-between py-2 border-b border-white/[0.05]">
              <span className="text-[#3d5a90] text-sm">{label}</span>
              <span className="text-sm" style={style ?? { color: "#fff" }}>{value}</span>
            </div>
          ))}
        </div>

        <div className="glass-card p-4 flex justify-between items-center">
          <div>
            <div className="text-[#3d5a90] text-xs mb-1">Full Price</div>
            <div className="text-white font-semibold">${booking.priceFull} CAD</div>
          </div>
          <div className="text-right">
            <div className="text-[#3d5a90] text-xs mb-1">Deposit Paid</div>
            <div className="text-[#F97316] font-semibold text-lg">${booking.depositPaid} CAD</div>
          </div>
          <div className="text-right">
            <div className="text-[#3d5a90] text-xs mb-1">Balance Due</div>
            <div className="text-white font-semibold">${booking.priceFull - booking.depositPaid} CAD</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Schedule grid view ────────────────────────────────────────────────────
const SCHEDULE_TIMES = ["07:00","09:00","10:00","12:00","13:00","15:00","17:00","18:00","19:00","20:00","21:00"];
const PITCHES = [
  { id: "5-a-side",   name: "Pitch Alpha" },
  { id: "7-a-side",   name: "Pitch Beta"  },
  { id: "full-pitch", name: "Main Arena"  },
];

function ScheduleGrid({ date, bookings, onSelect }: { date: Date; bookings: AdminBooking[]; onSelect: (b: AdminBooking) => void }) {
  const dateStr = format(date, "yyyy-MM-dd");
  const dayBookings = bookings.filter(b => b.date === dateStr);

  return (
    <div className="glass-card overflow-hidden">
      {/* Header row */}
      <div className="grid border-b border-white/[0.06]" style={{ gridTemplateColumns: "80px repeat(3, 1fr)" }}>
        <div className="py-3 px-3 text-[#3d5a90] text-xs text-center" style={{ fontFamily: "var(--font-mono)" }}>TIME</div>
        {PITCHES.map(p => {
          const pc = PITCH_COLORS[p.id];
          return (
            <div key={p.id} className="py-3 px-3 text-center border-l border-white/[0.06]">
              <span className="text-xs font-semibold tracking-wider" style={{ color: pc.text, fontFamily: "var(--font-display)" }}>
                {p.name.toUpperCase()}
              </span>
            </div>
          );
        })}
      </div>

      {/* Time slots */}
      {SCHEDULE_TIMES.map((time, ti) => (
        <div key={time} className={`grid border-b border-white/[0.04] ${ti % 2 === 0 ? "bg-white/[0.01]" : ""}`}
          style={{ gridTemplateColumns: "80px repeat(3, 1fr)" }}>
          <div className="py-3 px-3 flex items-center justify-center text-[#3d5a90] text-xs"
            style={{ fontFamily: "var(--font-mono)" }}>
            {time}
          </div>
          {PITCHES.map(p => {
            const booking = dayBookings.find(b => b.pitchId === p.id && b.time === time);
            const pc = PITCH_COLORS[p.id];
            return (
              <div key={p.id} className="py-2 px-2 border-l border-white/[0.04]">
                {booking ? (
                  <button onClick={() => onSelect(booking)}
                    className="w-full rounded-lg px-3 py-2 text-left transition-all hover:opacity-90 group"
                    style={{ background: pc.bg, border: `1px solid ${pc.border}` }}>
                    <div className="text-xs font-semibold truncate" style={{ color: pc.text }}>
                      {booking.playerName}
                    </div>
                    <div className="text-xs truncate mt-0.5" style={{ color: pc.text, opacity: 0.7 }}>
                      {booking.teamName}
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[0.6rem] px-1.5 py-0.5 rounded-full"
                        style={{ background: STATUS_STYLES[booking.status].bg, color: STATUS_STYLES[booking.status].text }}>
                        {booking.status}
                      </span>
                      <Eye size={10} style={{ color: pc.text, opacity: 0 }} className="group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                ) : (
                  <div className="w-full rounded-lg px-3 py-2 border border-white/[0.04] text-center">
                    <span className="text-[#2a3f6a] text-xs">—</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ── Main admin page ───────────────────────────────────────────────────────
export default function AdminPage() {
  const [pin, setPin]           = useState("");
  const [authed, setAuthed]     = useState(false);
  const [pinError, setPinError] = useState(false);
  const [view, setView]         = useState<"schedule" | "list">("schedule");
  const [scheduleDate, setScheduleDate] = useState(new Date());
  const [search, setSearch]     = useState("");
  const [selected, setSelected] = useState<AdminBooking | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | AdminBooking["status"]>("all");

  // ── Derived values — must be declared BEFORE any early return ────────────
  const confirmed  = MOCK_BOOKINGS.filter(b => b.status === "confirmed");
  const pending    = MOCK_BOOKINGS.filter(b => b.status === "pending");
  const revenue    = totalRevenue(MOCK_BOOKINGS);
  const todayStr   = format(new Date(), "yyyy-MM-dd");
  const todayCount = MOCK_BOOKINGS.filter(b => b.date === todayStr && b.status !== "cancelled").length;

  const filtered = useMemo(() => {
    return MOCK_BOOKINGS.filter(b => {
      const matchStatus = statusFilter === "all" || b.status === statusFilter;
      const q = search.toLowerCase();
      const matchSearch = !q || b.playerName.toLowerCase().includes(q)
        || b.teamName.toLowerCase().includes(q) || b.id.toLowerCase().includes(q)
        || b.email.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    }).sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
  }, [search, statusFilter]);

  // ── Auth gate — early return AFTER all hooks ─────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#06080f]"
        style={{ backgroundImage: "radial-gradient(at 50% 30%, rgba(249,115,22,0.12) 0%, transparent 60%)" }}>
        <div className="glass-card p-10 w-full max-w-sm text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F97316] to-[#EA580C] flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(249,115,22,0.35)]">
            <Flame size={24} className="text-white fill-white" />
          </div>
          <h1 className="text-white text-4xl mb-1" style={{ fontFamily: "var(--font-display)" }}>ADMIN PORTAL</h1>
          <p className="text-[#3d5a90] text-sm mb-8">MTLWC Arena — Restricted Access</p>

          <div className="mb-4">
            <input type="password" placeholder="Enter PIN" value={pin}
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
            {pinError && <p className="text-red-400 text-xs mt-2">Incorrect PIN. Try again.</p>}
          </div>
          <button onClick={() => { if (pin === ADMIN_PIN) setAuthed(true); else setPinError(true); }}
            className="btn-neon w-full justify-center">Unlock Dashboard</button>
          <p className="text-[#2a3f6a] text-xs mt-6">Demo PIN: 1234</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06080f]" style={{ backgroundImage: "radial-gradient(at 30% 0%, rgba(249,115,22,0.08) 0%, transparent 50%)" }}>
      {/* Top nav */}
      <header className="border-b border-white/[0.05] bg-[#080f1c]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#F97316] to-[#EA580C] flex items-center justify-center">
              <Flame size={13} className="text-white fill-white" />
            </div>
            <span className="text-white text-xl tracking-[0.1em]" style={{ fontFamily: "var(--font-display)" }}>
              MTL<span className="text-[#F97316]">WC</span>
              <span className="text-[#3d5a90] text-base ml-2 tracking-widest">ADMIN</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" className="text-[#3d5a90] hover:text-white text-sm transition-colors">← Public Site</a>
            <button onClick={() => setAuthed(false)}
              className="flex items-center gap-1.5 text-[#3d5a90] hover:text-white text-sm transition-colors">
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* KPI cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: DollarSign, label: "Deposits Collected",  value: `$${revenue.toLocaleString()}`, sub: "CAD this week", color: "#F97316" },
            { icon: CalendarDays, label: "Today's Bookings",  value: String(todayCount),             sub: "across 3 pitches",  color: "#FBBF24" },
            { icon: CheckCircle2, label: "Confirmed",          value: String(confirmed.length),      sub: "upcoming sessions", color: "#4ade80" },
            { icon: Clock, label: "Awaiting Deposit",          value: String(pending.length),        sub: "need confirmation", color: "#90a8d8" },
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
            BOOKING SCHEDULE
          </h2>
          <div className="flex items-center gap-2">
            <button onClick={() => setView("schedule")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm transition-all ${
                view === "schedule" ? "bg-[#F97316] text-white" : "text-[#3d5a90] hover:text-white border border-white/10"
              }`}>
              <LayoutGrid size={14} /> Schedule
            </button>
            <button onClick={() => setView("list")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm transition-all ${
                view === "list" ? "bg-[#F97316] text-white" : "text-[#3d5a90] hover:text-white border border-white/10"
              }`}>
              <List size={14} /> List
            </button>
          </div>
        </div>

        {/* ── Schedule view ─────────────────────────────────────────────── */}
        {view === "schedule" && (
          <div>
            {/* Date nav */}
            <div className="flex items-center gap-3 mb-4">
              <button onClick={() => setScheduleDate(d => addDays(d, -1))}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-[#6080b8] hover:text-white border border-white/10 hover:border-white/30 transition-all">
                <ChevronLeft size={16} />
              </button>
              <div className="glass-card px-5 py-2 text-white font-medium" style={{ fontFamily: "var(--font-display)", letterSpacing: "0.06em" }}>
                {format(scheduleDate, "EEEE, MMMM d yyyy").toUpperCase()}
                {format(scheduleDate, "yyyy-MM-dd") === todayStr && (
                  <span className="ml-3 text-xs text-[#F97316] border border-[#F97316]/30 px-2 py-0.5 rounded-full">TODAY</span>
                )}
              </div>
              <button onClick={() => setScheduleDate(d => addDays(d, 1))}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-[#6080b8] hover:text-white border border-white/10 hover:border-white/30 transition-all">
                <ChevronRight size={16} />
              </button>
              {/* Quick day chips */}
              <div className="flex gap-2 ml-4 overflow-x-auto no-scrollbar">
                {[0,1,2,3,4,5,6].map(n => {
                  const d = addDays(new Date(), n);
                  const ds = format(d, "yyyy-MM-dd");
                  const active = ds === format(scheduleDate, "yyyy-MM-dd");
                  const count = MOCK_BOOKINGS.filter(b => b.date === ds && b.status !== "cancelled").length;
                  return (
                    <button key={n} onClick={() => setScheduleDate(d)}
                      className={`shrink-0 px-3 py-1.5 rounded-lg text-xs transition-all ${
                        active ? "bg-[#F97316] text-white" : "border border-white/10 text-[#6080b8] hover:text-white hover:border-white/20"
                      }`}>
                      <div style={{ fontFamily: "var(--font-mono)" }}>{format(d, "EEE")}</div>
                      <div className="text-[0.65rem] opacity-70">{count > 0 ? `${count} bk` : "—"}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pitch legend */}
            <div className="flex items-center gap-5 mb-4">
              {PITCHES.map(p => (
                <div key={p.id} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm" style={{ background: PITCH_COLORS[p.id].bg, border: `1px solid ${PITCH_COLORS[p.id].border}` }} />
                  <span className="text-[#6080b8] text-xs">{p.name}</span>
                </div>
              ))}
              <div className="flex items-center gap-2 ml-4">
                {Object.entries(STATUS_STYLES).map(([s, ss]) => (
                  <div key={s} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: ss.text }} />
                    <span className="text-[#3d5a90] text-xs capitalize">{s}</span>
                  </div>
                ))}
              </div>
            </div>

            <ScheduleGrid date={scheduleDate} bookings={MOCK_BOOKINGS} onSelect={setSelected} />
          </div>
        )}

        {/* ── List view ──────────────────────────────────────────────────── */}
        {view === "list" && (
          <div>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3d5a90]" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search player, team, ID…"
                  className="w-full pl-9 pr-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-lg text-white text-sm placeholder-[#3d5a90] focus:outline-none focus:border-[#F97316]/40 transition-all" />
              </div>
              <div className="flex gap-2">
                {(["all","confirmed","pending","cancelled"] as const).map(s => (
                  <button key={s} onClick={() => setStatusFilter(s)}
                    className={`px-3 py-2 rounded-lg text-xs capitalize transition-all ${
                      statusFilter === s ? "bg-[#F97316] text-white" : "border border-white/10 text-[#6080b8] hover:text-white"
                    }`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-card overflow-hidden">
              {/* Table header */}
              <div className="grid text-xs uppercase tracking-widest text-[#3d5a90] px-5 py-3 border-b border-white/[0.06]"
                style={{ gridTemplateColumns: "80px 1fr 1fr 120px 90px 90px 80px" }}>
                <span>ID</span><span>Player</span><span>Pitch / Date / Time</span>
                <span>Status</span><span>Deposit</span><span>Full Price</span><span></span>
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-16 text-[#3d5a90] text-sm">No bookings match your search.</div>
              )}

              {filtered.map((b, i) => {
                const pc = PITCH_COLORS[b.pitchId];
                const sc = STATUS_STYLES[b.status];
                const StatusIcon = sc.icon;
                return (
                  <div key={b.id} onClick={() => setSelected(b)}
                    className={`grid items-center px-5 py-4 cursor-pointer hover:bg-white/[0.03] transition-colors ${
                      i < filtered.length - 1 ? "border-b border-white/[0.04]" : ""
                    }`}
                    style={{ gridTemplateColumns: "80px 1fr 1fr 120px 90px 90px 80px" }}>
                    <span className="text-[#3d5a90] text-xs" style={{ fontFamily: "var(--font-mono)" }}>{b.id}</span>
                    <div>
                      <div className="text-white text-sm font-medium">{b.playerName}</div>
                      <div className="text-[#3d5a90] text-xs mt-0.5 flex items-center gap-1">
                        <Users size={10} /> {b.teamName} · {b.players}p
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium" style={{ color: pc.text }}>{b.pitchName}</div>
                      <div className="text-[#3d5a90] text-xs mt-0.5">{formatDate(b.date)} · {b.timeLabel}</div>
                    </div>
                    <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full w-fit"
                      style={{ background: sc.bg, color: sc.text }}>
                      <StatusIcon size={11} /> {b.status}
                    </span>
                    <span className="text-[#F97316] font-semibold text-sm">${b.depositPaid}</span>
                    <span className="text-white text-sm">${b.priceFull}</span>
                    <button onClick={(e) => { e.stopPropagation(); setSelected(b); }}
                      className="flex items-center gap-1 text-[#3d5a90] hover:text-white text-xs transition-colors">
                      <Eye size={13} /> View
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Summary row */}
            {filtered.length > 0 && (
              <div className="flex items-center justify-between mt-4 px-2 text-sm">
                <span className="text-[#3d5a90]">{filtered.length} booking{filtered.length !== 1 ? "s" : ""}</span>
                <span className="text-[#F97316] font-semibold">
                  ${totalRevenue(filtered).toLocaleString()} CAD deposits
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Booking detail modal */}
      {selected && <BookingModal booking={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
