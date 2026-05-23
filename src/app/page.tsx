import { Grid, GridCell } from "@/components/layout/grid";
import { PortfolioFigure } from "@/components/media/figure";
import { VimeoEmbed } from "@/components/media/vimeo-embed";

export default function Home() {
  return (
    <div className="py-[var(--grid-row-gap)]">
      <Grid>
        <GridCell span={12}>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
            Portfolio · In progress
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-medium tracking-tight md:text-5xl">
            Swiss grid. Mobile-first media. Case studies in MDX.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--muted)]">
            Stack: Next.js on Vercel, Vimeo for vertical video, MDX for long-form
            writeups. Replace the sample media below with your first case study
            when ready.
          </p>
        </GridCell>

        <GridCell span={6} className="prose-case-study">
          <VimeoEmbed
            videoId="76979871"
            title="Sample vertical Vimeo embed"
          />
          <p className="text-sm leading-relaxed text-[var(--muted)]">
            Default embed is 9:16. Upload portrait masters to Vimeo and swap the
            video ID.
          </p>
        </GridCell>

        <GridCell span={6} className="prose-case-study">
          <PortfolioFigure
            src="/next.svg"
            alt="Placeholder image"
            width={420}
            height={747}
            caption="Replace with vertical stills from your case studies."
          />
        </GridCell>
      </Grid>
    </div>
  );
}
