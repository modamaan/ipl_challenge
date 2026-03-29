"use client";

import { useState } from "react";
import { Copy, MessageCircle, Share2, Check } from "lucide-react";

export function ChallengeShareButton({ challengeId }: { challengeId: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const link = typeof window !== "undefined"
    ? `${window.location.origin}/challenge/${challengeId}`
    : `/challenge/${challengeId}`;

  function handleCopy() {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleWhatsApp() {
    const text = encodeURIComponent(
      `🔥 I challenge you to an IPL Prediction Battle!\n\n⚔️ Accept here: ${link}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        title="Share challenge link"
        className="h-full px-3.5 bg-[#131b2e] hover:bg-[#1e2a40] text-[#c0c1ff] border border-[#c0c1ff]/30 rounded-md transition-colors flex items-center justify-center"
      >
        <Share2 className="w-4 h-4" />
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          {/* Popover */}
          <div className="absolute bottom-full mb-2 right-0 z-50 w-72 bg-[#131b2e] border border-[#2d3449] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] p-4 space-y-3">
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#ffb0cd] text-center border-b border-[#2d3449] pb-3">
              Share Your Challenge
            </p>

            {/* Link display */}
            <div className="bg-[#0b1326] border border-[#2d3449] rounded-lg px-3 py-2.5">
              <p className="text-[#dae2fd] font-mono text-[9px] truncate">{link}</p>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={handleCopy}
                className="flex-1 flex items-center justify-center gap-2 bg-[#2d3449] hover:bg-[#364058] text-[#dae2fd] font-bold text-[10px] uppercase tracking-wider border border-[#464554] rounded-lg py-3 transition-colors"
              >
                {copied
                  ? <><Check className="w-3.5 h-3.5 text-[#4ade80]" /> <span className="text-[#4ade80]">Copied!</span></>
                  : <><Copy className="w-3.5 h-3.5" /> Copy Link</>
                }
              </button>
              <button
                onClick={handleWhatsApp}
                className="flex-1 flex items-center justify-center gap-2 bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] font-bold text-[10px] uppercase tracking-wider border border-[#25D366]/40 rounded-lg py-3 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
