import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Elderly Care - DGS Frontend",
  description: "Sistema de gestión para cuidado de adultos mayores",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link 
          href="https://fonts.googleapis.com/icon?family=Material+Icons" 
          rel="stylesheet" 
        />
      </head>
      <body
        className={`${inter.variable} ${roboto.variable} antialiased font-sans`}
        style={{ fontFamily: 'Roboto, Inter, sans-serif', backgroundColor: '#f8fafc' }}
      >
        {children}
      </body>
    </html>
  );
}
