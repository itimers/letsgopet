// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  pages: true,
  ssr: false,
  i18n: {
    vueI18n: './i18n.config.ts'
  },

  components: true,

  typescript: {
    shim: false,
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      charset: 'UTF-8',
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        { name: 'author', content: 'iTime', },
        { name: 'theme-color', content: '#dc9176', },
        { name: 'google-site-verification', content: 'GoogleVerificationCode', },
        { name: 'geo.region', content: '+381' },
        { name: 'distribution', content: 'global' },
        { name: 'rating', content: 'general' },
        { name: 'referrer', content: 'no-referrer' },
        { name: 'revisit-after', content: '7 days' },
        { name: 'application-name', content: "Let's Go Pet" },
        { name: 'msapplication-TileColor', content: '#dc9176' },
        { name: 'msapplication-TileImage', content: 'https://www.letsgopet.rs/favicon.ico' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:type', content: 'website' },
        { property: 'og:image:type', content: 'image/png' },
        { 'http-equiv': 'content-type', content: 'text/html; charset=UTF-8' },
        { 'http-equiv': 'pragma', content: 'no-cahe' },
        { 'http-equiv': 'imagetoolbar', content: 'no' },
        { 'http-equiv': 'expires', content: '0' },
        { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
        { 'http-equiv': 'content-script-type', content: 'text/javascript' },
        { 'http-equiv': 'content-style-type', content: 'text/css' },
        { 'http-equiv': 'x-dns-prefetch-control', content: 'on' },
        { 'http-equiv': 'p3p', content: "CP='This is not a P3P policy!'" },
        { 'http-equiv': 'application-name', content: "Let's Go Pet" },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        /* {
          rel: 'preload',
          href: '/public/img/zaki.webp',
          as: 'image',
          type: 'image/webp',
          fetchpriority: 'high'
        }, */
        // Preload the mobile background image
        //{ rel: "preconnect", href: 'https://fonts.googleapis.com' },
        //{ rel: "preconnect", href: 'https://fonts.gstatic.com', type: 'crossorigin' },
        //{ rel: "stylesheet", href: 'https://fonts.googleapis.com/css2?family=Mulish:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;0,1000;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900;1,1000&display=swap' },
      ],
      /*script: [
         { src: './static/script.js', hid: 'stripe', defer: true } 
      ],*/
    }
  },

  modules: ['@pinia/nuxt', '@nuxtjs/i18n'],
  
  
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/assets/scss/layouts.scss";'
        },
      }
    }
  },

  compatibilityDate: '2024-08-26',
})