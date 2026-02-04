// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxtjs/google-fonts', '@vueuse/nuxt'],
  googleFonts: {
    families: {
      'Inter': [300, 400, 500, 600, 700, 800],
      'Space Grotesk': [400, 500, 600, 700],
    }
  },
  app: {
    head: {
      title: 'QuickHelp.lol - Your All-in-One Help Hub',
      meta: [
        { name: 'description', content: 'Get quick help with anything - mental health, math, productivity tools, and more!' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  compatibilityDate: '2024-01-01'
})
