"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, CheckCircle2, XCircle, ChevronRight, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

interface MatchResultData {
  tossWinner: string;
  matchResult: string;
  totalRuns: string;
}

export function RevealAnimation({ prediction, actualResult }: { prediction: any, actualResult: MatchResultData }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  const steps = [
    { label: "Toss Prediction", userAnswer: prediction.tossWinner, actualResult: actualResult.tossWinner },
    { label: "Match Winner", userAnswer: prediction.matchResult, actualResult: actualResult.matchResult },
    { label: "Total Runs Bracket", userAnswer: prediction.totalRuns, actualResult: actualResult.totalRuns }
  ];

  useEffect(() => {
    if (currentStep < steps.length) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setTimeout(() => setShowConfetti(true), 500);
    }
  }, [currentStep, steps.length]);

  const pointsEarned = steps.filter(s => s.userAnswer === s.actualResult).length * 15;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} gravity={0.15} colors={['#c0c1ff', '#ffb0cd', '#ffb95f', '#494bd6']} />}
      
      <div className="space-y-6">
        <AnimatePresence>
          {steps.map((step, index) => {
            if (index > currentStep) return null;
            const isCorrect = step.userAnswer === step.actualResult;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`p-6 md:p-8 rounded-2xl border-2 shadow-xl flex items-center justify-between transition-colors relative overflow-hidden ${isCorrect ? 'bg-[#131b2e] border-[#10b981]/50 shadow-[0_0_40px_rgba(16,185,129,0.1)]' : 'bg-[#0b1326] border-[#ef4444]/30'}`}
              >
                {/* Neon Glow on edge relative to correctness */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${isCorrect ? 'bg-gradient-to-b from-[#10b981] to-[#059669]' : 'bg-gradient-to-b from-[#ef4444] to-[#b91c1c]'}`}></div>
                
                <div>
                  <h4 className="text-[#908fa0] text-[10px] font-black uppercase tracking-[0.2em] mb-3">{step.label}</h4>
                  <div className={`text-3xl font-['Space_Grotesk',_sans-serif] font-black italic tracking-wider ${isCorrect ? 'text-[#10b981]' : 'text-[#ef4444] line-through opacity-70'}`}>
                    {step.userAnswer || "No Prediction"}
                  </div>
                  {!isCorrect && (
                     <div className="text-white text-sm font-bold mt-2 flex items-center gap-2">
                        <span className="text-[#908fa0] uppercase tracking-wider text-[10px]">Actual:</span> 
                        <span className="font-['Space_Grotesk',_sans-serif] italic">{step.actualResult || "TBD"}</span>
                     </div>
                  )}
                </div>
                
                {isCorrect ? (
                   <div className="w-14 h-14 rounded-full bg-[#10b981]/10 flex items-center justify-center border border-[#10b981]/30">
                     <CheckCircle2 className="w-8 h-8 text-[#10b981]" />
                   </div>
                ) : (
                   <div className="w-14 h-14 rounded-full bg-[#ef4444]/10 flex items-center justify-center border border-[#ef4444]/30">
                     <XCircle className="w-8 h-8 text-[#ef4444] opacity-80" />
                   </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {currentStep === steps.length && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.5, type: "spring", bounce: 0.5 }}
            className="pt-10"
          >
            <div className="bg-gradient-to-b from-[#ffb95f]/20 to-[#0b1326] rounded-3xl border border-[#ffb95f]/40 p-10 text-center relative overflow-hidden shadow-[0_0_60px_rgba(255,185,95,0.15)]">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#ffb95f] opacity-5 blur-[120px] pointer-events-none"></div>
               <Sparkles className="w-12 h-12 text-[#ffb95f] mx-auto mb-4 animate-pulse" />
               <h3 className="text-[#ffb95f] font-['Space_Grotesk',_sans-serif] font-black italic uppercase tracking-widest text-lg mb-2">Rewards Unlocked</h3>
               <div className="text-[5rem] font-['Space_Grotesk',_sans-serif] font-black italic text-white leading-none drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                 +{pointsEarned}
               </div>
               <p className="text-[#c7c4d7] font-bold text-sm tracking-widest uppercase mt-4 mb-8">CHALLENGE POINTS ADDED</p>
               
               <Link href="/leaderboard" className="inline-block w-full">
                 <button className="w-full bg-[#ffb95f] hover:bg-[#ffddb8] text-[#653e00] font-['Space_Grotesk',_sans-serif] font-black italic uppercase tracking-wider text-xl py-5 rounded-xl transition-all shadow-[0_0_30px_rgba(255,185,95,0.4)] flex justify-center items-center gap-3">
                   View Global Leaderboard <ChevronRight className="w-6 h-6" />
                 </button>
               </Link>
            </div>
          </motion.div>
        )}

        {currentStep < steps.length && (
           <div className="flex justify-center items-center gap-3 pt-10 pb-6 text-[#908fa0]">
              <Loader2 className="w-5 h-5 animate-spin text-[#c0c1ff]" /> 
              <span className="font-bold tracking-widest uppercase text-xs animate-pulse">Computing Matrix Data...</span>
           </div>
        )}
      </div>
    </div>
  );
}
