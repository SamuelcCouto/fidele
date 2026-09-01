import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground"; 

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
        {/* Agora o JS do fundo é disparado por este componente no topo do body */}
        <AnimatedBackground/>
        
        <Header/>
        
        {/* Aqui é onde a página atual (vitrine, produto, etc) vai ser injetada! */}
        {children}
        
        <Footer/>
      </body>
    </html>
  );
}