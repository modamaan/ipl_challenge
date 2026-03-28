import { auth } from "@/auth";
import { db } from "@/lib/db";
import { matches } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { PredictionForm } from "@/components/prediction-form";
import Link from "next/link";
import { ArrowLeft, Flame } from "lucide-react";

export default async function PredictPage(props: { params: Promise<{ matchId: string }> }) {
  const session = await auth();
  if (!session) redirect("/");

  const { matchId } = await props.params;

  const matchRes = await db.select().from(matches).where(eq(matches.id, matchId)).limit(1);
  const match = matchRes[0];

  if (!match) return <div className="p-8 text-white min-h-screen bg-[#0b1326]">Match not found.</div>;

  return (
    <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] font-['Inter',_sans-serif] relative selection:bg-[#c0c1ff] selection:text-[#0b1326] pb-20">
      <nav className="border-b border-[#171f33] bg-[#0b1326]/80 backdrop-blur-md sticky top-0 z-50">
         <div className="max-w-[1200px] mx-auto px-6 flex justify-between items-center h-[72px]">
           <Link href="/" className="font-['Space_Grotesk',_sans-serif] font-black text-xl tracking-tighter italic text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-[#c0c1ff]" /> IPL CHALLENGE
           </Link>
           <div className="flex items-center gap-8 text-xs font-bold tracking-widest text-[#908fa0]">
              <Link href="/dashboard" className="hover:text-white uppercase transition-colors">Arena</Link>
           </div>
         </div>
      </nav>

      <main className="max-w-[1100px] mx-auto px-6 pt-16">
         <div className="text-center mb-16">
            <h1 className="text-4xl md:text-[4rem] font-['Space_Grotesk',_sans-serif] font-black uppercase italic tracking-tighter text-white drop-shadow-md">
              MATCH <span className="text-[#ffb95f] ml-2">PREDICTION</span>
            </h1>
            <p className="mt-4 text-[#dae2fd] font-bold tracking-[0.15em] text-xs uppercase">
              Grand Final: <span className="text-white mx-1">{match.team1} VS. {match.team2}</span> • Arena Prime
            </p>
         </div>

         <div className="bg-[#131b2e] rounded-3xl border border-[#2d3449] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] px-4 sm:px-8 md:px-14 pt-8 md:pt-14 pb-8 overflow-hidden relative">
            <PredictionForm match={match} />
         </div>
      </main>
    </div>
  )
}
