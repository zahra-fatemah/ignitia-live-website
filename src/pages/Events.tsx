import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHero } from "@/components/PageHero";
import { EventCard } from "@/components/EventCard";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import type { IgnitiaEvent, EventCategory } from "@/data/events";

const filters: { value: "all" | EventCategory; label: string }[] = [
  { value: "all", label: "All" },
  { value: "tech", label: "Tech" },
  { value: "cultural", label: "Cultural" },
  { value: "gaming", label: "Gaming" },
  { value: "literary", label: "Literary" },
];

const Events = () => {
  const [active, setActive] = useState<"all" | EventCategory>("all");
  const [events, setEvents] = useState<IgnitiaEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("events")
        .select("slug, title, category, tagline, description, rules, team_size, event_date, event_time, venue, prize, chip")
        .eq("is_published", true)
        .order("event_date");
      setEvents((data ?? []).map((e) => ({
        slug: e.slug,
        title: e.title,
        category: e.category,
        tagline: e.tagline,
        description: e.description,
        rules: e.rules,
        teamSize: e.team_size,
        date: e.event_date,
        time: e.event_time,
        venue: e.venue,
        prize: e.prize,
        chip: (e.chip as IgnitiaEvent["chip"]) ?? "peach",
      })));
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(
    () => (active === "all" ? events : events.filter((e) => e.category === active)),
    [active, events],
  );

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Events · Aug 1 – 2, 2026"
        title={
          <>
            Pick your stage.<br />
            <span className="text-gradient-ember">Light it up.</span>
          </>
        }
        description="From all-night hackathons to a sky-lit cultural finale — every event at IGNITIA'26 is designed to test, surprise and reward."
      />

      <section className="container-narrow mt-4">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setActive(f.value)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium border transition-all",
                active === f.value
                  ? "bg-primary text-primary-foreground border-primary shadow-soft"
                  : "bg-surface-elevated text-muted-foreground border-border hover:text-foreground hover:border-primary/30",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((e, i) => (
              <EventCard key={e.slug} event={e} index={i} />
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
};

export default Events;
