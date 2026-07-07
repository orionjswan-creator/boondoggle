import type { Metadata, Viewport } from "next";
import { fraunces, grotesk, plexMono } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  description:
    "Boondoggle takes work somewhere worth remembering — the conferences, cities, and rooms where business gets more interactive, engaging, and fun. Find the event, build the case, book the week.",
  keywords: ["conferences", "business travel", "event intelligence", "corporate events", "city guides"],
  openGraph: {
    description:
      "Find the events around the world where work is more interactive, engaging, and fun — then generate the memo that gets the trip approved.",
    images: ["/assets/campaign/business-global-hero.png"],
    siteName: "Boondoggle",
    title: "Boondoggle — Work trips worth taking",
    type: "website"
  },
  title: {
    default: "Boondoggle — Work trips worth taking",
    template: "%s | Boondoggle"
  }
};

export const viewport: Viewport = {
  themeColor: "#101D28",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html className={`${fraunces.variable} ${grotesk.variable} ${plexMono.variable}`} lang="en">
      <body>{children}</body>
    </html>
  );
}
