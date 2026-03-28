import { auth } from "@/auth";
import { db } from "@/lib/db";
import { challenges, predictions, users, matches } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { redirect } from "next/navigation";
import { PredictionForm } from "@/components/prediction-form";
import { Swords, Share2, Flame, Award, CircleDollarSign, User } from "lucide-react";
import Link from "next/link";
import { BoardShareButton } from "@/components/board-share-button";
import { CountdownTimer } from "@/components/countdown-timer";

export default async function ChallengePage(props: { params: Promise<{ challengeId: string }> }) {
  const session = await auth();
  if (!session) redirect("/");

  const { challengeId } = await props.params;
  const challengeRes = await db.select().from(challenges).where(eq(challenges.id, challengeId)).limit(1);
  const challenge = challengeRes[0];

  if (!challenge) {
    return <div className="p-8 text-white min-h-screen bg-[#0b1326] flex items-center justify-center font-bold text-2xl">Challenge not found.</div>;
  }

  const matchRes = await db.select().from(matches).where(eq(matches.id, challenge.matchId)).limit(1);
  const match = matchRes[0];

  const creatorRes = await db.select().from(users).where(eq(users.id, challenge.creatorId)).limit(1);
  const creator = creatorRes[0];

  const allPredictions = await db.select({
    prediction: predictions,
    user: users
  }).from(predictions)
    .innerJoin(users, eq(predictions.userId, users.id))
    .where(eq(predictions.challengeId, challengeId));

  const hasPredicted = allPredictions.some(p => p.user.id === session.user?.id);

  if (!hasPredicted) {
    return (
      <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] font-['Inter',_sans-serif] pb-20">
        <nav className="border-b border-[#2d3449] bg-[#0b1326]/80 backdrop-blur-md sticky top-0 z-50">
           <div className="max-w-[1400px] mx-auto px-6 flex justify-between items-center h-[72px]">
             <Link href="/" className="font-['Space_Grotesk',_sans-serif] font-black text-xl tracking-tighter italic text-white flex items-center gap-2">
                KINETIC
             </Link>
             <div className="flex items-center gap-8 text-[10px] sm:text-xs font-bold tracking-widest text-[#908fa0]">
                <Link href="/dashboard" className="text-[#908fa0] hover:text-white uppercase transition-colors hidden sm:inline-block">Arena</Link>
             </div>
             <div className="flex items-center gap-4 text-[#908fa0] hidden sm:flex">
                <Award className="w-4 h-4 hover:text-[#c0c1ff] cursor-pointer transition-colors" />
                <CircleDollarSign className="w-4 h-4 hover:text-[#ffb95f] cursor-pointer transition-colors" />
                <div className="w-6 h-6 rounded-full border border-[#2d3449] overflow-hidden flex items-center justify-center cursor-pointer hover:border-[#c0c1ff] transition-colors">
                   <User className="w-3 h-3 text-[#c0c1ff]" />
                </div>
             </div>
           </div>
        </nav>
        <div className="max-w-[1100px] mx-auto px-4 py-20 text-center">
           <Swords className="w-14 h-14 text-[#c0c1ff] mx-auto mb-6 drop-shadow-[0_0_15px_rgba(192,193,255,0.4)]" />
           <h1 className="text-4xl md:text-5xl font-['Space_Grotesk',_sans-serif] font-black italic uppercase tracking-tighter text-white">
             {creator.name} challenged you!
           </h1>
           <p className="mt-8 text-[#dae2fd] font-bold tracking-[0.1em] text-sm uppercase bg-[#131b2e] border border-[#2d3449] py-3 px-6 rounded-md inline-block shadow-lg">
              Stakes: <span className="text-[#ffb95f] ml-1">{challenge.stakesDescription}</span>
           </p>
        </div>
        <div className="max-w-[1100px] mx-auto px-4">
           <div className="bg-[#131b2e] rounded-3xl border border-[#2d3449] shadow-2xl px-4 sm:px-8 md:px-14 pt-10 md:pt-14 pb-8 mb-20 overflow-hidden relative">
             <PredictionForm match={match} challengeId={challenge.id} />
           </div>
        </div>
      </div>
    );
  }

  const total = allPredictions.length;
  const team1Count = allPredictions.filter(p => p.prediction.matchResult === match.team1).length;
  const team2Count = allPredictions.filter(p => p.prediction.matchResult === match.team2).length;
  const actualTotal = total > 0 ? total : 1; 

  const team1Pct = total > 0 ? Math.round((team1Count / actualTotal) * 100) : 100;
  const team2Pct = total > 0 ? Math.round((team2Count / actualTotal) * 100) : 0;

  const allUsersJS = await db.select().from(users);
  allUsersJS.sort((a,b) => b.totalPoints - a.totalPoints);
  const getGlobalRank = (userId: string) => {
     const idx = allUsersJS.findIndex(u => u.id === userId);
     return idx === -1 ? '--' : (idx + 1).toString().padStart(2, '0');
  }

  return (
    <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] font-['Inter',_sans-serif] selection:bg-[#c0c1ff] selection:text-[#0b1326] pb-24 overflow-x-hidden">
      {/* NAVBAR */}
      <nav className="border-b border-[#2d3449] bg-[#0b1326]/80 backdrop-blur-md sticky top-0 z-50">
         <div className="max-w-[1400px] mx-auto px-6 flex justify-between items-center h-[72px]">
           <Link href="/" className="font-['Space_Grotesk',_sans-serif] font-black text-xl tracking-tighter italic text-white flex items-center gap-2">
              IPL CHALLENGE
           </Link>
           <div className="flex items-center gap-8 text-[10px] sm:text-xs font-bold tracking-widest text-[#908fa0]">
              <Link href="/dashboard" className="text-[#908fa0] hover:text-white uppercase transition-colors hidden sm:inline-block">Arena</Link>
           </div>
           <div className="flex items-center gap-4 text-[#908fa0] hidden sm:flex">
              <Award className="w-5 h-5 hover:text-[#c0c1ff] cursor-pointer transition-colors" />
              <CircleDollarSign className="w-5 h-5 hover:text-[#ffb95f] cursor-pointer transition-colors" />
              <div className="w-7 h-7 rounded-full border border-[#2d3449] overflow-hidden flex items-center justify-center cursor-pointer hover:border-[#c0c1ff] transition-colors ml-2">
                 <User className="w-4 h-4 text-[#c0c1ff]" />
              </div>
           </div>
         </div>
      </nav>

       <main className="max-w-[1240px] mx-auto px-4 py-16">
         {/* HEADER */}
         <div className="text-center mb-16 relative">
           <div className="inline-block bg-[#aa0266] text-[#ffb0cd] font-black text-[10px] tracking-[0.15em] uppercase px-4 py-1.5 rounded-sm mb-6 shadow-[0_0_15px_rgba(170,2,102,0.5)]">Live Challenge</div>
           <h1 className="text-4xl md:text-6xl font-['Space_Grotesk',_sans-serif] font-black italic uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-[#c0c1ff] drop-shadow-[0_0_25px_rgba(192,193,255,0.6)] px-2">
             IPL Challenge
           </h1>
           <p className="mt-6 text-[#dae2fd] text-xs font-bold tracking-[0.1em] uppercase">
             {match.team1} vs {match.team2} • High Stakes Arena
           </p>

           {/* Progress Bar for Sentiment */}
           {total > 1 ? (
             <div className="max-w-[700px] mx-auto mt-14 mb-4">
                <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.15em] mb-4">
                   <div className="text-[#c0c1ff] flex flex-col items-start gap-1.5">
                      <span>Challengers</span>
                      <span className="text-white text-3xl">{team1Pct}%</span>
                   </div>
                   <div className="text-[#ffb0cd] flex flex-col items-end gap-1.5">
                      <span>Opponents</span>
                      <span className="text-white text-3xl">{team2Pct}%</span>
                   </div>
                </div>
                <div className="w-full h-2.5 bg-[#171f33] rounded-full overflow-hidden flex shadow-inner">
                   <div style={{ width: `${team1Pct}%` }} className="bg-[#c0c1ff] shadow-[0_0_15px_rgba(192,193,255,0.9)] transition-all duration-1000"></div>
                   <div style={{ width: `${team2Pct}%` }} className="bg-[#ffb0cd] shadow-[0_0_15px_rgba(255,176,205,0.9)] transition-all duration-1000"></div>
                </div>
             </div>
           ) : (
             <div className="max-w-[700px] mx-auto mt-14 mb-4 opacity-70">
                <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.15em] mb-4">
                   <div className="text-[#c0c1ff] flex flex-col items-start gap-1.5">
                      <span>Challenger</span>
                      <span className="text-white text-3xl">100%</span>
                   </div>
                   <div className="text-[#ffb0cd] flex flex-col items-end gap-1.5 animate-pulse">
                      <span>Awaiting Opponent</span>
                      <span className="text-white text-3xl">--%</span>
                   </div>
                </div>
                <div className="w-full h-2.5 bg-[#171f33] rounded-full overflow-hidden flex shadow-inner">
                   <div className="w-1/2 bg-[#c0c1ff]/50 shadow-[0_0_15px_rgba(192,193,255,0.4)]"></div>
                   <div className="w-1/2 bg-[#ffb0cd]/20 animate-pulse shadow-[0_0_15px_rgba(255,176,205,0.1)]"></div>
                </div>
             </div>
           )}
         </div>

         {/* VERSUS GRID */}
         <div id="vs-board" className="relative mt-20 max-w-[900px] mx-auto p-2 sm:p-6 lg:p-10 rounded-[2.5rem] bg-[#0b1326]">
            <div className="grid md:grid-cols-2 gap-6 md:gap-14">
              {(() => {
                let displayPredictions: any[] = [...allPredictions.slice(0, 2)];
                if (displayPredictions.length === 1) {
                  displayPredictions.push({
                    user: {
                      id: "placeholder",
                      name: "AWAITING OPPONENT",
                      image: null,
                      totalPoints: 0
                    },
                    prediction: {
                      id: "placeholder-pred",
                      matchResult: "???",
                      topScorer: "???",
                    }
                  });
                }
                return displayPredictions.map((entry, idx) => {
                  const isLeft = idx === 0;
                  const isPlaceholder = entry.user.id === "placeholder";
                  return (
                    <div key={entry.prediction.id} className={`bg-[#131b2e] rounded-xl border ${isLeft ? 'border-[#c0c1ff]/30 shadow-[0_10px_50px_rgba(192,193,255,0.08)]' : isPlaceholder ? 'border-[#464554] border-dashed opacity-60' : 'border-[#ffb0cd]/30 shadow-[0_10px_50px_rgba(255,176,205,0.08)]'} relative flex flex-col pt-12 pb-8 overflow-hidden`}>
                       {/* Signature Edge Glow Line */}
                       {!isPlaceholder && <div className={`absolute top-0 bottom-0 w-1 ${isLeft ? 'left-0 bg-[#c0c1ff] shadow-[0_0_20px_rgba(192,193,255,0.6)]' : 'right-0 bg-[#ffb0cd] shadow-[0_0_20px_rgba(255,176,205,0.6)]'}`}></div>}
                       
                       <div className="text-center mb-8 px-8">
                          <div className={`w-28 h-28 mx-auto rounded-xl bg-[#0b1326] border-[3px] relative overflow-visible ${isLeft ? 'border-[#c0c1ff]/40 shadow-[0_0_30px_rgba(192,193,255,0.2)]' : isPlaceholder ? 'border-[#2d3449]' : 'border-[#ffb0cd]/40 shadow-[0_0_30px_rgba(255,176,205,0.2)]'}`}>
                            {entry.user.image ? <img crossOrigin="anonymous" src={entry.user.image} className="w-full h-full object-cover rounded-[10px]" /> : <div className="w-full h-full flex items-center justify-center font-black text-3xl text-[#464554]">{isPlaceholder ? '?' : entry.user.name.charAt(0)}</div>}
                            <div className={`absolute -bottom-3 right-[-10px] px-3 py-1 font-black text-[9px] tracking-widest uppercase rounded-sm z-10 border shadow-lg ${isPlaceholder ? 'bg-[#2d3449] border-[#464554] text-[#908fa0]' : isLeft ? 'bg-[#c0c1ff] text-[#07006c] border-[#c0c1ff]/50' : 'bg-[#ffb0cd] text-[#aa0266] border-[#ffb0cd]/50'}`}>
                              {isPlaceholder ? 'Rank --' : `Rank ${getGlobalRank(entry.user.id)}`}
                            </div>
                          </div>
                          <h3 className={`mt-8 text-[22px] font-['Space_Grotesk',_sans-serif] font-black uppercase tracking-wider ${isLeft ? 'text-[#c0c1ff]' : 'text-[#ffb0cd]'} drop-shadow-md ${isPlaceholder ? '!text-[#908fa0]' : ''}`}>{entry.user.name}</h3>
                       </div>

                       <div className="px-5 space-y-4 relative z-10 bg-[#131b2e]">
                          {[
                             { label: "Match Winner", value: entry.prediction.matchResult },
                             { label: "MVP Prediction", value: entry.prediction.topScorer },
                             { label: "Total Points", value: isPlaceholder ? '--- PTS' : `${entry.user.totalPoints} PTS` }
                          ].map((stat, i) => (
                             <div key={i} className={`bg-[#0b1326] border border-[#2d3449]/70 rounded-lg py-4 px-6 relative overflow-hidden group transition-colors flex flex-col items-center sm:items-start md:items-center justify-center gap-1`}>
                               <div className="text-[#908fa0] text-[8px] font-black uppercase tracking-[0.18em]">{stat.label}</div>
                               <div className={`text-white font-['Space_Grotesk',_sans-serif] font-black italic tracking-wider text-[22px] drop-shadow-sm truncate w-full text-center ${isPlaceholder ? '!text-[#464554]' : ''}`}>{stat.value}</div>
                             </div>
                          ))}
                       </div>
                    </div>
                  )
                });
              })()}
            </div>

             {/* Skewed VS Badge ALWAYS on */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[calc(50%+20px)] md:-translate-y-[calc(50%+10px)] z-20 w-20 h-20 md:w-24 md:h-24 bg-[#0b1326] text-white font-['Space_Grotesk',_sans-serif] font-black italic text-3xl md:text-4xl flex items-center justify-center rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.8)] border-[4px] border-[#c0c1ff]/80 transform rotate-[-12deg] hover:rotate-0 transition-transform duration-300 select-none cursor-pointer group">
               VS
               <div className="absolute -inset-2 bg-[#c0c1ff]/30 blur-2xl -z-10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>

            {/* Branding Watermark (Captured in image) */}
            <div className="mt-10 mb-2 border-t border-[#2d3449]/50 pt-6 flex flex-col items-center justify-center text-center opacity-80">
               <span className="text-[9px] uppercase tracking-[0.3em] font-black text-[#908fa0] mb-1">Generated Via</span>
               <span className="font-['Space_Grotesk',_sans-serif] font-black italic text-sm tracking-wider text-[#dae2fd]">
                 IPL.<span className="text-[#c0c1ff]">DEVTREE</span>.SITE
               </span>
            </div>
         </div>
         
         <div className="mt-20 flex flex-col items-center">
            <BoardShareButton />
            <div className="mt-6 flex items-center gap-2 text-[10px] font-bold tracking-widest text-[#908fa0] uppercase">
              <span className="w-3 h-3 rounded-full border border-[#908fa0] flex items-center justify-center text-[8px]">i</span>
              <CountdownTimer targetDate={match.matchTime} />
            </div>
         </div>
       </main>
    </div>
  )
}
