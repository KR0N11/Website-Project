"use client";
import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";

export default function FloatingReserve() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href="#booking"
      aria-label="Réserver maintenant"
      className={`fixed bottom-6 left-6 z-50 flex items-center gap-2 bg-[#F97316] text-white px-5 py-3 rounded-full shadow-[0_0_25px_rgba(249,115,22,0.4)] hover:shadow-[0_0_35px_rgba(249,115,22,0.6)] transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0 pointer-events-none"
      }`}
      style={{ fontFamily: "var(--font-display)", letterSpacing: "0.08em" }}
    >
      <CalendarDays size={18} />
      RÉSERVER
    </a>
  );
}
