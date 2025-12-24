import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import ConditionalMain from "@/components/ConditionalMain";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pilates con Myss - Instructora Profesional",
  description: "Clases de pilates y programas especializados para embarazadas. Encuentra tu equilibrio y conexión con tu cuerpo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${poppins.variable} ${inter.variable} antialiased`}
      >
        <ConditionalNavbar />
        <ConditionalMain>
          {children}
        </ConditionalMain>
      </body>
    </html>
  );
}

