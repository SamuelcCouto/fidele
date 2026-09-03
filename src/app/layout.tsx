import type { Metadata } from "next";
import { Caveat, Manrope, Nosifer, Space_Mono, Titan_One } from "next/font/google";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { AnimatedBackground } from "@/components/layout/animated-background";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { siteConfig } from "@/config/site";
import { CartProvider } from "@/contexts/cart-context";
import { cn } from "@/lib/cn";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

// Antes só a Nosifer era carregada (via @import remoto no CSS): Manrope,
// Space Mono, Titan One e Caveat caíam em fontes do sistema.
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

const titanOne = Titan_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-titan-one",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

const nosifer = Nosifer({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-nosifer",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: siteConfig.title,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={cn(
        manrope.variable,
        spaceMono.variable,
        titanOne.variable,
        caveat.variable,
        nosifer.variable,
      )}
    >
      <head>
        {/* Aplica o tema salvo antes da primeira pintura, sem piscar. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <AnimatedBackground />

        <CartProvider>
          <Header />
          {children}
          <Footer />
          {/* A gaveta lê isCartOpen do contexto — não precisa morar no Header. */}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
