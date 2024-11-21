import { createResolver } from "nuxt/kit";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      meta: [
        {
          name: "keywords",
          content:
            "Medibox Медибокс MediBox Медицина Клиника Аптека Стоматология ИМН",
        },
      ],
    },
  },
  devtools: { enabled: false },
  modules: ["@nuxt/ui", "@nuxtjs/i18n", "nuxt3-leaflet"],
  plugins: ["~/plugins/vue-datepicker.js"],
  i18n: {
    strategy: "no_prefix",
    vueI18n: "./i18n.config.ts",
    langDir: "i18n",
    locales: [
      { code: "ru", iso: "ru-RU", file: "ru.js" },
      { code: "en", iso: "en-US", file: "en.js" },
      { code: "kk", iso: "kk-KZ", file: "kk.js" },
    ],
    defaultLocale: "ru",
    lazy: true,
    baseUrl: "https://medibox.kz",
  },
  css: ["~/assets/main.css"],
  runtimeConfig: {
    public: {
      API_HOST: process.env.API_HOST,
      API_URL: process.env.API_URL,
    },
  },
  ui: {
    icons: ["ic"],
  },
  colorMode: {
    preference: "light",
  },
});
