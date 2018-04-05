import path from 'path'

import MiniCssExtractPlugin from 'mini-css-extract-plugin'

import PostcssConfig from './postcss'

export default class StyleLoader {
  constructor(options, nuxt, { isServer }) {
    this.isServer = isServer
    this.dev = options.dev
    this.srcDir = options.srcDir
    this.assetsDir = options.dir.assets
    this.staticDir = options.dir.static
    this.extractCSS = options.build.extractCSS
    this.resources = options.build.styleResources
    this.sourceMap = Boolean(options.build.cssSourceMap)

    if (options.build.postcss) {
      this.postcssConfig = new PostcssConfig(options, nuxt)
    }
  }

  normalize(loaders) {
    loaders = Array.isArray(loaders) ? loaders : [loaders]
    return loaders.map(loader => Object.assign(
      { options: { sourceMap: this.sourceMap } },
      typeof loader === 'string' ? { loader } : loader
    ))
  }

  styleResource(ext) {
    const extResource = this.resources[ext]
    // style-resources-loader
    // https://github.com/yenshih/style-resources-loader
    if (extResource) {
      const patterns = Array.isArray(extResource)
        ? extResource
        : [extResource]

      return {
        loader: 'style-resources-loader',
        options: Object.assign(
          { patterns },
          this.resources.options || {}
        )
      }
    }
  }

  postcss() {
    // postcss-loader
    // https://github.com/postcss/postcss-loader
    if (this.postcssConfig) {
      const config = this.postcssConfig.config()
      if (config) {
        return {
          loader: 'postcss-loader',
          options: Object.assign({ sourceMap: this.sourceMap }, config)
        }
      }
    }
  }

  css(importLoaders, options) {
    // css-loader
    // https://github.com/webpack-contrib/css-loader
    const cssLoaderAlias = {
      [`/${this.assetsDir}`]: path.join(this.srcDir, this.assetsDir),
      [`/${this.staticDir}`]: path.join(this.srcDir, this.staticDir)
    }

    return {
      loader: (this.isServer && this.extractCSS) ? 'css-loader/locals' : 'css-loader',
      options: Object.assign({
        sourceMap: this.sourceMap,
        minimize: !this.dev,
        importLoaders: importLoaders,
        alias: cssLoaderAlias
      }, options)
    }
  }

  extract() {
    if (this.extractCSS && !this.isServer) {
      return MiniCssExtractPlugin.loader
    }
  }

  vueStyle() {
    // https://github.com/vuejs/vue-style-loader
    return {
      loader: 'vue-style-loader',
      options: { sourceMap: this.sourceMap }
    }
  }

  apply(ext, loaders = []) {
    const customLoaders = [].concat(
      this.postcss(loaders),
      this.styleResource(ext),
      this.normalize(loaders)
    ).filter(Boolean)

    const styleLoader = this.extract() || this.vueStyle()

    return [
      // This matches <style module>
      {
        resourceQuery: /module/,
        use: [].concat(
          styleLoader,
          this.css(customLoaders.length, {
            modules: true,
            localIdentName: '[local]_[hash:base64:5]'
          }),
          customLoaders
        )
      },
      // This matches plain <style> or <style scoped>
      {
        use: [].concat(
          styleLoader,
          this.css(customLoaders.length),
          customLoaders
        )
      }
    ]
  }
}
