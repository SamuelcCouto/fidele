import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import { CartProvider } from "@/contexts/CartContext"; // 1. O Import (Você trouxe a caixa)

export const metadata: Metadata = {
  title: "FIDÈLE — Loja Oficial",
  description: "Peças pensadas com exclusividade, tecido premium e atitude.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <AnimatedBackground />
        
        {/* 2. O ABRAÇO: Começa aqui! Tudo que está dentro ganha "memória" */}
        <CartProvider>
          
          <Header />
          {children}
          <Footer />
          
        </CartProvider>
        {/* Termina o abraço aqui */}

      </body>
    </html>
  );
}