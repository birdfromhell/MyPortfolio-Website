// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/ui', 
    '@nuxt/content', 
    '@nuxtjs/i18n',
    '@nuxthq/studio',
    '@nuxtjs/sitemap'
  ],
  devtools: { enabled: true },
  
  runtimeConfig: {
    // Konfigurasi yang hanya tersedia di server
    databaseUrl: process.env.DATABASE_URL,
    
    // Konfigurasi yang tersedia di client
    public: {
      apiBase: '/api',
      maintenance: process.env.MAINTENANCE || 'false'
    }
  },

  i18n: {
      vueI18n: './i18n.config.ts',
      locales: [
        {
          code: 'en',
          iso: 'en-US',
          name: 'English'
        },
        {
          code: 'id',
          iso: 'id-ID', 
          name: 'Bahasa Indonesia'
        }
      ],
            detectBrowserLanguage: {
                useCookie: true,
                cookieKey: 'i18n_redirected',
                redirectOn: 'root',
                alwaysRedirect: true,
                fallbackLocale: 'en'
            },
      defaultLocale: 'en'
  },

  tailwindcss: {
      configPath: 'tailwind.config.js',
      cssPath: '~/assets/css/main.css'
  },

  ui: {},

  // Konfigurasi Content untuk Nuxt Studio
  content: {
    documentDriven: true,
    api: {
      baseURL: '/api/_content'
    },
    // Tambahkan opsi ini untuk integrasi dengan Nuxt Studio
    experimental: {
      stripQueryParameters: false
    }
  },

  app: {
      head: {
          link: [
              {
                  rel: 'preload',
                  as: 'style',
                  type: 'text/css',
                  href: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css',
                  onload: "this.onload=null;this.rel='stylesheet'"
              },
              {
                  rel: 'icon',
                  type: 'image/svg+xml',
                  href: '/favicon.svg'
              },
              {
                  rel: 'icon',
                  type: 'image/x-icon',
                  href: '/favicon.ico'
              },
              {
                  rel: 'apple-touch-icon',
                  sizes: '180x180',
                  href: '/apple-touch-icon.png'
              },
              {
                  rel: 'manifest',
                  href: '/manifest.json'
              }
          ],
          meta: [
              { charset: 'utf-8' },
              { name: 'viewport', content: 'width=device-width, initial-scale=1' },
              { name: 'format-detection', content: 'telephone=no' },
              { name: 'msapplication-TileColor', content: '#0f172a' },
              { name: 'theme-color', content: '#0f172a' }
          ],
          htmlAttrs: {
              lang: 'en'
          }
      }
  },

  // SEO Configuration
  site: {
    url: 'https://your-domain.com', // Ganti dengan domain Anda
    name: 'Ababil Mustaqim',
    description: 'Ababil Mustaqim adalah seorang backend developer profesional dari Bandung, berpengalaman dalam membangun sistem backend yang scalable, aman, dan efisien.',
    defaultLocale: 'en'
  },

  sitemap: {
    urls: [
      '/',
      '/resume'
    ]
  },

  routeRules: {
      '/': { headers: { 'cache-control': 's-maxage=31536000' } },
      '/resume': { headers: { 'cache-control': 's-maxage=31536000' } },
      '/dashboard/**': { ssr: false },
      '/login': { ssr: false },
      '/closed': { ssr: false }
  },
  
  compatibilityDate: '2025-05-09'
});