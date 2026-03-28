import { auth } from "@/auth";
import { db } from "@/lib/db";
import { matches } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { createMatch, resolveMatch } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IPL_TEAMS } from "@/lib/teams";
import Link from "next/link";
import { ArrowLeft, Rocket, Activity, CheckCircle2, ShieldAlert } from "lucide-react";

export default async function AdminPage() {
  const session = await auth();

  if (!session || session.user?.email !== process.env.ADMIN_EMAIL || !process.env.ADMIN_EMAIL) {
    return (
      <div className="p-8 text-white min-h-screen bg-[#0b1326] flex flex-col justify-center items-center font-['Inter',_sans-serif]">
        <ShieldAlert className="w-16 h-16 text-[#ef4444] mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
        <h2 className="text-4xl font-['Space_Grotesk',_sans-serif] font-black italic uppercase text-white mb-2">Access Denied</h2>
        <p className="text-[#908fa0] uppercase tracking-widest text-xs font-bold">Level 4 Clearance Required</p>
        <Link href="/dashboard" className="text-[#c0c1ff] hover:text-white uppercase tracking-wider font-bold mt-8 border border-[#c0c1ff]/30 px-6 py-3 rounded-md transition-colors bg-[#c0c1ff]/5">Return to Arena</Link>
      </div>
    );
  }

  const allMatches = await db.select().from(matches).orderBy(desc(matches.createdAt));

  return (
    <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] font-['Inter',_sans-serif] selection:bg-[#c0c1ff] selection:text-[#0b1326] pb-24 overflow-x-hidden">
      <nav className="border-b border-[#2d3449] bg-[#0b1326]/80 backdrop-blur-md sticky top-0 z-50">
         <div className="max-w-[1400px] mx-auto px-6 flex items-center h-[72px]">
           <Link href="/dashboard" className="flex items-center gap-3 text-[#908fa0] hover:text-white transition-colors group font-bold tracking-widest uppercase text-xs">
             <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
             Return to Dashboard
           </Link>
         </div>
       </nav>

      <div className="max-w-[1400px] mx-auto py-12 px-6 space-y-8">
        <h1 className="text-4xl md:text-5xl font-['Space_Grotesk',_sans-serif] font-black text-white italic uppercase tracking-tighter mb-12 drop-shadow-md">
          Admin <span className="text-[#ffb0cd]">Control Center</span>
        </h1>

        <div className="grid lg:grid-cols-3 gap-10">
          
          {/* SPAWN NEW MATCH PANEL */}
          <div className="lg:col-span-1">
             <div className="bg-[#131b2e] rounded-2xl border border-[#2d3449] shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden relative group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#c0c1ff] to-[#494bd6]"></div>
                <div className="p-6 border-b border-[#2d3449] bg-[#171f33]/50 flex items-center gap-3">
                   <div className="w-10 h-10 rounded-lg bg-[#c0c1ff]/10 flex items-center justify-center border border-[#c0c1ff]/20">
                     <Rocket className="w-5 h-5 text-[#c0c1ff]" />
                   </div>
                   <h2 className="text-2xl font-['Space_Grotesk',_sans-serif] font-black italic uppercase text-white tracking-wider">Spawn Match</h2>
                </div>
                <div className="p-6">
                  <form action={createMatch} className="space-y-5">
                    <div>
                       <label className="text-[10px] text-[#908fa0] uppercase font-black tracking-[0.2em] mb-1.5 block">Team 1</label>
                       <Select name="team1" required>
                         <SelectTrigger suppressHydrationWarning className="bg-[#0b1326] border-[#2d3449] text-white font-bold h-12 focus-visible:ring-[#c0c1ff] w-full">
                           <SelectValue placeholder="Select Team" />
                         </SelectTrigger>
                         <SelectContent className="bg-[#131b2e] border-[#2d3449] text-white font-bold max-h-[300px]">
                           {IPL_TEAMS.map((team) => (
                             <SelectItem key={`team1-${team.id}`} value={team.id}>
                               <div className="flex items-center gap-2">
                                 <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: team.primaryColor }}></div>
                                 <span>{team.id} - {team.name}</span>
                               </div>
                             </SelectItem>
                           ))}
                         </SelectContent>
                       </Select>
                    </div>
                    <div>
                       <label className="text-[10px] text-[#908fa0] uppercase font-black tracking-[0.2em] mb-1.5 block">Team 2</label>
                       <Select name="team2" required>
                         <SelectTrigger suppressHydrationWarning className="bg-[#0b1326] border-[#2d3449] text-white font-bold h-12 focus-visible:ring-[#c0c1ff] w-full">
                           <SelectValue placeholder="Select Opponent" />
                         </SelectTrigger>
                         <SelectContent className="bg-[#131b2e] border-[#2d3449] text-white font-bold max-h-[300px]">
                           {IPL_TEAMS.map((team) => (
                             <SelectItem key={`team2-${team.id}`} value={team.id}>
                               <div className="flex items-center gap-2">
                                 <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: team.primaryColor }}></div>
                                 <span>{team.id} - {team.name}</span>
                               </div>
                             </SelectItem>
                           ))}
                         </SelectContent>
                       </Select>
                    </div>
                    <div>
                       <label className="text-[10px] text-[#908fa0] uppercase font-black tracking-[0.2em] mb-1.5 block">Match Start Time</label>
                       <Input type="datetime-local" name="matchTime" required className="bg-[#0b1326] border-[#2d3449] text-white h-12 focus-visible:ring-[#c0c1ff] [color-scheme:dark]" />
                    </div>
                    <Button type="submit" className="w-full bg-[#c0c1ff] hover:bg-[#e1e0ff] text-[#07006c] font-['Space_Grotesk',_sans-serif] font-black italic tracking-widest uppercase text-base h-14 mt-4 shadow-[0_0_20px_rgba(192,193,255,0.2)] hover:shadow-[0_0_30px_rgba(192,193,255,0.4)] transition-all">
                      Initialize Match
                    </Button>
                  </form>
                </div>
             </div>
          </div>

          {/* LIVE MATCHES PANEL */}
          <div className="lg:col-span-2 space-y-6">
             <div className="flex items-center gap-3">
               <Activity className="w-6 h-6 text-[#ffb0cd] animate-pulse" />
               <h2 className="text-2xl font-['Space_Grotesk',_sans-serif] font-black italic uppercase text-white tracking-wider">Live Server Matrix</h2>
             </div>
             
             <div className="grid sm:grid-cols-2 gap-6">
               {allMatches.map(m => (
                  <div key={m.id} className="bg-[#131b2e] rounded-xl border border-[#2d3449] shadow-xl overflow-hidden relative flex flex-col group">
                    <div className={`absolute top-0 left-0 w-full h-1 ${m.status === 'completed' ? 'bg-gradient-to-r from-[#10b981] to-[#059669]' : 'bg-gradient-to-r from-[#ffb0cd] to-[#aa0266]'}`}></div>
                    
                    <div className="p-6 border-b border-[#2d3449] bg-[#171f33]/30 flex gap-4 items-center justify-between">
                       <div className="font-['Space_Grotesk',_sans-serif] font-black text-2xl italic text-white tracking-wider uppercase">
                         {m.team1} <span className="text-[#908fa0] text-base mx-1 font-medium not-italic">vs</span> {m.team2}
                       </div>
                       <div className={`px-2.5 py-1 rounded-sm text-[9px] font-black uppercase tracking-[0.2em] whitespace-nowrap border ${m.status === 'completed' ? 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30' : 'bg-[#ffb0cd]/10 text-[#ffb0cd] border-[#ffb0cd]/30'}`}>
                         {m.status}
                       </div>
                    </div>
                    
                    <div className="p-6 flex-1 bg-[#0b1326]/50 relative z-10">
                      {m.status !== "completed" ? (
                        <form action={resolveMatch} className="space-y-4">
                          <input type="hidden" name="matchId" value={m.id} />
                          
                          <div className="grid grid-cols-2 gap-3">
                            <Input name="tossWinner" placeholder="Toss Winner" required className="bg-[#0b1326] border-[#2d3449] text-white text-sm focus-visible:ring-[#ffb0cd]" />
                            <Input name="matchResult" placeholder="Match Winner" required className="bg-[#0b1326] border-[#2d3449] text-white text-sm focus-visible:ring-[#ffb0cd]" />
                          </div>
                          
                          <Select name="totalRuns" required>
                            <SelectTrigger className="bg-[#0b1326] border-[#2d3449] text-white w-full focus:ring-[#ffb0cd]">
                              <SelectValue placeholder="Total Runs Bracket" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#131b2e] border-[#2d3449] text-white font-bold">
                              <SelectItem value="<150">Under 150</SelectItem>
                              <SelectItem value="150-170">150 - 170</SelectItem>
                              <SelectItem value="171-190">171 - 190</SelectItem>
                              <SelectItem value="190+">191+</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          <Input name="topScorer" placeholder="Top Scorer (e.g. Kohli)" required className="bg-[#0b1326] border-[#2d3449] text-white text-sm focus-visible:ring-[#ffb0cd]" />
                          <Input name="playerPerf" placeholder="Player Performance" required className="bg-[#0b1326] border-[#2d3449] text-white text-sm focus-visible:ring-[#ffb0cd]" />
                          
                          <Button type="submit" className="w-full bg-[#10b981] hover:bg-[#059669] text-[#064e3b] font-['Space_Grotesk',_sans-serif] font-black italic uppercase tracking-widest mt-4 h-12 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all">
                            Resolve Match & Push Points
                          </Button>
                        </form>
                      ) : (
                        <div className="h-full flex flex-col justify-center items-center text-center py-6">
                           <div className="w-14 h-14 rounded-xl bg-[#10b981]/10 flex items-center justify-center mb-4 border border-[#10b981]/30">
                              <CheckCircle2 className="w-8 h-8 text-[#10b981]" />
                           </div>
                           <p className="font-['Space_Grotesk',_sans-serif] font-black italic uppercase tracking-wider text-white text-lg">Matrix Verified</p>
                           <p className="text-[10px] uppercase tracking-widest font-bold text-[#10b981] mt-1 bg-[#10b981]/10 px-3 py-1 rounded-sm border border-[#10b981]/20">Points Distributed</p>
                        </div>
                      )}
                    </div>
                  </div>
               ))}
               {allMatches.length === 0 && (
                 <div className="col-span-1 sm:col-span-2 text-[#908fa0] py-14 text-center border-2 border-dashed border-[#2d3449] rounded-2xl bg-[#131b2e]/30 font-bold uppercase tracking-widest text-sm">
                   No active matrix simulations.
                 </div>
               )}
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
