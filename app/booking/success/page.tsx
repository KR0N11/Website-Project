import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import Stripe from "stripe";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-02-25.clover",
  });
}

interface Props {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function BookingSuccessPage({ searchParams }: Props) {
  const { session_id } = await searchParams;

  let customerEmail = "";
  let amountPaid = 0;
  let description = "";

  if (session_id) {
    try {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.retrieve(session_id, {
        expand: ["line_items"],
      });
      customerEmail = session.customer_email ?? "";
      amountPaid = (session.amount_total ?? 0) / 100;
      description = session.line_items?.data[0]?.description ?? "";
    } catch {
      // session retrieval failed — still show success UI
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-32"
      style={{ background: "#06080f" }}>
      <div className="max-w-lg w-full text-center glass-card p-14"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "1rem",
        }}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8"
          style={{ background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.3)" }}>
          <CheckCircle2 size={40} style={{ color: "#F97316" }} />
        </div>

        <h1 className="text-white text-5xl mb-4"
          style={{ fontFamily: "var(--font-display, 'Bebas Neue', sans-serif)" }}>
          BOOKING CONFIRMED
        </h1>

        {customerEmail && (
          <p className="mb-3" style={{ color: "#6080b8" }}>
            Confirmation sent to <strong className="text-white">{customerEmail}</strong>
          </p>
        )}

        {description && (
          <div className="mt-8 mb-8 p-5 text-left space-y-3"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "0.75rem" }}>
            <p className="text-sm" style={{ color: "#90a8d8" }}>{description}</p>
            {amountPaid > 0 && (
              <div className="flex justify-between items-center pt-3"
                style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                <span className="text-sm" style={{ color: "#3d5a90" }}>Deposit Paid</span>
                <span className="font-semibold" style={{ color: "#F97316" }}>${amountPaid} CAD</span>
              </div>
            )}
          </div>
        )}

        <Link href="/#booking"
          className="inline-flex items-center justify-center w-full px-6 py-3 rounded-lg text-sm font-medium transition-all"
          style={{
            background: "transparent",
            border: "1px solid rgba(249,115,22,0.4)",
            color: "#F97316",
          }}>
          Book Another Pitch
        </Link>
      </div>
    </main>
  );
}
