import { NextResponse } from "next/server";
import { Resend } from "resend";

const ADMIN_EMAIL = "mtlworldcup@gmail.com";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn("RESEND_API_KEY not set — skipping email");
      return NextResponse.json({ success: true, skipped: true });
    }
    const resend = new Resend(apiKey);
    const body = await request.json();
    const { playerName, email, phone, teamName, pitchName, date, time, duration, price, pack, notes } = body;

    // Build the email HTML
    const packLine = pack ? `<tr><td style="color:#888;padding:6px 0">Pack demandé</td><td style="text-align:right;color:#F97316;font-weight:600">${pack}</td></tr>` : "";
    const notesLine = notes ? `<tr><td style="color:#888;padding:6px 0">Notes</td><td style="text-align:right;color:#fff">${notes}</td></tr>` : "";

    const htmlContent = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;background:#0a0f1a;color:#fff;border-radius:12px;overflow:hidden">
      <div style="background:linear-gradient(135deg,#F97316,#EA580C);padding:30px;text-align:center">
        <h1 style="margin:0;font-size:28px;letter-spacing:2px">MTLWCUP</h1>
        <p style="margin:8px 0 0;opacity:0.9;font-size:14px">Nouvelle demande de réservation</p>
      </div>
      <div style="padding:30px">
        <h2 style="color:#F97316;font-size:20px;margin:0 0 20px">Détails de la réservation</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <tr><td style="color:#888;padding:6px 0">Joueur</td><td style="text-align:right;color:#fff;font-weight:600">${playerName}</td></tr>
          <tr><td style="color:#888;padding:6px 0">Courriel</td><td style="text-align:right;color:#fff">${email}</td></tr>
          <tr><td style="color:#888;padding:6px 0">Téléphone</td><td style="text-align:right;color:#fff">${phone}</td></tr>
          ${teamName ? `<tr><td style="color:#888;padding:6px 0">Équipe</td><td style="text-align:right;color:#fff">${teamName}</td></tr>` : ""}
          <tr><td colspan="2" style="border-top:1px solid #222;padding:0;height:12px"></td></tr>
          <tr><td style="color:#888;padding:6px 0">Terrain</td><td style="text-align:right;color:#fff">${pitchName}</td></tr>
          <tr><td style="color:#888;padding:6px 0">Date</td><td style="text-align:right;color:#fff">${date}</td></tr>
          <tr><td style="color:#888;padding:6px 0">Heure</td><td style="text-align:right;color:#fff">${time}</td></tr>
          <tr><td style="color:#888;padding:6px 0">Durée</td><td style="text-align:right;color:#fff">${duration}h</td></tr>
          ${packLine}
          ${notesLine}
          <tr><td colspan="2" style="border-top:1px solid #222;padding:0;height:12px"></td></tr>
          <tr><td style="color:#888;padding:6px 0;font-weight:600">Prix estimé</td><td style="text-align:right;color:#F97316;font-size:18px;font-weight:700">${price}$ CAD</td></tr>
        </table>
        <div style="margin-top:24px;padding:16px;background:#111827;border-radius:8px;border-left:3px solid #F97316">
          <p style="margin:0;color:#F97316;font-size:13px;font-weight:600">⏳ En attente d'approbation</p>
          <p style="margin:6px 0 0;color:#888;font-size:12px">Veuillez confirmer ou refuser cette réservation depuis le portail admin.</p>
        </div>
      </div>
      <div style="padding:20px 30px;background:#080d18;text-align:center;font-size:11px;color:#555">
        MTLWCUP — Montréal World Cup Indoor Soccer
      </div>
    </div>`;

    // Send to admin
    const { error: adminError } = await resend.emails.send({
      from: "MTLWCUP Réservations <onboarding@resend.dev>",
      to: [ADMIN_EMAIL],
      subject: `Nouvelle réservation — ${playerName} — ${date} à ${time}`,
      html: htmlContent,
    });

    if (adminError) {
      console.error("Admin email error:", adminError);
    }

    // Send confirmation to customer
    const customerHtml = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;background:#0a0f1a;color:#fff;border-radius:12px;overflow:hidden">
      <div style="background:linear-gradient(135deg,#F97316,#EA580C);padding:30px;text-align:center">
        <h1 style="margin:0;font-size:28px;letter-spacing:2px">MTLWCUP</h1>
        <p style="margin:8px 0 0;opacity:0.9;font-size:14px">Confirmation de votre demande</p>
      </div>
      <div style="padding:30px">
        <p style="color:#90a8d8;font-size:15px;line-height:1.6">Bonjour <strong style="color:#fff">${playerName}</strong>,</p>
        <p style="color:#90a8d8;font-size:14px;line-height:1.6">
          Votre demande de réservation a bien été reçue. Voici un récapitulatif :
        </p>
        <table style="width:100%;border-collapse:collapse;font-size:14px;margin:20px 0">
          <tr><td style="color:#888;padding:6px 0">Terrain</td><td style="text-align:right;color:#fff">${pitchName}</td></tr>
          <tr><td style="color:#888;padding:6px 0">Date</td><td style="text-align:right;color:#fff">${date}</td></tr>
          <tr><td style="color:#888;padding:6px 0">Heure</td><td style="text-align:right;color:#fff">${time}</td></tr>
          <tr><td style="color:#888;padding:6px 0">Durée</td><td style="text-align:right;color:#fff">${duration}h</td></tr>
          ${packLine}
          <tr><td colspan="2" style="border-top:1px solid #222;padding:0;height:12px"></td></tr>
          <tr><td style="color:#888;padding:6px 0">Prix estimé</td><td style="text-align:right;color:#F97316;font-weight:700">${price}$ CAD</td></tr>
        </table>
        <div style="margin-top:20px;padding:16px;background:#111827;border-radius:8px;border-left:3px solid #FBBF24">
          <p style="margin:0;color:#FBBF24;font-size:13px;font-weight:600">⏳ Statut : En attente de confirmation</p>
          <p style="margin:6px 0 0;color:#888;font-size:12px">Nous vous enverrons un courriel dès que votre réservation sera confirmée.</p>
        </div>
      </div>
      <div style="padding:20px 30px;background:#080d18;text-align:center;font-size:11px;color:#555">
        MTLWCUP — Montréal World Cup Indoor Soccer<br/>
        Questions ? Écrivez-nous à mtlworldcup@gmail.com
      </div>
    </div>`;

    const { error: customerError } = await resend.emails.send({
      from: "MTLWCUP <onboarding@resend.dev>",
      to: [email],
      subject: `Votre demande de réservation — MTLWCUP — ${date}`,
      html: customerHtml,
    });

    if (customerError) {
      console.error("Customer email error:", customerError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email API error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
