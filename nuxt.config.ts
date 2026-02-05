// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxtjs/google-fonts', '@vueuse/nuxt'],
  googleFonts: {
    families: {
      'Inter': [300, 400, 500, 600, 700, 800],
      'Space Grotesk': [400, 500, 600, 700],
    },
    display: 'swap',
    prefetch: true,
    preconnect: true,
  },
  app: {
    head: {
      title: 'QuickHelp.lol - Your All-in-One Help Hub',
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'description', content: 'Free tools for wellness, productivity, and learning — breathing exercises, habit trackers, calculators, dev tools, mental health resources & more.' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#7c3aed' },
        { property: 'og:title', content: 'QuickHelp.lol - Your All-in-One Help Hub' },
        { property: 'og:description', content: 'Free tools for wellness, productivity, and learning — breathing exercises, habit trackers, calculators, dev tools & more.' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
  },
  routeRules: {
    '/tools/**': { ssr: true },
    '/admin/**': { ssr: false },
  },
  nitro: {
    compressPublicAssets: true,
  },
  compatibilityDate: '2024-01-01'
})
