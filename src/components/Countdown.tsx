import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
}

const calc = (target: Date): TimeLeft => {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    done: false,
  };
};

export const Countdown = ({ target }: { target: Date }) => {
  const [t, setT] = useState<TimeLeft>(() => calc(target));

  useEffect(() => {
    const id = setInterval(() => setT(calc(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const cells: { label: string; value: number }[] = [
    { label: "Days", value: t.days },
    { label: "Hours", value: t.hours },
    { label: "Minutes", value: t.minutes },
    { label: "Seconds", value: t.seconds },
  ];

  return (
    <div className="grid grid-cols-4 gap-3 sm:gap-5">
      {cells.map((c) => (
        <div
          key={c.label}
          className="rounded-2xl border border-border/70 bg-surface-elevated/80 backdrop-blur px-3 py-4 sm:px-5 sm:py-6 text-center shadow-soft transition-all hover:shadow-card hover:-translate-y-0.5"
        >
          <div className="font-display text-3xl sm:text-5xl font-bold tracking-tight tabular-nums text-foreground">
            {String(c.value).padStart(2, "0")}
          </div>
          <div className="mt-1.5 text-[10px] sm:text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {c.label}
          </div>
        </div>
      ))}
    </div>
  );
};
