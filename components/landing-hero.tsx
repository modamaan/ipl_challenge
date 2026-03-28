"use client";

import { motion, Variants } from "framer-motion";
import { Trophy, Zap, Target, Users } from "lucide-react";

export function LandingHero({ children }: { children: React.ReactNode }) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, duration: 0.6 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80 } },
  };

  return (
    <div className="relative isolate min-h-screen bg-[#0b1326] text-[#dae2fd] font-['Inter',_sans-serif] overflow-hidden flex flex-col items-center justify-center selection:bg-[#c0c1ff] selection:text-[#0b1326]">
      {/* Background Neon Elements */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 pointer-events-none" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ffb0cd] to-[#c0c1ff] opacity-10 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" }} />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-6xl px-4 lg:px-8 text-center pt-20 pb-16 w-full relative z-10"
      >
        <motion.div variants={itemVariants} className="mb-8 flex justify-center">
          <div className="relative rounded-sm px-4 py-1.5 text-[10px] md:text-xs font-black tracking-[0.2em] uppercase text-[#ffb0cd] border border-[#ffb0cd]/30 bg-[#aa0266]/20 shadow-[0_0_15px_rgba(170,2,102,0.3)] hover:shadow-[0_0_25px_rgba(170,2,102,0.5)] transition-all cursor-pointer">
            Announcing the 2026 Season Challenge.{' '}
            <a href="#" className="font-black text-white ml-2"><span className="absolute inset-0" aria-hidden="true" />Enter Arena <span aria-hidden="true">&rarr;</span></a>
          </div>
        </motion.div>
        
        <motion.h1 variants={itemVariants} className="mt-4 text-5xl md:text-7xl lg:text-[6rem] font-['Space_Grotesk',_sans-serif] font-black italic uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-[#c0c1ff] drop-shadow-[0_0_25px_rgba(192,193,255,0.4)] leading-[1.1] md:leading-[1.1] pb-2 px-2">
          Predict the Unpredictable.<br/>
          <span className="text-white drop-shadow-[0_0_25px_rgba(255,176,205,0.6)]">
            Claim the <span className="text-[#ffb0cd]">Crown.</span>
          </span>
        </motion.h1>
        
        <motion.p variants={itemVariants} className="mt-8 text-sm md:text-base leading-relaxed text-[#dae2fd] font-bold tracking-[0.1em] uppercase max-w-2xl mx-auto bg-[#131b2e]/80 border border-[#2d3449] py-4 px-6 rounded-lg backdrop-blur-md shadow-lg">
          Create match prediction cards, challenge friends with custom stakes, and climb the leaderboard as live results unfold pitch-side.
        </motion.p>
        
        <motion.div variants={itemVariants} className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
          {children}
        </motion.div>

        <motion.div variants={itemVariants} className="mt-32 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 px-2 text-left">
           {[
             { title: "Lock Predictions", desc: "Predict toss, scorer, and result before the match starts.", icon: Target },
             { title: "Versus Cards", desc: "Generate custom poster-style cards for every challenge.", icon: Trophy },
             { title: "Fun Stakes", desc: "Play for Biryani, Jerseys, or just bragging rights.", icon: Users },
             { title: "Live Reveals", desc: "Watch predictions turn correct or incorrect in real-time.", icon: Zap },
           ].map((feature, i) => (
             <div key={i} className="flex flex-col items-start p-8 bg-[#131b2e] border border-[#2d3449] rounded-2xl hover:border-[#c0c1ff]/50 transition-all cursor-pointer group shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_10px_40px_rgba(192,193,255,0.15)] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#2d3449] group-hover:bg-[#c0c1ff] transition-colors"></div>
                
                <div className="w-12 h-12 flex items-center justify-center bg-[#0b1326] border border-[#2d3449] text-[#c0c1ff] rounded-xl group-hover:scale-110 group-hover:border-[#c0c1ff]/50 transition-all shadow-inner">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="mt-6 text-lg font-['Space_Grotesk',_sans-serif] font-black uppercase tracking-widest text-white">{feature.title}</h3>
                <p className="mt-2 text-xs font-bold tracking-widest text-[#908fa0] uppercase leading-relaxed">{feature.desc}</p>
             </div>
           ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
