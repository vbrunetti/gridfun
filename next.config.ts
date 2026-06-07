import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  async redirects() {
    return [
      { source: "/work", destination: "/case-studies", permanent: true },
      {
        source: "/work/:slug",
        destination: "/case-studies/:slug",
        permanent: true,
      },
    ];
  },
};

export default withMDX(nextConfig);
