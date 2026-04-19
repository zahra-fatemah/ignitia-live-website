import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHero } from "@/components/PageHero";
import { Flame, Heart, Users, Sparkles } from "lucide-react";

const About = () => {
  const pillars = [
    {
      icon: Flame,
      title: "Our Story",
      body: "Born in 2014 as a small inter-college tech meet, IGNITIA has grown into one of Eastern India's largest student-run techno-cultural festivals — a phoenix that rises a little higher every year.",
    },
    {
      icon: Sparkles,
      title: "Vision",
      body: "To create a campus where engineering rigor meets artistic expression — and where every student finds at least one stage that feels like home.",
    },
    {
      icon: Heart,
      title: "Mission",
      body: "Curate experiences that nurture talent, celebrate diversity, and build lifelong connections between students, mentors and industry.",
    },
    {
      icon: Users,
      title: "Community",
      body: "150+ student volunteers, 50+ partner colleges, alumni from across India — the IGNITIA community is the real prize.",
    },
  ];

  return (
    <SiteLayout>
      <PageHero
        eyebrow="About IGNITIA'26"
        title={
          <>
            A small spark.<br />
            <span className="text-gradient-ember">A two-day inferno.</span>
          </>
        }
        description="IGNITIA is the annual techno-cultural fest of IEM–UEM Group, Kolkata. For 48 hours every August, our campus turns into a melting pot of code, music, debate, gaming and ideas waiting to be set on fire."
      />

      <section className="container-narrow mt-8">
        <div className="grid gap-5 sm:grid-cols-2">
          {pillars.map(({ icon: Icon, title, body }, i) => (
            <article
              key={title}
              className="rounded-2xl border border-border/70 bg-surface-elevated p-7 shadow-soft transition-all hover:shadow-card hover:-translate-y-0.5 animate-fade-in-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mt-5 font-display text-2xl font-semibold">{title}</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container-narrow mt-24">
        <div className="rounded-3xl border border-border/70 bg-gradient-warm p-8 sm:p-12 shadow-card">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-primary">Past highlights</span>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight">
                A decade of moments
              </h2>
              <p className="mt-3 text-muted-foreground">
                Every edition is a chapter. Here's a glimpse of the most recent ones.
              </p>
            </div>
            <div className="md:col-span-2 grid gap-4 sm:grid-cols-2">
              {[
                { year: "2025", body: "Headliner night with The Local Train. 12K+ footfall across two days." },
                { year: "2024", body: "Phoenix Hackathon recorded 280+ projects from 60 colleges." },
                { year: "2023", body: "First open-air cultural night with a celebrity DJ act." },
                { year: "2022", body: "Hybrid edition reached 25K viewers on the live stream." },
              ].map((h) => (
                <div
                  key={h.year}
                  className="rounded-2xl border border-border/60 bg-surface-elevated p-5 shadow-soft"
                >
                  <div className="font-display text-2xl font-bold text-primary">{h.year}</div>
                  <p className="mt-2 text-sm text-muted-foreground">{h.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default About;
