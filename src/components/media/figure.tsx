import Image, { type ImageProps } from "next/image";

type PortfolioFigureProps = {
  src: ImageProps["src"];
  alt: string;
  width: number;
  height: number;
  caption?: string;
  priority?: boolean;
  className?: string;
};

export function PortfolioFigure({
  src,
  alt,
  width,
  height,
  caption,
  priority,
  className,
}: PortfolioFigureProps) {
  return (
    <figure className={className}>
      <div className="relative w-full overflow-hidden border border-[var(--rule-light)] bg-[var(--color-flesh)]/40">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          className="h-auto w-full"
          sizes="(max-width: 768px) 100vw, min(420px, 40vw)"
        />
      </div>
      {caption ? (
        <figcaption className="mt-2 text-sm leading-relaxed text-secondary">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
