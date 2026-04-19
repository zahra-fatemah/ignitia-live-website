import { Link } from "react-router-dom";
import { Instagram, Linkedin, Twitter, Youtube, Mail } from "lucide-react";
import logo from "@/assets/ignitia-logo.jpeg";
import { FEST_DATE_LABEL, FEST_HOST, NAV_LINKS } from "@/data/site";

export const SiteFooter = () => {
  return (
    <footer className="mt-24 border-t border-border/60 bg-surface-cream/60">
      <div className="container-wide py-14">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link to="/" className="flex items-center gap-2.5">
              <img src={logo} alt="IGNITIA'26 logo" className="h-10 w-10 rounded-md object-contain" />
              <span className="font-display text-xl font-bold">
                IGNITIA<span className="text-primary">'26</span>
              </span>
            </Link>
            <p className="mt-4 max-w-md text-sm text-muted-foreground leading-relaxed">
              The annual techno-cultural fest of {FEST_HOST}. Two days of code,
              creativity and community — {FEST_DATE_LABEL}.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {[
                { icon: Instagram, href: "#", label: "Instagram" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Youtube, href: "#", label: "YouTube" },
                { icon: Mail, href: "/contact", label: "Email" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface-elevated text-muted-foreground transition-all hover:text-primary hover:border-primary/40 hover:shadow-soft"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-display text-sm font-semibold mb-4">Explore</h4>
            <ul className="space-y-2.5 text-sm">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link to={l.href} className="text-muted-foreground hover:text-primary transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 className="font-display text-sm font-semibold mb-4">Reach us</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>IEM Gurukul Campus, Y-13, Block-EP, Sector V</li>
              <li>Salt Lake, Kolkata 700091</li>
              <li>
                <a href="mailto:hello@ignitia26.in" className="hover:text-primary transition-colors">
                  hello@ignitia26.in
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 IGNITIA. Crafted with care at IEM–UEM, Kolkata.</p>
          <p className="font-display tracking-wide">
            <span className="text-gradient-ember font-semibold">IGNITIA'26</span> — Where Innovation Meets Creativity.
          </p>
        </div>
      </div>
    </footer>
  );
};
