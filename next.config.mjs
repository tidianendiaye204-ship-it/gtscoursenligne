import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import withSerwistInit from "@serwist/next";

initOpenNextCloudflareForDev();

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.r2.dev" },
    ],
  },
};

export default withSerwist(nextConfig);
