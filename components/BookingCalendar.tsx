"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isPast, startOfWeek, endOfWeek, isSameMonth, addMonths, subMonths } from "date-fns";

type Props = { selected: Date | null; onSelect: (date: Date) => void };

export default function BookingCalendar({ selected, onSelect }: Props) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const monthStart = startOfMonth(currentMonth);
  const monthEnd   = endOfMonth(currentMonth);
  const calStart   = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd     = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days       = eachDayOfInterval({ start: calStart, end: calEnd });

  const isDisabled = (d: Date) => isPast(d) && !isToday(d);

  return (
    <div className="glass-card p-6 select-none">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-[#6080b8] hover:text-white hover:bg-white/10 transition-all">
          <ChevronLeft size={18} />
        </button>
        <h3 className="text-white text-xl tracking-[0.08em]" style={{ fontFamily: "var(--font-display)" }}>
          {format(currentMonth, "MMMM yyyy").toUpperCase()}
        </h3>
        <button onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-[#6080b8] hover:text-white hover:bg-white/10 transition-all">
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-3">
        {["Mo","Tu","We","Th","Fr","Sa","Su"].map((d) => (
          <div key={d} className="text-center text-[#3d5a90] text-xs tracking-widest uppercase py-1"
            style={{ fontFamily: "var(--font-mono)" }}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const outside    = !isSameMonth(day, currentMonth);
          const disabled   = isDisabled(day);
          const isSelected = selected ? isSameDay(day, selected) : false;
          const today      = isToday(day);
          return (
            <button key={day.toISOString()} disabled={disabled || outside}
              onClick={() => !disabled && !outside && onSelect(day)}
              className={`relative aspect-square flex items-center justify-center rounded-lg text-sm transition-all duration-200
                ${outside  ? "opacity-0 pointer-events-none" : ""}
                ${disabled ? "text-[#2a3f6a] cursor-not-allowed" : "cursor-pointer"}
                ${!disabled && !outside && !isSelected ? "text-[#90a8d8] hover:bg-white/10 hover:text-white" : ""}
                ${isSelected ? "text-white font-semibold" : ""}
                ${today && !isSelected ? "border border-[#F97316]/40 text-white" : ""}
              `}
              style={isSelected ? {
                background: "linear-gradient(135deg, #F97316, #EA580C)",
                boxShadow: "0 0 15px rgba(249,115,22,0.45)"
              } : {}}>
              {format(day, "d")}
              {today && !isSelected && (
                <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#F97316]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
