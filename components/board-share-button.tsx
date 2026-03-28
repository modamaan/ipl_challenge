"use client";

import { Download, Loader2, Link as LinkIcon, Check } from "lucide-react";
import { useState, useEffect } from "react";

export function BoardShareButton() {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const handleDownload = async () => {
    const element = document.getElementById("vs-board");
    if (!element) return;
    
    setDownloading(true);
    try {
      const { toPng } = await import("html-to-image");
      
      const dataUrl = await toPng(element, {
        backgroundColor: "#0b1326",
        pixelRatio: 3, // Increased to 3x for very high-res sharing
        style: {
           transform: 'scale(1)',
           transformOrigin: 'top left',
           margin: '0', 
        },
        skipFonts: true, 
        fetchRequestInit: {
          cache: 'no-cache', 
        }
      });
      
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "IPL-Challenge-DEVTREE.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to capture image", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
      <button 
        onClick={handleDownload}
        disabled={downloading}
        className={`bg-gradient-to-r from-[#c0c1ff] to-[#a1a3fc] text-[#07006c] hover:shadow-[0_0_45px_rgba(192,193,255,0.6)] font-black uppercase tracking-widest text-sm px-10 py-5 rounded-lg shadow-[0_0_35px_rgba(192,193,255,0.4)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 w-full sm:w-auto disabled:opacity-70 disabled:cursor-wait shrink-0`}
      >
        {downloading ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> Generating Image...</>
        ) : (
          <><Download className="w-5 h-5" /> Download VS Board</>
        )}
      </button>

      <button 
        onClick={handleCopy}
        className="px-8 py-5 bg-[#131b2e] border border-[#2d3449] hover:bg-white hover:text-black hover:border-white text-[#dae2fd] font-black uppercase text-sm tracking-widest rounded-lg transition-all flex items-center justify-center gap-3 w-full sm:w-auto shrink-0"
      >
        {copied ? (
          <><Check className="w-5 h-5 text-green-500" /> Copied!</>
        ) : (
          <><LinkIcon className="w-5 h-5" /> Copy URL</>
        )}
      </button>
    </div>
  );
}
