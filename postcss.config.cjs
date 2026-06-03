module.exports = {
  plugins: {
    'postcss-px-to-viewport-8-plugin': {
      viewportWidth: 375,
      unitPrecision: 5,
      propList: ['*'],
      selectorBlackList: ['.norem'],
      minPixelValue: 1,
      mediaQuery: false,
    },
  },
}
