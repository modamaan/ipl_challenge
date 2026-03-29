import { auth } from "@/auth";
import { db } from "@/lib/db";
import { matches, predictions, users } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import {
  Trophy, Flame, Swords, Calendar, Timer,
  Gamepad2, Medal, ChevronRight
} from "lucide-react";
import Link from "next/link";
import { ChallengeDialog } from "@/components/challenge-dialog";
import { SignOut } from "@/components/auth-button";
import { MobileNav } from "@/components/mobile-nav";
import { RulesDialog } from "@/components/rules-dialog";
import { getTeam } from "@/lib/teams";
import { TeamLogo } from "@/components/team-logo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Arena",
  description: "Welcome to the Arena. Lock in your boldest IPL predictions, dominate your rivals, and climb the ranks.",
};

export default async function Dashboard(props: any) {
  const searchParams = await props.searchParams;
  const filter = searchParams?.filter || 'all';

  const session = await auth();
  let allMatches = await db.select().from(matches).orderBy(desc(matches.createdAt));

  let displayMatches = allMatches;
  if (filter === 'upcoming') displayMatches = allMatches.filter(m => m.status === 'upcoming');
  if (filter === 'completed') displayMatches = allMatches.filter(m => m.status === 'completed');

  let userChallengeIds: Record<string, string> = {};
  let lockedMatchIds: Set<string> = new Set();
  let userPoints = 0;

  if (session?.user?.id) {
    const userReq = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);
    if (userReq.length > 0) {
      userPoints = userReq[0].totalPoints;
    }
    const userPredictions = await db.select({
      matchId: predictions.matchId,
      challengeId: predictions.challengeId
    }).from(predictions)
      .where(eq(predictions.userId, session.user.id));

    userPredictions.forEach(p => {
      lockedMatchIds.add(p.matchId);
      if (p.challengeId) userChallengeIds[p.matchId] = p.challengeId;
    });
  }

  return (
    <div className="w-full min-h-screen bg-[#0b1326] text-[#dae2fd] pb-24 font-['Inter',_sans-serif]">
      {/* KINETIC NAV */}
      <nav className="border-b border-[#171f33] bg-[#0b1326]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="w-full px-6 sm:px-10 h-20 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link href="/" className="font-['Space_Grotesk',_sans-serif] font-black text-xl sm:text-2xl tracking-tighter italic text-white flex items-center gap-2 whitespace-nowrap shrink-0">
              <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-[#c0c1ff]" /> IPL CHALLENGE
            </Link>
            <div className="hidden md:flex items-center gap-8 text-xs font-bold tracking-widest text-[#908fa0]">
              <span className="text-[#dae2fd] border-b-2 border-[#c0c1ff] pb-1.5 uppercase">Arena</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Points Pill (Hidden on tiny screens) */}
            <Link href="/leaderboard" className="hidden sm:flex items-center gap-2.5 bg-[#131b2e] hover:bg-[#171f33] border border-[#2d3449] pl-1.5 pr-4 py-1.5 rounded-full transition-all group shadow-sm" title="View Global Leaderboard">
              <div className="bg-[#ffb95f] text-[#2a1700] text-[9px] font-black uppercase px-2.5 py-1 rounded-full tracking-widest group-hover:shadow-[0_0_10px_rgba(255,185,95,0.4)] transition-all">Points</div>
              <span className="text-white font-bold text-sm tracking-wider">{userPoints.toLocaleString()}</span>
            </Link>

            {/* Avatar + Signout (Desktop) */}
            <div className="hidden md:flex items-center gap-3 pl-2 border-l border-[#2d3449]">
              {session?.user?.image ? (
                <img src={session.user.image} alt="User" className="w-9 h-9 rounded-md border border-[#31394d] object-cover" />
              ) : (
                <div className="w-9 h-9 rounded-md bg-[#171f33] border border-[#31394d] flex items-center justify-center font-bold text-[#c0c1ff]">
                  {session?.user?.name?.charAt(0) || "U"}
                </div>
              )}
              <div className="text-sm">
                <SignOut />
              </div>
            </div>

            {/* MOBILE NAV TOGGLE */}
            <MobileNav
              userPoints={userPoints.toLocaleString()}
              userName={session?.user?.name || "Player"}
              signOutButton={<SignOut />}
            />
          </div>
        </div>
      </nav>

      <main>
        {/* HERO BANNER — full width */}
        <div className="relative overflow-hidden bg-[#0b1326] px-6 sm:px-10 md:px-16 pt-16 pb-16 md:pb-20 group">
          {/* Background Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#131b2ede_1px,transparent_1px),linear-gradient(to_bottom,#131b2ede_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30"></div>

          {/* Multi-Layered Glows */}
          <div className="absolute -left-20 -top-20 w-96 h-96 bg-[#c0c1ff] opacity-10 blur-[120px] mix-blend-screen group-hover:opacity-20 transition-opacity duration-1000"></div>
          <div className="absolute top-10 -right-20 w-96 h-96 bg-[#ffb0cd] opacity-[0.08] blur-[120px] mix-blend-screen group-hover:opacity-[0.15] transition-opacity duration-1000 translate-x-10"></div>

          {/* Top Neon Border */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#c0c1ff] via-[#8084ff] to-[#ffb0cd]"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-white opacity-50 blur-[2px]"></div>

          <div className="relative z-10 w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
            <div className="max-w-xl">
              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 mb-6 bg-[#131b2e]/80 border border-[#2d3449] px-3 py-1.5 rounded-full backdrop-blur-md shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffb95f] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ffb95f]"></span>
                </span>
                <span className="text-[10px] font-black text-[#ffb95f] uppercase tracking-[0.2em] pt-[1px]">Live Tournament</span>
              </div>

              {/* Huge Title */}
              <h1 className="text-5xl sm:text-6xl md:text-[5.5rem] font-['Space_Grotesk',_sans-serif] font-black italic tracking-tighter leading-[0.95] mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-[#a0a5ff]">THE IPL</span><br />
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-[#ffb0cd]">CHALLENGE</span>
              </h1>

              {/* Copy */}
              <p className="text-[#908fa0] text-lg sm:text-xl mb-8 max-w-lg font-medium leading-relaxed">
                Lock in your boldest predictions, dominate your rivals on the board, and climb the global ranks.
              </p>

              {/* Action */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Link href="#arena" className="w-full sm:w-auto">
                  <button className="bg-gradient-to-r from-[#c0c1ff] to-[#a0a5ff] hover:from-[#e1e0ff] hover:to-[#c0c1ff] text-[#07006c] font-black uppercase tracking-widest text-sm px-8 py-4 rounded-xl transition-all shadow-[0_0_30px_rgba(192,193,255,0.2)] hover:shadow-[0_0_40px_rgba(192,193,255,0.4)] hover:-translate-y-1 flex items-center gap-3 w-full justify-center">
                    <Swords className="w-5 h-5" />
                    Enter Arena
                  </button>
                </Link>
                <RulesDialog />
              </div>
            </div>

            {/* Right Side Visual Element (Hidden on small mobile) */}
            <div className="hidden lg:flex relative right-0 max-w-[300px] w-full items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-[#c0c1ff]/20 to-[#ffb0cd]/20 blur-[60px] rounded-full mix-blend-screen"></div>
              <div className="relative w-48 h-48 bg-[#0b1326] border-4 border-[#2d3449] rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.8)] z-10 group-hover:scale-105 group-hover:border-[#c0c1ff]/40 transition-all duration-700">
                <Trophy className="w-20 h-20 text-[#ffb95f] drop-shadow-[0_0_15px_rgba(255,185,95,0.4)] group-hover:drop-shadow-[0_0_25px_rgba(255,185,95,0.6)] transition-all duration-700" />
              </div>
              {/* Orbital Elements */}
              <div className="absolute w-[280px] h-[280px] border border-[#c0c1ff]/10 rounded-full animate-[spin_10s_linear_infinite] pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#c0c1ff] rounded-full shadow-[0_0_15px_#c0c1ff]"></div>
              </div>
              <div className="absolute w-[360px] h-[360px] border border-[#ffb0cd]/10 rounded-full animate-[spin_15s_linear_infinite_reverse] pointer-events-none">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-[#ffb0cd] rounded-full shadow-[0_0_15px_#ffb0cd]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* MATCHES SECTION — constrained */}
        <div className="w-full px-6 sm:px-10">
          <div id="arena" className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 mt-16 scroll-mt-24">
            <h2 className="text-3xl font-['Space_Grotesk',_sans-serif] font-black text-white italic tracking-tighter uppercase">
              {filter === 'upcoming' ? 'Upcoming Matches' : filter === 'completed' ? 'Past Matches' : 'Arena Matches'}
            </h2>

            <div className="flex bg-[#0b1326] p-1.5 rounded-lg border border-[#2d3449] overflow-x-auto scrollbar-hide shadow-inner w-full md:w-auto">
              <Link href="/dashboard?filter=all" className={`px-5 py-2 rounded-md text-xs font-black uppercase tracking-wider whitespace-nowrap transition-colors ${filter === 'all' ? 'bg-[#2d3449] text-white shadow-sm' : 'text-[#908fa0] hover:text-[#dae2fd]'}`}>All Matches</Link>
              <Link href="/dashboard?filter=upcoming" className={`px-5 py-2 rounded-md text-xs font-black uppercase tracking-wider whitespace-nowrap transition-colors ${filter === 'upcoming' ? 'bg-[#2d3449] text-white shadow-sm' : 'text-[#908fa0] hover:text-[#dae2fd]'}`}>Upcoming</Link>
              <Link href="/dashboard?filter=completed" className={`px-5 py-2 rounded-md text-xs font-black uppercase tracking-wider whitespace-nowrap transition-colors ${filter === 'completed' ? 'bg-[#2d3449] text-white shadow-sm' : 'text-[#908fa0] hover:text-[#dae2fd]'}`}>Completed</Link>
            </div>
          </div>

          {/* MATCH CARDS GRID */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayMatches.map(match => (
              <div key={match.id} className="bg-[#131b2e] rounded-xl border border-[#2d3449] hover:border-[#464554] transition-colors relative flex flex-col group shadow-lg">

                {/* Top Meta */}
                <div className="px-6 py-4 flex justify-between items-center bg-[#171f33]/60 rounded-t-xl">
                  <div className="bg-[#2d3449] text-[#c7c4d7] text-[9px] font-black uppercase px-2.5 py-1 rounded-sm tracking-[0.15em] border border-[#464554] shadow-sm">
                    Bracket A
                  </div>
                  {match.status === 'completed' ? (
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-[#ffb95f] uppercase tracking-wider">
                      <Trophy className="w-3.5 h-3.5" /> Over
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-[#ffb0cd] uppercase tracking-wider">
                      <Timer className="w-3.5 h-3.5" /> Upcoming
                    </div>
                  )}
                </div>

                {/* Matchup Data */}
                <div className="px-6 py-10 flex justify-between items-center relative flex-1 border-b border-[#2d3449]/50">
                  {/* Team 1 */}
                  {(() => {
                    const t1 = getTeam(match.team1);
                    return (
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-[72px] h-[72px] sm:w-[80px] sm:h-[80px] rounded-full sm:rounded-2xl bg-[#0b1326] border-2 shadow-inner flex items-center justify-center transition-colors relative overflow-hidden group-hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]" style={{ borderColor: t1 ? `${t1.primaryColor}80` : '#2d3449' }}>
                          {t1 ? (
                            <TeamLogo team={t1} />
                          ) : (
                            <span className="font-['Space_Grotesk',_sans-serif] font-black text-2xl text-[#dae2fd] italic">{match.team1}</span>
                          )}
                        </div>
                        <span className="text-[13px] font-black uppercase tracking-widest text-center max-w-[90px] leading-tight text-white">
                          {t1 ? t1.id : match.team1}
                        </span>
                      </div>
                    );
                  })()}

                  {/* VS Badge */}
                  <div className="absolute left-1/2 top-[50%] -translate-y-1/2 -translate-x-1/2 font-['Space_Grotesk',_sans-serif] font-black text-[22px] italic text-[#2d3449] select-none z-10 bg-[#131b2e] px-2 py-1">
                    VS
                  </div>

                  {/* Team 2 */}
                  {(() => {
                    const t2 = getTeam(match.team2);
                    return (
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-[72px] h-[72px] sm:w-[80px] sm:h-[80px] rounded-full sm:rounded-2xl bg-[#0b1326] border-2 shadow-inner flex items-center justify-center transition-colors relative overflow-hidden group-hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]" style={{ borderColor: t2 ? `${t2.primaryColor}80` : '#2d3449' }}>
                          {t2 ? (
                            <TeamLogo team={t2} />
                          ) : (
                            <span className="font-['Space_Grotesk',_sans-serif] font-black text-2xl text-[#dae2fd] italic">{match.team2}</span>
                          )}
                        </div>
                        <span className="text-[13px] font-black uppercase tracking-widest text-center max-w-[90px] leading-tight text-white">
                          {t2 ? t2.id : match.team2}
                        </span>
                      </div>
                    );
                  })()}
                </div>

                {/* Action Buttons */}
                <div className="p-5 flex flex-col gap-3">
                  {match.status === "completed" ? (
                    <div className="flex flex-col gap-3">
                      <Link href={`/dashboard/results/${match.id}`} className="block w-full">
                        <button className="w-full bg-[#171f33] hover:bg-[#222a3d] text-[#ffb95f] border border-[#ffb95f]/30 font-['Space_Grotesk',_sans-serif] font-bold italic uppercase tracking-wider py-4 rounded-md transition-colors shadow-[0_0_15px_rgba(255,185,95,0.05)] text-sm flex justify-center items-center gap-2">
                          <span>Reveal Results</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </Link>
                      {userChallengeIds[match.id] && (
                        <Link href={`/challenge/${userChallengeIds[match.id]}`} className="block w-full">
                          <button className="w-full bg-[#0b1326] hover:bg-[#131b2e] text-[#c0c1ff] border border-[#2d3449] font-['Space_Grotesk',_sans-serif] font-bold italic uppercase tracking-wider py-3.5 rounded-md transition-colors text-xs flex justify-center items-center gap-2 hover:border-[#c0c1ff]/30">
                            <Swords className="w-4 h-4" />
                            <span>View VS Board</span>
                          </button>
                        </Link>
                      )}
                    </div>
                  ) : (
                    <>
                      {lockedMatchIds.has(match.id) ? (
                        <div className="w-full bg-[#0d1a0d] border border-[#2a5c2a]/60 rounded-md py-[14px] flex justify-center items-center gap-2">
                          <svg className="w-4 h-4 text-[#4ade80]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                          <span className="text-[#4ade80] font-['Space_Grotesk',_sans-serif] font-black italic uppercase tracking-wider text-[13px]">Prediction Locked</span>
                        </div>
                      ) : (
                        <Link href={`/dashboard/predict/${match.id}`} className="block w-full">
                          <button className="w-full bg-[#c0c1ff] hover:bg-[#e1e0ff] text-[#07006c] font-['Space_Grotesk',_sans-serif] font-black italic uppercase tracking-wider py-[14px] rounded-md transition-all text-[13px] group-hover:shadow-[0_0_20px_rgba(192,193,255,0.15)] flex justify-center items-center">
                            Lock Prediction
                          </button>
                        </Link>
                      )}

                      <div className="w-full">
                        {userChallengeIds[match.id] ? (
                          <Link href={`/challenge/${userChallengeIds[match.id]}`} className="block w-full">
                            <button className="w-full bg-[#131b2e] hover:bg-[#171f33] text-[#c0c1ff] border border-[#c0c1ff]/30 font-['Space_Grotesk',_sans-serif] font-bold italic uppercase tracking-wider py-[14px] rounded-md transition-colors text-xs flex justify-center items-center gap-2">
                              <Swords className="w-4 h-4" />
                              <span>Live VS Board</span>
                            </button>
                          </Link>
                        ) : (
                          <ChallengeDialog matchId={match.id} />
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}

            {displayMatches.length === 0 && (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-20 text-[#908fa0] text-sm font-medium border border-dashed border-[#2d3449] rounded-xl bg-[#0b1326]/50">
                No matches found for this filter.
              </div>
            )}
          </div>
        </div> {/* end constrained matches wrapper */}
      </main>
    </div>
  )
}
