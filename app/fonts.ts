import { Fraunces, IBM_Plex_Mono, Space_Grotesk } from "next/font/google";

export const fraunces = Fraunces({
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-fraunces"
});

export const grotesk = Space_Grotesk({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-grotesk"
});

export const plexMono = IBM_Plex_Mono({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"]
});
