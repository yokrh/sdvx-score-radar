
export default {
  mode: 'universal',

  /**
   * Environment variable.
   */
  env: {
    baseUrl: process.env.BASE_URL || 'http://localhost:3000'
  },

  /**
   * Headers of the page.
   */
  head: {
    // title: process.env.npm_package_name || 'SDVX譜面レーダーチャート',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      // { hid: 'description', name: 'description', content: process.env.npm_package_description || 'コナミの音楽ゲームSound Voltexの楽曲のレーダーチャートが見られる非公式サイトです。' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  /**
   * Customize the progress-bar color.
   */
  loading: { color: '#fff' },

  /**
   * Global CSS.
   */
  css: [
    'element-ui/lib/theme-chalk/index.css',
    'animate.css/animate.min.css'
  ],

  /**
   * Plugins to load before mounting the App.
   */
  plugins: [
    '@/plugins/element-ui'
  ],

  /**
   * Nuxt.js dev-modules.
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module'
  ],

  /**
   * Nuxt.js modules.
   */
  modules: [
    // Doc: https://github.com/nuxt-community/apollo-module
    '@nuxtjs/apollo',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://pwa.nuxtjs.org/
    '@nuxtjs/pwa',
    [
      'nuxt-i18n',
      {
        locales: [
          { code: 'ja', iso: 'ja_JP' },
          { code: 'en', iso: 'en-US' },
          { code: 'zh', iso: 'zh-Hant' },
          // { code: 'zh', iso: 'zh-Hans' },  // need study
        ],
        defaultLocale: 'ja',
        vueI18n: {
          fallbackLocale: 'ja',
        },
        vueI18nLoader: true,
      },
    ],
  ],

  /**
   * Apollo client module configuration.
   * Doc: https://github.com/nuxt-community/apollo-module
   */
  apollo: {
    // tokenName: 'myApolloToken', // optional, default: apollo-token
    clientConfigs: {　// required
      default: {
        httpEndpoint: 'https://api-server-n62smewrva-an.a.run.app/graphql',  // prd. TODO: custom domain
        // httpEndpoint: 'http://localhost:4000/graphql',  // dev
      },
    }
  },

  /**
   * Axios module configuration.
   * Doc: https://axios.nuxtjs.org/options
   */
  axios: {
    https: true,
    baseURL: process.env.API_URL || 'http://localhost:3000',
  },

  /**
   * Build configuration.
   */
  build: {
    transpile: [/^element-ui/],
    /*
    ** You can extend webpack config here.
    */
    extend (config, ctx) {
    }
  },

  /**
   * PWA module configuration.
   * Doc: https://pwa.nuxtjs.org/#modules
   */
  pwa: {
    meta: {
      title: 'SDVX score rader chart',
      author: 'yokrh',
    },
    manifest: {
      name: 'SDVX score rader chart',
      short_name: 'SDVXレーダー',
      lang: 'ja',
    },
    workbox: {
      // swURL: 'custom-sw.js',
      importScripts: ['custom-sw.js'],

      offline: false, // disable default cache rules
      dev: true, // enable sw in local dev

      // Define runtime caching rules.
      runtimeCaching: [
        {
          // Images
          urlPattern: /\.(?:png|jpg|jpeg|svg)$/,
          handler: 'cacheFirst',
          options: {
            cacheName: 'images',
            expiration: {
              maxAgeSeconds: 30 * 24 * 60 * 60,
            },
          },
        },
        /**
         * SW Cache API doesn't support POST method...
         * 
         * Ref:
         * https://medium.com/@jono/cache-graphql-post-requests-with-service-worker-100a822a388a
         * https://stackoverflow.com/questions/35270702/can-service-workers-cache-post-requests
         * https://stackoverflow.com/questions/33045517/use-serviceworker-cache-only-when-offline
         * https://github.com/nuxt-community/pwa-module/blob/dev/lib/workbox/options.js
         * 
         * Selected solution:
         * Integrate custom sw.js with POST handler containing indexedDB process
         */
        // {
        //   // GraphQL
        //   urlPattern: /https?:\/\/(.*)graphql/,
        //   handler: 'cacheFirst',
        //   method: 'POST',
        //   options: {
        //     cacheName: 'graphql',
        //     expiration: {
        //       maxAgeSeconds: 7 * 24 * 60 * 60,
        //     },
        //   },
        // },
      ],
    }    
  }
}
