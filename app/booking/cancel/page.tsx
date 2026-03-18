import Link from "next/link";
import { XCircle } from "lucide-react";

export default function BookingCancelPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-32"
      style={{ background: "#06080f" }}>
      <div className="max-w-lg w-full text-center p-14"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "1rem",
        }}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8"
          style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>
          <XCircle size={40} style={{ color: "#ef4444" }} />
        </div>

        <h1 className="text-white text-5xl mb-4"
          style={{ fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)" }}>
          PAYMENT CANCELLED
        </h1>

        <p className="mb-8" style={{ color: "#6080b8" }}>
          Your booking was not completed. No charge has been made.
          You can try again whenever you&apos;re ready.
        </p>

        <Link href="/#booking"
          className="inline-flex items-center justify-center w-full px-6 py-3 rounded-lg text-sm font-medium transition-all"
          style={{
            background: "rgba(249,115,22,0.1)",
            border: "1px solid rgba(249,115,22,0.4)",
            color: "#F97316",
          }}>
          Try Again
        </Link>
      </div>
    </main>
  );
}
