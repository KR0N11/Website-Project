import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MTLWCUP — Terrain intérieur de soccer à Montréal",
  description:
    "Réservez un terrain intérieur de soccer à Montréal. Tournois, ligues compétitives, événements privés et espace FIFA PS5. Réservation en ligne 24/7.",
  keywords: ["soccer intérieur", "terrain montréal", "réserver terrain", "futsal montréal", "MTLWCUP"],
  openGraph: {
    type:        "website",
    locale:      "fr_CA",
    siteName:    "MTLWCUP",
    title:       "MTLWCUP — Terrain intérieur de soccer à Montréal",
    description: "Terrain intérieur de 42 pieds. Tournois, ligues et événements privés. Réservez en ligne.",
  },
};

export const viewport: Viewport = {
  themeColor: "#07070e",
  width:      "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
