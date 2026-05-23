import type { MDXComponents } from "mdx/types";
import { PortfolioFigure } from "@/components/media/figure";
import { VimeoEmbed } from "@/components/media/vimeo-embed";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    Figure: PortfolioFigure,
    Vimeo: VimeoEmbed,
    ...components,
  };
}
