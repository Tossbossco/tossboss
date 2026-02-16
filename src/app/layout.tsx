import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { GeistPixelSquare } from "geist/font/pixel";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "TossBoss | Reliable Valet Trash + Recycling | North Georgia",
  description: "Reliable valet trash and recycling for multifamily communities in Cumming and North Georgia. Switch providers with a no-gap transition plan or launch in 7-10 business days. 99.2% on-time service.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${cormorant.variable} ${inter.variable} ${GeistMono.variable} ${GeistPixelSquare.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
