import { auth } from "@/auth";
import { db } from "@/lib/db";
import { matches, predictions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { RevealAnimation } from "@/components/reveal-animation";
import Link from "next/link";
import { ArrowLeft, Flame } from "lucide-react";

export default async function ResultsPage(props: { params: Promise<{ matchId: string }> }) {
  const session = await auth();
  if (!session) redirect("/");

  const { matchId } = await props.params;

  const matchRes = await db.select().from(matches).where(eq(matches.id, matchId)).limit(1);
  const match = matchRes[0];

  if (!match || match.status !== "completed") {
    return <div className="p-8 text-white min-h-screen bg-[#0b1326] flex items-center justify-center font-bold text-lg">Match is not completed or does not exist.</div>;
  }

  const predictionRes = await db.select().from(predictions).where(
    eq(predictions.matchId, matchId)
  );
  const prediction = predictionRes.find(p => p.userId === session.user?.id);

  if (!prediction) {
    return (
      <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] flex flex-col items-center justify-center">
        <h1 className="text-3xl font-['Space_Grotesk',_sans-serif] font-black uppercase text-white mb-4">You skipped this match</h1>
        <Link href="/dashboard" className="text-[#c0c1ff] hover:text-white underline font-bold uppercase tracking-wider">Return to Arena</Link>
      </div>
    );
  }

  const parsedResults = match.actualResults as { tossWinner: string, matchWinner: string, totalRuns: string } | null;
  const matchData = {
    tossWinner: parsedResults?.tossWinner || "",
    matchResult: parsedResults?.matchWinner || "",
    totalRuns: parsedResults?.totalRuns || "",
  };

  return (
    <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] font-['Inter',_sans-serif] selection:bg-[#c0c1ff] selection:text-[#0b1326] pb-24">
      <nav className="border-b border-[#171f33] bg-[#0b1326]/80 backdrop-blur-md sticky top-0 z-50">
         <div className="max-w-[1200px] mx-auto px-6 flex justify-between items-center h-[72px]">
           <Link href="/dashboard" className="flex items-center gap-2 text-[#908fa0] hover:text-white transition-colors uppercase font-bold tracking-wider text-xs">
             <ArrowLeft className="w-4 h-4" /> Return to Arena
           </Link>
           <div className="inline-block bg-[#131b2e] border border-[#2d3449] text-[#dae2fd] font-bold text-[10px] tracking-[0.2em] uppercase px-4 py-1.5 rounded-sm">
             Match Concluded
           </div>
         </div>
      </nav>

      <main className="max-w-[1000px] mx-auto px-6 pt-16">
         <div className="text-center mb-16">
            <h1 className="text-5xl md:text-[4rem] font-['Space_Grotesk',_sans-serif] font-black uppercase italic tracking-tighter text-white drop-shadow-md">
              <span className="text-[#c0c1ff]">POST-MATCH</span> ANALYSIS
            </h1>
            <p className="mt-4 text-[#dae2fd] font-bold tracking-[0.15em] text-xs uppercase">
              <span className="text-white mx-1">{match.team1} VS. {match.team2}</span> • Results Verification
            </p>
         </div>

         <div className="mt-12">
            <RevealAnimation prediction={prediction} actualResult={matchData} />
         </div>
      </main>
    </div>
  )
}
