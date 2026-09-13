/** @type {import('next').NextConfig} */

// GitHub Pages serves this project under /<repo>/. In CI we set
// NEXT_PUBLIC_BASE_PATH=/huaming-order-sheet; locally it stays empty.
// basePath prefixes routes + `_next` assets. assetPrefix is a CDN knob —
// do not set it to the same subpath (double-prefix). trailingSlash matches
// GH Pages directory URLs (`/sheet/oltc/` → `sheet/oltc/index.html`).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
