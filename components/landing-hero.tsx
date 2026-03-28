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
    <div className="relative isolate overflow-hidden bg-slate-950 w-full min-h-screen flex flex-col justify-center text-slate-50 items-center selection:bg-indigo-500/30">
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" }} />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-5xl px-6 lg:px-8 text-center pt-20 pb-16"
      >
        <motion.div variants={itemVariants} className="mb-8 flex justify-center">
          <div className="relative rounded-full px-4 py-1.5 text-sm leading-6 text-indigo-300 ring-1 ring-white/10 hover:ring-white/20 transition-all cursor-pointer">
            Announcing the 2026 Season Challenge.{' '}
            <a href="#" className="font-semibold text-white"><span className="absolute inset-0" aria-hidden="true" />Read more <span aria-hidden="true">&rarr;</span></a>
          </div>
        </motion.div>
        
        <motion.h1 variants={itemVariants} className="mt-4 text-5xl font-extrabold tracking-tight text-white sm:text-7xl lg:leading-[1.1]">
          Predict the Unpredictable.<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Claim the Crown.</span>
        </motion.h1>
        
        <motion.p variants={itemVariants} className="mt-8 text-lg leading-8 text-slate-300 sm:text-xl max-w-2xl mx-auto">
          Create match prediction cards, challenge friends with custom stakes, and climb the leaderboard as live results unfold pitch-side.
        </motion.p>
        
        <motion.div variants={itemVariants} className="mt-10 flex items-center justify-center gap-x-6">
          {children}
        </motion.div>

        <motion.div variants={itemVariants} className="mt-28 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 px-4 text-left">
           {[
             { title: "Lock Predictions", desc: "Predict toss, scorer, and result before the match starts.", icon: Target },
             { title: "Versus Cards", desc: "Generate custom poster-style cards for every challenge.", icon: Trophy },
             { title: "Fun Stakes", desc: "Play for Biryani, Jerseys, or just bragging rights.", icon: Users },
             { title: "Live Reveals", desc: "Watch predictions turn ✅ or ❌ in real-time.", icon: Zap },
           ].map((feature, i) => (
             <div key={i} className="flex flex-col items-start p-6 bg-slate-900/40 border border-slate-800/60 backdrop-blur-xl rounded-3xl hover:border-indigo-500/50 hover:bg-slate-900/60 transition-all cursor-pointer group shadow-xl">
                <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
             </div>
           ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
