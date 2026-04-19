import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHero } from "@/components/PageHero";
import { Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface SlotItem {
  time: string;
  title: string;
  venue: string;
  tag: "tech" | "cultural" | "gaming" | "literary" | "core";
}

const day1: SlotItem[] = [
  { time: "09:00", title: "Inauguration & Lamp Lighting", venue: "Main Auditorium", tag: "core" },
  { time: "10:00", title: "Phoenix Hackathon — Kickoff", venue: "Auditorium A", tag: "tech" },
  { time: "11:00", title: "Trivia Inferno — Prelims", venue: "Auditorium B", tag: "literary" },
  { time: "11:00", title: "Arena Royale — Group Stage", venue: "Esports Arena", tag: "gaming" },
  { time: "14:00", title: "Code Forge — 3hr Contest", venue: "Lab Block, 4th Floor", tag: "tech" },
  { time: "16:00", title: "Open Mic & Acoustic Jam", venue: "IEM Atrium", tag: "cultural" },
  { time: "19:00", title: "Battle of Bands — Night 1", venue: "Open Air Stage", tag: "cultural" },
];

const day2: SlotItem[] = [
  { time: "10:00", title: "The Open Floor — Debate", venue: "UEM Seminar Hall", tag: "literary" },
  { time: "10:00", title: "Phoenix Hackathon — Final Pitch", venue: "Auditorium A", tag: "tech" },
  { time: "13:00", title: "Lunch & Sponsor Showcase", venue: "Food Court", tag: "core" },
  { time: "15:00", title: "Guess Who", venue: "IEM Atrium", tag: "literary" },
  { time: "16:00", title: "Arena Royale — Grand Final", venue: "Esports Arena", tag: "gaming" },
  { time: "18:30", title: "Cultural Night & Headliner", venue: "Open Air Stage", tag: "cultural" },
  { time: "22:00", title: "Closing Ceremony", venue: "Open Air Stage", tag: "core" },
];

const tagStyle: Record<SlotItem["tag"], string> = {
  tech: "bg-chip-blue text-chip-blue-fg",
  cultural: "bg-chip-peach text-chip-peach-fg",
  gaming: "bg-chip-lavender text-chip-lavender-fg",
  literary: "bg-chip-mint text-chip-mint-fg",
  core: "bg-secondary text-secondary-foreground",
};

const Timeline = ({ items }: { items: SlotItem[] }) => (
  <ol className="relative">
    <span className="absolute left-[7.5rem] top-2 bottom-2 w-px bg-border md:left-32" aria-hidden />
    {items.map((s, i) => (
      <li
        key={i}
        className="relative grid grid-cols-[5.5rem_auto_1fr] md:grid-cols-[7rem_auto_1fr] items-start gap-4 py-4 animate-fade-in-up"
        style={{ animationDelay: `${i * 50}ms` }}
      >
        <div className="text-right">
          <div className="font-display text-lg font-semibold tabular-nums">{s.time}</div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">IST</div>
        </div>
        <div className="relative pt-2">
          <span className="block h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
        </div>
        <div className="rounded-2xl border border-border/70 bg-surface-elevated p-5 shadow-soft transition-all hover:shadow-card">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-base font-semibold">{s.title}</h3>
            <span className={cn("inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider capitalize", tagStyle[s.tag])}>
              {s.tag}
            </span>
          </div>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" /> {s.venue}
          </p>
        </div>
      </li>
    ))}
  </ol>
);

const Schedule = () => {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Schedule"
        title={
          <>
            48 hours.<br />
            <span className="text-gradient-ember">Every minute counts.</span>
          </>
        }
        description="Plan your day, build your route, and make sure you don't miss the moments that matter."
      />

      <section className="container-narrow mt-4">
        <div className="grid gap-12 md:grid-cols-2 md:gap-10">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Clock className="h-5 w-5" />
              </span>
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-primary">Day 01</div>
                <h2 className="font-display text-2xl font-bold">Friday, Aug 1</h2>
              </div>
            </div>
            <Timeline items={day1} />
          </div>
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber/15 text-amber">
                <Clock className="h-5 w-5" />
              </span>
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-amber">Day 02</div>
                <h2 className="font-display text-2xl font-bold">Saturday, Aug 2</h2>
              </div>
            </div>
            <Timeline items={day2} />
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default Schedule;
