// @ts-check
import {
  defineConfig,
  fontProviders,
  envField,
  svgoOptimizer,
} from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Inter",
      cssVariable: "--font-inter",
    },
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react()],

  env: {
    schema: {
      RESEND_API_KEY: envField.string({
        context: "server",
        access: "secret",
      }),
      FROM_EMAIL: envField.string({
        context: "server",
        access: "secret",
      }),
      TO_EMAIL: envField.string({
        context: "server",
        access: "secret",
      }),
    },
  },

  adapter: cloudflare(),

  experimental: {
    svgOptimizer: svgoOptimizer(),
  },
});
