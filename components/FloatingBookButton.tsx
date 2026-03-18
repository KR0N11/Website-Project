"use client";
import { CalendarDays } from "lucide-react";

export default function FloatingBookButton() {
  return (
    <a
      href="#booking"
      className="fixed bottom-6 left-6 z-50 flex items-center gap-2 bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white px-4 py-3 rounded-full shadow-[0_0_25px_rgba(249,115,22,0.4)] hover:shadow-[0_0_35px_rgba(249,115,22,0.6)] hover:scale-105 transition-all duration-300 group"
      style={{ fontFamily: "var(--font-display)" }}
    >
      <CalendarDays size={18} className="group-hover:rotate-12 transition-transform" />
      <span className="text-sm tracking-wider uppercase font-semibold">Réserver</span>
    </a>
  );
}
