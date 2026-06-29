import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Herald — Your News, Your Rules",
  description:
    "Agrégateur d'événements locaux et culturels personnalisé par IA.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
