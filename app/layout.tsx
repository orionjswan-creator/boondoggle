import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  description:
    "Boondoggle is a conference intelligence, city guide, and business-case platform for corporate event travel.",
  title: "Boondoggle | Conference Intelligence"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
