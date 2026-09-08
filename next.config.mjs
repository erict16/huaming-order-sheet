/** @type {import('next').NextConfig} */

// GitHub Pages serves this project under /<repo>/. In CI we set
// NEXT_PUBLIC_BASE_PATH=/huaming-order-sheet; locally it stays empty.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
