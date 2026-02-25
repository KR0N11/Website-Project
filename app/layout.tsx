import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ArenaFC — London's Premier Indoor Soccer Facility",
  description:
    "Book a 5-a-side, 7-a-side or full indoor pitch at ArenaFC, Hackney. State-of-the-art 3G & 4G turf, LED floodlights, instant online booking.",
  keywords: ["indoor soccer", "5-a-side London", "book a pitch", "football arena", "indoor football"],
  openGraph: {
    type:        "website",
    locale:      "en_GB",
    url:         "https://arenafc.co.uk",
    siteName:    "ArenaFC",
    title:       "ArenaFC — London's Premier Indoor Soccer Facility",
    description: "Premium indoor football pitches in Hackney, London. Book online in 60 seconds.",
    images: [{ url: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1200&h=630&q=80" }],
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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
