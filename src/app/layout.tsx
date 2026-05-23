import type { Metadata } from "next";
import { Playfair_Display, Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { ToastProvider } from "@/components/ui/Toast";
import { Providers } from "@/components/layout/Providers";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Kraafto | Luxury Gifting & Crafts",
    template: "%s | Kraafto",
  },
  description:
    "Discover premium handcrafted luxury gifts. Kraafto curates artisan-made home décor, apparel, and gifting collections crafted for the discerning.",
  openGraph: {
    siteName: "Kraafto",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} ${cormorant.variable}`}>
      <body
        className={`font-body antialiased bg-obsidian text-ivory min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        <Providers>
          <CartProvider>
            <ToastProvider>
              <Navbar />
              <div className="flex-grow">{children}</div>
              <Footer />
              <CartDrawer />
            </ToastProvider>
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}
