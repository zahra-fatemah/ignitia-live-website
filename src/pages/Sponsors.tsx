import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const tiers = [
  {
    name: "Title Sponsor",
    accent: "from-primary to-primary-glow",
    perks: ["Naming rights to the fest", "Logo on every collateral", "Headline stage time", "Premium booth"],
    sponsors: ["Available"],
  },
  {
    name: "Powered By",
    accent: "from-amber to-primary-glow",
    perks: ["Co-branded fest title", "Stage time at finale", "Premium booth", "Social media features"],
    sponsors: ["TechNova", "Arclight"],
  },
  {
    name: "Gold Partners",
    accent: "from-chip-peach-fg to-amber",
    perks: ["Logo on hero collaterals", "Booth at venue", "Workshop slot"],
    sponsors: ["Brewlab", "Northwind", "Velocity", "Lumen"],
  },
  {
    name: "Silver Partners",
    accent: "from-chip-blue-fg to-chip-mint-fg",
    perks: ["Logo on event pages", "Goodie bag inserts"],
    sponsors: ["Foragehub", "Quill", "Mosaic", "Rover", "Soundboard", "Atlas"],
  },
];

const Sponsors = () => {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Sponsors & Partners"
        title={
          <>
            Powered by people who believe in<br />
            <span className="text-gradient-ember">young creators.</span>
          </>
        }
        description="From global tech giants to homegrown brands — these are the partners helping us light up the IEM–UEM campus this August."
      />

      <section className="container-narrow mt-4 space-y-10">
        {tiers.map((tier, ti) => (
          <article
            key={tier.name}
            className="rounded-3xl border border-border/70 bg-surface-elevated p-6 sm:p-10 shadow-card animate-fade-in-up"
            style={{ animationDelay: `${ti * 80}ms` }}
          >
            <div className="grid gap-8 md:grid-cols-3">
              <div>
                <span className={`inline-block rounded-full bg-gradient-to-r ${tier.accent} px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white`}>
                  Tier
                </span>
                <h2 className="mt-3 font-display text-2xl sm:text-3xl font-bold">{tier.name}</h2>
                <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                  {tier.perks.map((p) => (
                    <li key={p} className="flex gap-2">
                      <span className="text-primary">·</span> {p}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {tier.sponsors.map((s) => (
                  <div
                    key={s}
                    className="flex aspect-[5/3] items-center justify-center rounded-xl border border-border/60 bg-gradient-warm text-center font-display font-semibold text-foreground/70 shadow-soft transition-all hover:shadow-card hover:-translate-y-0.5"
                  >
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </article>
        ))}

        <div className="rounded-3xl bg-gradient-ember p-8 sm:p-12 text-center shadow-ember">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary-foreground">
            Want your brand on this list?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/85">
            Reach 10,000+ students from across Eastern India. We design custom
            packages around your brand goals.
          </p>
          <Button asChild size="xl" className="mt-6 bg-surface-elevated text-primary hover:bg-surface-elevated/90">
            <Link to="/contact">Talk to our team</Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
};

export default Sponsors;
