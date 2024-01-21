import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
// import vercel from "@astrojs/vercel/serverless";
// import netlify from "@astrojs/netlify";
import cloudflare from "@astrojs/cloudflare";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  output: "server",
  site: "https://the-tech-blog.pages.dev",
  integrations: [mdx(), sitemap(), react(), tailwind()],
  adapter: cloudflare() // vercel(), netlify()
});