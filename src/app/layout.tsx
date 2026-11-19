import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter, Manrope } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";

// Type pairing — professional fonts for a business store (owner's brief,
// which overrules the frontend-design skill's usual avoidance of Inter
// as a generic default): Manrope is the display face — a clean, modern
// business grotesque for headlines and the wordmark. Inter is the body
// face — the professional business standard, chosen deliberately for
// readability and trust. IBM Plex Mono carries prices, stock and spec
// data — tabular figures that must line up.
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["500", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "CentricLabs — Phones, Laptops, Gadgets & Software Services in Lagos",
  description:
    "CentricLabs: software development, IT consulting, web and mobile apps, plus phones, laptops, spares, accessories and gadgets — from Lagos, Nigeria.",
};

// The shop fetches live catalogue data from the backend API and the header
// reads the cart / current route on the client, so pages are rendered on
// demand instead of being statically prerendered at build time.
export const dynamic = "force-dynamic";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${inter.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-base font-sans text-ink">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
