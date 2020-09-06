module.exports = {
  productionSourceMap: false, // 生产禁止显示源代码
  publicPath: '/',   // publicPaht需要根据静态资源部署加上相应前缀，例如: /easy-order/
  outputDir: 'dist',
  devServer: {
    port: 8080,
    overlay: {
        warnings: true,
        errors: true
    }
  },
  configureWebpack: {
    plugins: [
    ]
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "@/styles/index.scss";
        `
      }
    }
  }
}
