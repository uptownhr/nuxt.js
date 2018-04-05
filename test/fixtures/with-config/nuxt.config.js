import path from 'path'

export default {
  srcDir: __dirname,
  router: {
    base: '/test/',
    middleware: 'noop',
    extendRoutes(routes) {
      return [
        ...routes,
        {
          name: 'about-bis',
          path: '/about-bis',
          component: '~/pages/about.vue'
        },
        {
          path: '/redirect/about-bis',
          redirect: '/about-bis'
        }
      ]
    }
  },
  modulesDir: [path.join(__dirname, '..', '..', '..', 'node_modules')],
  transition: 'test',
  layoutTransition: 'test',
  loadingIndicator: 'circle',
  offline: true,
  extensions: 'ts',
  plugins: [
    '~/plugins/test.js',
    { src: '~/plugins/only-client.js', ssr: false }
  ],
  loading: '~/components/loading',
  env: {
    bool: true,
    num: 23,
    string: 'Nuxt.js',
    object: {
      bool: false,
      string: 'ok',
      num2: 8.23,
      obj: {
        again: true
      }
    }
  },
  build: {
    publicPath: '/orion/',
    maxChunkSize: 300000,
    cssSourceMap: true,
    parallel: true,
    analyze: {
      analyzerMode: 'disabled',
      generateStatsFile: true,
      logLevel: 'error'
    },
    styleResources: {
      scss: '~/assets/pre-process.scss'
    },
    babel: {
      presets({ isServer }) {
        return null // Coverage: Return null, so defaults will be used.
      }
    },
    extend(config, options) {
      return Object.assign({}, config, {
        devtool: 'nosources-source-map'
      })
    }
  },
  css: [{ src: '~/assets/app.css' }],
  render: {
    csp: true,
    http2: {
      push: true,
      shouldPush: (file, type) => type === 'script'
    },
    bundleRenderer: {
      shouldPreload: (file, type) => {
        return ['script', 'style', 'font'].includes(type)
      }
    },
    static: {
      maxAge: '1y'
    }
  }
}
