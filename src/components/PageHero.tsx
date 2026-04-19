import { ReactNode } from "react";

interface PageHeroProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
}

export const PageHero = ({ eyebrow, title, description, children }: PageHeroProps) => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero" aria-hidden />
      <div className="container-narrow relative py-20 sm:py-28">
        <div className="max-w-3xl animate-fade-in-up">
          {eyebrow && (
            <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              {eyebrow}
            </span>
          )}
          <h1 className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-balance">
            {title}
          </h1>
          {description && (
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed text-balance max-w-2xl">
              {description}
            </p>
          )}
          {children && <div className="mt-8">{children}</div>}
        </div>
      </div>
    </section>
  );
};
