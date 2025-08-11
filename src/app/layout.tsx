import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-hero"
});

export const metadata: Metadata = {
  title: "Bokningssystem",
  description: "Ett bokningssystem för att boka tid i ett rum",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} antialiased font-hero bg-[#ECECEC]`}
      >
        {children}
      </body>
    </html>
  );
}
