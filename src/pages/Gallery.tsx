import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageHero } from "@/components/PageHero";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import g5 from "@/assets/gallery-5.jpg";
import g6 from "@/assets/gallery-6.jpg";

const items = [
  { src: g1, alt: "Crowd at sunset cheering during fest", w: 1024, h: 1024, span: "row-span-2" },
  { src: g2, alt: "Hackathon participants coding", w: 1024, h: 768, span: "" },
  { src: g3, alt: "Singer on stage with warm spotlight", w: 768, h: 1024, span: "row-span-2" },
  { src: g4, alt: "Esports tournament arena", w: 1024, h: 768, span: "" },
  { src: g5, alt: "Dance performance under stage lights", w: 1024, h: 1024, span: "" },
  { src: g6, alt: "Trophy and medals on a wooden table", w: 768, h: 1024, span: "" },
];

const Gallery = () => {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Gallery"
        title={
          <>
            Moments that became<br />
            <span className="text-gradient-ember">memories.</span>
          </>
        }
        description="A glimpse into editions past — and a small promise of what's coming this August."
      />

      <section className="container-wide mt-4">
        <div className="grid auto-rows-[180px] sm:auto-rows-[220px] grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((it, i) => (
            <figure
              key={i}
              className={`group relative overflow-hidden rounded-2xl border border-border/60 bg-surface-cream shadow-soft transition-all hover:shadow-lift animate-fade-in-up ${it.span}`}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <img
                src={it.src}
                alt={it.alt}
                width={it.w}
                height={it.h}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </figure>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
};

export default Gallery;
