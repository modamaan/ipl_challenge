import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IPL Challenge",
  description: "High-Octane Esports Prediction Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="font-sans min-h-full flex flex-col bg-[#0b1326] text-[#dae2fd] selection:bg-[#c0c1ff] selection:text-[#0b1326] overflow-x-hidden w-full">
        {children}
      </body>
    </html>
  );
}
