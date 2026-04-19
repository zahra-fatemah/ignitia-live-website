import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Code2, Music4, Trophy, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Countdown } from "@/components/Countdown";
import { EventCard } from "@/components/EventCard";
import { events } from "@/data/events";
import { FEST_DATE_LABEL, FEST_HOST, FEST_START, FEST_TAGLINE } from "@/data/site";
import logo from "@/assets/ignitia-logo.jpeg";

const stats = [
  { label: "Events", value: "20+" },
  { label: "Footfall", value: "10K+" },
  { label: "Prize pool", value: "₹2L+" },
  { label: "Colleges", value: "50+" },
];

const sponsorTiers = ["Title", "Powered by", "Tech Partner", "Cultural Partner", "Snack Partner", "Media Partner"];

const Index = () => {
  const featured = events.slice(0, 6);

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" aria-hidden />
        <div className="container-narrow relative pb-20 pt-12 sm:pb-28 sm:pt-20">
          <div className="flex flex-col items-center text-center">
            <div className="relative animate-scale-in">
              <div
                className="absolute inset-0 -z-10 rounded-full bg-primary/15 blur-3xl"
                aria-hidden
              />
              <img
                src={logo}
                alt="IGNITIA'26 phoenix logo"
                width={180}
                height={180}
                className="h-36 w-36 sm:h-44 sm:w-44 object-contain animate-float-soft"
              />
            </div>

            <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary animate-fade-in">
              <Sparkles className="h-3.5 w-3.5" />
              {FEST_HOST} · {FEST_DATE_LABEL}
            </span>

            <h1 className="mt-6 font-display text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-balance animate-fade-in-up">
              <span className="block text-foreground">IGNITIA</span>
              <span className="block text-gradient-ember">'26</span>
            </h1>

            <p
              className="mt-6 max-w-xl text-lg sm:text-xl text-muted-foreground leading-relaxed text-balance animate-fade-in-up"
              style={{ animationDelay: "120ms" }}
            >
              {FEST_TAGLINE}. Two days of code, culture and unforgettable moments
              at the heart of Kolkata.
            </p>

            <div
              className="mt-10 flex flex-col sm:flex-row items-center gap-3 animate-fade-in-up"
              style={{ animationDelay: "240ms" }}
            >
              <Button asChild variant="ember" size="xl">
                <Link to="/events">
                  Register Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <Link to="/schedule">View Schedule</Link>
              </Button>
            </div>

            {/* Countdown */}
            <div
              className="mt-16 w-full max-w-2xl animate-fade-in-up"
              style={{ animationDelay: "360ms" }}
            >
              <p className="mb-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                The phoenix rises in
              </p>
              <Countdown target={FEST_START} />
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="container-narrow -mt-8">
        <div className="grid grid-cols-2 gap-3 rounded-2xl border border-border/70 bg-surface-elevated p-4 sm:grid-cols-4 sm:p-6 shadow-card">
          {stats.map((s) => (
            <div key={s.label} className="px-3 py-2 text-center">
              <div className="font-display text-2xl sm:text-3xl font-bold text-gradient-ember">
                {s.value}
              </div>
              <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PILLARS */}
      <section className="container-narrow mt-24">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: Code2, title: "Tech", body: "Hackathons, ICPC-style coding battles and workshops led by industry mentors." },
            { icon: Music4, title: "Cultural", body: "Bands, dance, theatre and a celebrity headliner under the open sky." },
            { icon: Trophy, title: "Glory", body: "₹2L+ in prizes, certificates and the chance to be remembered." },
          ].map(({ icon: Icon, title, body }, i) => (
            <div
              key={title}
              className="rounded-2xl border border-border/70 bg-surface-elevated p-7 shadow-soft transition-all hover:shadow-card hover:-translate-y-0.5 animate-fade-in-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* EVENTS */}
      <section className="container-narrow mt-24">
        <div className="flex items-end justify-between gap-6">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-primary">Highlights</span>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight">
              Events to look out for
            </h2>
          </div>
          <Button asChild variant="link" className="hidden sm:inline-flex">
            <Link to="/events">
              All events <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((e, i) => (
            <EventCard key={e.slug} event={e} index={i} />
          ))}
        </div>
      </section>

      {/* SPONSORS PREVIEW */}
      <section className="container-narrow mt-24">
        <div className="rounded-3xl border border-border/70 bg-gradient-warm p-8 sm:p-12 shadow-card">
          <div className="text-center">
            <span className="text-xs uppercase tracking-[0.2em] text-primary">Backed by</span>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight">
              Our partners in flame
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              From global tech giants to homegrown brands — IGNITIA'26 is powered
              by people who believe in young creators.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {sponsorTiers.map((tier, i) => (
              <div
                key={tier}
                className="rounded-xl border border-border/60 bg-surface-elevated/80 px-4 py-6 text-center text-sm font-medium text-muted-foreground shadow-soft transition-all hover:shadow-card hover:-translate-y-0.5 animate-fade-in-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {tier}
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button asChild variant="outline">
              <Link to="/sponsors">Become a sponsor</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-narrow mt-24">
        <div className="overflow-hidden rounded-3xl bg-gradient-ember px-8 py-14 sm:px-14 sm:py-20 shadow-ember">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div className="text-primary-foreground">
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-balance">
                Be part of something unforgettable.
              </h2>
              <p className="mt-4 text-primary-foreground/85 text-lg max-w-md">
                Registrations are open for all 20+ events. Solo or in a team —
                there's a stage waiting for you.
              </p>
            </div>
            <div className="flex flex-col gap-3 md:items-end">
              <div className="flex items-center gap-2 text-primary-foreground/90">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">{FEST_DATE_LABEL}</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/90">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">IEM–UEM Campus, Kolkata</span>
              </div>
              <Button
                asChild
                size="xl"
                className="mt-4 bg-surface-elevated text-primary hover:bg-surface-elevated/90 shadow-lift"
              >
                <Link to="/events">
                  Reserve your spot <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default Index;
