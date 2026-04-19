import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  Trophy,
  Users,
} from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { RegisterDialog } from "@/components/RegisterDialog";
import NotFound from "./NotFound";

interface EventRow {
  id: string;
  slug: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  rules: string[];
  team_size: string;
  min_team_size: number;
  max_team_size: number;
  event_date: string;
  event_time: string;
  venue: string;
  prize: string;
}

const EventDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState<EventRow | null>(null);
  const [related, setRelated] = useState<{ slug: string; title: string; tagline: string; category: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [registered, setRegistered] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    (async () => {
      if (!slug) return;
      setLoading(true);
      const { data } = await supabase
        .from("events")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();
      setEvent((data as EventRow) ?? null);

      if (data) {
        const { data: rel } = await supabase
          .from("events")
          .select("slug, title, tagline, category")
          .eq("is_published", true)
          .neq("slug", slug)
          .limit(3);
        setRelated(rel ?? []);

        if (user) {
          const { data: regs } = await supabase
            .from("registrations")
            .select("id, team_members!inner(user_id)")
            .eq("event_id", data.id)
            .eq("team_members.user_id", user.id)
            .limit(1);
          setRegistered((regs?.length ?? 0) > 0);
        } else {
          setRegistered(false);
        }
      }
      setLoading(false);
    })();
  }, [slug, user]);

  if (loading) {
    return (
      <SiteLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </SiteLayout>
    );
  }

  if (!event) return <NotFound />;

  const handleRegisterClick = () => {
    if (!user) {
      navigate("/auth", { state: { from: `/events/${event.slug}` } });
      return;
    }
    setDialogOpen(true);
  };

  const meta = [
    { icon: Calendar, label: "Date", value: event.event_date },
    { icon: Clock, label: "Time", value: event.event_time },
    { icon: MapPin, label: "Venue", value: event.venue },
    { icon: Users, label: "Team size", value: event.team_size },
    { icon: Trophy, label: "Prize pool", value: event.prize },
  ];

  return (
    <SiteLayout>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" aria-hidden />
        <div className="container-narrow relative py-16 sm:py-20">
          <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2">
            <Link to="/events">
              <ArrowLeft className="h-4 w-4" /> All events
            </Link>
          </Button>

          <div className="grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2 animate-fade-in-up">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary capitalize">
                {event.category}
              </span>
              <h1 className="mt-4 font-display text-4xl sm:text-5xl font-bold tracking-tight text-balance">
                {event.title}
              </h1>
              <p className="mt-3 text-xl text-muted-foreground italic">"{event.tagline}"</p>
              <p className="mt-6 text-lg text-foreground/85 leading-relaxed">{event.description}</p>

              {event.rules?.length > 0 && (
                <div className="mt-10">
                  <h2 className="font-display text-2xl font-semibold">Rules</h2>
                  <ul className="mt-4 space-y-3">
                    {event.rules.map((r, i) => (
                      <li
                        key={i}
                        className="flex gap-3 rounded-xl border border-border/60 bg-surface-elevated/70 p-4 animate-fade-in-up"
                        style={{ animationDelay: `${i * 60}ms` }}
                      >
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                        <span className="text-sm text-foreground/85 leading-relaxed">{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <aside className="lg:sticky lg:top-24 self-start">
              <div className="rounded-2xl border border-border/70 bg-surface-elevated p-6 shadow-card animate-scale-in">
                <ul className="space-y-4">
                  {meta.map(({ icon: Icon, label, value }) => (
                    <li key={label} className="flex items-start gap-3">
                      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
                        <div className="text-sm font-medium text-foreground">{value}</div>
                      </div>
                    </li>
                  ))}
                </ul>
                {registered ? (
                  <Button asChild variant="outline" size="lg" className="mt-6 w-full">
                    <Link to="/dashboard">
                      <CheckCircle2 className="h-4 w-4 text-primary" /> You're registered
                    </Link>
                  </Button>
                ) : (
                  <Button onClick={handleRegisterClick} variant="ember" size="lg" className="mt-6 w-full">
                    Register for {event.title}
                  </Button>
                )}
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Free for IEM–UEM students · ₹150 for outside teams
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="container-narrow mt-16">
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">You may also like</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((e, i) => (
              <Link
                key={e.slug}
                to={`/events/${e.slug}`}
                className="group rounded-2xl border border-border/70 bg-surface-elevated p-6 shadow-soft transition-all hover:shadow-card hover:-translate-y-0.5 animate-fade-in-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <span className="text-xs uppercase tracking-wider text-primary capitalize">{e.category}</span>
                <h3 className="mt-2 font-display text-lg font-semibold group-hover:text-primary transition-colors">{e.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{e.tagline}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <RegisterDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        eventId={event.id}
        eventTitle={event.title}
        minSize={event.min_team_size}
        maxSize={event.max_team_size}
        onSuccess={() => setRegistered(true)}
      />
    </SiteLayout>
  );
};

export default EventDetail;
