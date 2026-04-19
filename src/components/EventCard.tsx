import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import type { IgnitiaEvent } from "@/data/events";
import { cn } from "@/lib/utils";

const chipStyles: Record<IgnitiaEvent["chip"], string> = {
  lavender: "bg-chip-lavender text-chip-lavender-fg",
  blue: "bg-chip-blue text-chip-blue-fg",
  mint: "bg-chip-mint text-chip-mint-fg",
  peach: "bg-chip-peach text-chip-peach-fg",
};

const categoryLabel: Record<IgnitiaEvent["category"], string> = {
  tech: "Tech",
  cultural: "Cultural",
  gaming: "Gaming",
  literary: "Literary",
};

export const EventCard = ({ event, index = 0 }: { event: IgnitiaEvent; index?: number }) => {
  return (
    <Link
      to={`/events/${event.slug}`}
      className="group relative flex flex-col rounded-2xl border border-border/70 bg-surface-elevated p-6 shadow-soft transition-all duration-300 hover:shadow-lift hover:-translate-y-1 hover:border-primary/30 animate-fade-in-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-center justify-between">
        <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium", chipStyles[event.chip])}>
          {categoryLabel[event.category]}
        </span>
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-all group-hover:border-primary/40 group-hover:text-primary group-hover:rotate-[-12deg]">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>

      <h3 className="mt-5 font-display text-xl font-semibold tracking-tight text-foreground">
        {event.title}
      </h3>
      <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{event.tagline}</p>

      <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4 text-xs text-muted-foreground">
        <span>{event.date}</span>
        <span className="font-medium text-foreground">{event.prize}</span>
      </div>
    </Link>
  );
};
