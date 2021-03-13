module.exports = {
  pluginOptions: {
    lintStyleOnBuild: false,
  },
  css: {
    loaderOptions: {
      scss: {
        prependData: `
        @import "@/assets/color-variables.scss";
        `,
      },
    },
  },
  publicPath: process.env.NODE_ENV === 'production' ? '/d3-treemap-build/' : '/',
};
