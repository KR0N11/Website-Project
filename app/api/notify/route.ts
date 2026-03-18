import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const MTL_EMAIL = "mtlworldcup@gmail.com";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, booking } = body;

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: "RESEND_API_KEY not configured" }, { status: 500 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    if (type === "new_booking") {
      // Notify MTL admin of new booking
      await resend.emails.send({
        from: "MTLWCUP <onboarding@resend.dev>",
        to: [MTL_EMAIL],
        subject: `Nouvelle réservation — ${booking.player_name}`,
        html: `
          <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:20px;">
            <h2 style="color:#F97316;">Nouvelle réservation MTLWCUP</h2>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:8px 0;color:#888;">Joueur</td><td style="padding:8px 0;font-weight:bold;">${booking.player_name}</td></tr>
              <tr><td style="padding:8px 0;color:#888;">Équipe</td><td style="padding:8px 0;">${booking.team_name || "—"}</td></tr>
              <tr><td style="padding:8px 0;color:#888;">Date</td><td style="padding:8px 0;">${booking.date}</td></tr>
              <tr><td style="padding:8px 0;color:#888;">Heure</td><td style="padding:8px 0;">${booking.time}</td></tr>
              <tr><td style="padding:8px 0;color:#888;">Durée</td><td style="padding:8px 0;">${booking.duration} min</td></tr>
              <tr><td style="padding:8px 0;color:#888;">Joueurs</td><td style="padding:8px 0;">${booking.players}</td></tr>
              <tr><td style="padding:8px 0;color:#888;">Prix</td><td style="padding:8px 0;">${booking.price}$ CAD</td></tr>
              <tr><td style="padding:8px 0;color:#888;">Courriel</td><td style="padding:8px 0;">${booking.email}</td></tr>
              <tr><td style="padding:8px 0;color:#888;">Téléphone</td><td style="padding:8px 0;">${booking.phone}</td></tr>
              <tr><td style="padding:8px 0;color:#888;">Statut</td><td style="padding:8px 0;color:#F97316;font-weight:bold;">${booking.status === "awaiting_approval" ? "En attente d'approbation" : "En attente de paiement"}</td></tr>
              ${booking.notes ? `<tr><td style="padding:8px 0;color:#888;">Notes</td><td style="padding:8px 0;">${booking.notes}</td></tr>` : ""}
            </table>
            <p style="margin-top:20px;"><a href="${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/admin" style="display:inline-block;padding:12px 24px;background:#F97316;color:white;text-decoration:none;border-radius:8px;">Voir dans le portail admin</a></p>
          </div>
        `,
      });

      // Notify the customer
      await resend.emails.send({
        from: "MTLWCUP <onboarding@resend.dev>",
        to: [booking.email],
        subject: booking.status === "awaiting_approval"
          ? "MTLWCUP — Demande reçue (en attente d'approbation)"
          : "MTLWCUP — Réservation reçue",
        html: `
          <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:20px;">
            <h2 style="color:#F97316;">MTLWCUP</h2>
            <p>Bonjour ${booking.player_name},</p>
            ${booking.status === "awaiting_approval"
              ? `<p>Votre demande de réservation avec forfait a bien été reçue et est <strong>en attente d'approbation</strong>.</p>
                 <p>Nous vous contacterons à <strong>${booking.email}</strong> une fois votre demande traitée.</p>`
              : `<p>Votre réservation a bien été reçue !</p>`
            }
            <table style="width:100%;border-collapse:collapse;margin:20px 0;">
              <tr><td style="padding:8px 0;color:#888;">Date</td><td style="padding:8px 0;font-weight:bold;">${booking.date}</td></tr>
              <tr><td style="padding:8px 0;color:#888;">Heure</td><td style="padding:8px 0;">${booking.time}</td></tr>
              <tr><td style="padding:8px 0;color:#888;">Durée</td><td style="padding:8px 0;">${booking.duration} min</td></tr>
              <tr><td style="padding:8px 0;color:#888;">Prix</td><td style="padding:8px 0;">${booking.price}$ CAD</td></tr>
            </table>
            <p style="color:#888;font-size:12px;">Pour toute question, contactez-nous à mtlworldcup@gmail.com</p>
          </div>
        `,
      });
    }

    if (type === "booking_approved") {
      await resend.emails.send({
        from: "MTLWCUP <onboarding@resend.dev>",
        to: [booking.email],
        subject: "MTLWCUP — Réservation approuvée !",
        html: `
          <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:20px;">
            <h2 style="color:#4ade80;">Réservation approuvée</h2>
            <p>Bonjour ${booking.player_name},</p>
            <p>Votre réservation a été <strong style="color:#4ade80;">approuvée</strong> !</p>
            <table style="width:100%;border-collapse:collapse;margin:20px 0;">
              <tr><td style="padding:8px 0;color:#888;">Date</td><td style="padding:8px 0;font-weight:bold;">${booking.date}</td></tr>
              <tr><td style="padding:8px 0;color:#888;">Heure</td><td style="padding:8px 0;">${booking.time}</td></tr>
              <tr><td style="padding:8px 0;color:#888;">Prix</td><td style="padding:8px 0;">${booking.price}$ CAD</td></tr>
            </table>
            <p>À bientôt sur le terrain !</p>
            <p style="color:#888;font-size:12px;">MTLWCUP — mtlworldcup@gmail.com</p>
          </div>
        `,
      });
    }

    if (type === "booking_rejected") {
      await resend.emails.send({
        from: "MTLWCUP <onboarding@resend.dev>",
        to: [booking.email],
        subject: "MTLWCUP — Demande de réservation refusée",
        html: `
          <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:20px;">
            <h2 style="color:#f87171;">Demande refusée</h2>
            <p>Bonjour ${booking.player_name},</p>
            <p>Malheureusement, votre demande de réservation pour le <strong>${booking.date}</strong> a été refusée.</p>
            <p>Contactez-nous à <strong>mtlworldcup@gmail.com</strong> pour plus d'informations ou pour réserver un autre créneau.</p>
            <p style="color:#888;font-size:12px;">MTLWCUP — mtlworldcup@gmail.com</p>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Email notification error:", err);
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
  }
}
