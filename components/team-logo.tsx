"use client";

import React, { useState } from "react";

export function TeamLogo({ team }: { team: any }) {
  const [hasError, setHasError] = useState(false);

  if (!team) return null;

  if (hasError) {
    return (
      <div 
        className="absolute inset-0 flex items-center justify-center font-['Space_Grotesk',_sans-serif] font-black text-2xl italic select-none"
        style={{ backgroundColor: team.primaryColor, color: team.textColor }}
      >
        {team.id}
      </div>
    );
  }

  return (
    <img
      src={team.logoPath}
      alt={team.id}
      className="w-12 h-12 sm:w-14 sm:h-14 object-contain drop-shadow-[0_0_15px_rgba(0,0,0,0.5)] z-10 relative"
      onError={() => setHasError(true)}
    />
  );
}
