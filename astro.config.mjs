// @ts-check
import { defineConfig, fontProviders, envField } from "astro/config";

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
    plugins: [
      tailwindcss(),
      {
        name: "prebundle-client-deps",
        configEnvironment(environmentName, config) {
          if (environmentName !== "client") return;
          config.optimizeDeps ??= {};
          config.optimizeDeps.include ??= [];
          config.optimizeDeps.include.push(
            "@lucide/astro",
            "astro/actions/runtime/entrypoints/client.js",
          );
        },
      },
    ],
    optimizeDeps: {
      include: [
        "@lucide/astro",
        "resend",
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "astro/logger/json",
      ],
    },
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
});