import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Coffee } from "lucide-react";
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
  metadataBase: new URL("https://ipl.devtree.site"),
  title: {
    default: "IPL Challenge | Predict & Claim the Crown",
    template: "%s | IPL Challenge",
  },
  description: "Create match prediction cards, challenge friends with custom stakes, and climb the leaderboard as live results unfold pitch-side.",
  openGraph: {
    title: "IPL Challenge | Predict & Claim the Crown",
    description: "Create match prediction cards, challenge friends with custom stakes, and climb the leaderboard.",
    url: "https://ipl.devtree.site",
    siteName: "IPL Challenge",
    images: [
      {
         url: "/og-image.png",
         width: 1200,
         height: 630,
         alt: "IPL Challenge — Predict & Claim the Crown",
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IPL Challenge | Predict & Claim the Crown",
    description: "Create match prediction cards, challenge friends with custom stakes, and climb the leaderboard.",
    creator: "@modamaan",
  },
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
        <main className="flex-1 shrink-0 flex flex-col items-center w-full">
           {children}
        </main>
        
        {/* Global Footer */}
        <footer className="w-full bg-[#0b1326] border-t border-[#2d3449] py-8 mt-auto shrink-0 relative z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[#908fa0] text-sm font-bold tracking-widest uppercase">
              © {new Date().getFullYear()} IPL Challenge. All rights reserved.
            </p>
            <a 
              href="https://buymeacoffee.com/modamaan" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-[#ffdd00] hover:bg-[#ffdd00]/90 text-[#000000] font-black uppercase text-xs tracking-widest rounded-full transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,221,0,0.3)]"
            >
              <Coffee className="w-4 h-4" />
              Buy me a coffee
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
