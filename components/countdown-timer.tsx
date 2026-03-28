"use client";

import { useEffect, useState } from "react";

export function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState<string>("CALCULATING...");
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      
      if (difference <= 0) {
        setIsExpired(true);
        setTimeLeft("MATCH STARTED");
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      const parts = [];
      if (days > 0) parts.push(`${days}d`);
      parts.push(`${hours.toString().padStart(2, '0')}h`);
      parts.push(`${minutes.toString().padStart(2, '0')}m`);
      parts.push(`${seconds.toString().padStart(2, '0')}s`);

      setTimeLeft(parts.join(' : '));
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <span className={isExpired ? "text-[#ffb0cd]" : ""}>
      {isExpired ? timeLeft : `Challenge locks in ${timeLeft}`}
    </span>
  );
}
