import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      pitchId,
      pitchName,
      date,
      time,
      timeLabel,
      playerName,
      teamName,
      email,
      phone,
      players,
      priceFull,
      depositPaid,
    } = body;

    // Validate required fields
    if (!pitchId || !date || !time || !playerName || !email || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    // Create a pending booking in the database first
    const booking = await prisma.booking.create({
      data: {
        pitchId,
        pitchName,
        date,
        time,
        timeLabel,
        playerName,
        teamName: teamName ?? "",
        email,
        phone,
        players: Number(players),
        priceFull: Number(priceFull),
        depositPaid: Number(depositPaid),
        status: "pending",
      },
    });

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "cad",
            unit_amount: Math.round(Number(depositPaid) * 100), // Stripe uses cents
            product_data: {
              name: `${pitchName} — ${timeLabel} on ${date}`,
              description: `50% deposit for ${playerName} (${teamName ?? ""}). Full price: $${priceFull} CAD.`,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId: booking.id,
      },
      success_url: `${appUrl}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/booking/cancel?booking_id=${booking.id}`,
    });

    // Save the Stripe session ID on the booking
    await prisma.booking.update({
      where: { id: booking.id },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("POST /api/checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
