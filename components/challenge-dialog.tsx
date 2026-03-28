"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createChallenge } from "@/app/actions/challenge";
import { Swords, Copy, MessageCircle } from "lucide-react";

export function ChallengeDialog({ matchId }: { matchId: string }) {
  const [open, setOpen] = useState(false);
  const [link, setLink] = useState("");
  const [stakesVal, setStakesVal] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreate(formData: FormData) {
    setLoading(true);
    const stakes = formData.get("stakes") as string;
    const challengeId = await createChallenge(matchId, stakes);
    setStakesVal(stakes);
    setLink(`${window.location.origin}/challenge/${challengeId}`);
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full border-2 border-dashed border-[#2d3449] hover:border-[#c0c1ff]/50 bg-[#0b1326] hover:bg-[#131b2e] text-[#908fa0] hover:text-[#dae2fd] font-['Space_Grotesk',_sans-serif] font-bold italic uppercase tracking-wider h-[46px] rounded-md transition-colors flex justify-center items-center shadow-none">
          <Swords className="w-[18px] h-[18px] mr-2" />
          Challenge A Friend
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#131b2e] border-[#2d3449] text-white sm:max-w-md font-['Inter',_sans-serif] shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl text-[#dae2fd] font-['Space_Grotesk',_sans-serif] italic font-black uppercase">Create a Challenge</DialogTitle>
          <DialogDescription className="text-[#908fa0] font-medium text-sm">
            Set the stakes and share the link with your friend to track who predicts best.
          </DialogDescription>
        </DialogHeader>
        {!link ? (
          <form action={handleCreate} className="space-y-5 mt-4">
            <div>
              <label className="text-xs font-bold text-[#c7c4d7] uppercase tracking-wider">What are the stakes?</label>
              <Input name="stakes" placeholder="e.g. Loser buys Biryani 🍛" required className="bg-[#0b1326] border-[#2d3449] mt-2 focus-visible:ring-[#c0c1ff] text-white placeholder:text-[#464554] font-medium rounded-md h-[46px]" />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-[#c0c1ff] hover:bg-[#e1e0ff] text-[#07006c] font-black uppercase tracking-wider">
              {loading ? "Generating..." : "Generate Link"}
            </Button>
          </form>
        ) : (
          <div className="space-y-4 mt-4">
            <p className="text-[10px] text-[#ffb0cd] font-black uppercase tracking-widest bg-[#171f33]/80 p-3 rounded-md text-center border border-[#ffb0cd]/30 shadow-[0_0_10px_rgba(255,176,205,0.1)]">Challenge Linked!</p>
            <Input readOnly value={link} className="bg-[#0b1326] border-[#2d3449] text-[#dae2fd] font-mono text-[10px] focus-visible:ring-[#c0c1ff] h-[46px] rounded-md" />
            <div className="flex gap-3 pt-2">
              <Button onClick={() => navigator.clipboard.writeText(link)} className="flex-1 bg-[#2d3449] hover:bg-[#31394d] text-[#dae2fd] font-bold text-xs uppercase tracking-wider border border-[#464554] shadow-none h-12">
                <Copy className="w-4 h-4 mr-2" /> Copy Link
              </Button>
              <Button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`🔥 I challenge you to an IPL Challenge!\n\n🏆 Stakes: ${stakesVal}\n\n⚔️ Accept your challenge: ${link}`)}`, '_blank')} className="flex-1 bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] font-bold text-xs uppercase tracking-wider border border-[#25D366]/50 shadow-[0_0_15px_rgba(37,211,102,0.15)] h-12 transition-all">
                <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
