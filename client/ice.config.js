const path = require('path');

module.exports = {
  entry: 'src/index.jsx',
  //publicPath: './',
  //devPublicPath: '/cjxzs',
  devServer: {
    historyApiFallback: true,
  },
  outputAssetsPath: {
    // 示例1：修改为 build/css-dist/ build/js-dist/
    // js: 'cjxzs',
    // css: 'cjxzs',
    js: 'CJQX',
    css: 'CJQX',
  },
  proxy: {
    "/cjxzs/api": {
      "target": "http://127.0.0.1:3007"
    },
    "/cjxzs/crud": {
     "target": "http://127.0.0.1:3007"
    },
    "/cjxzs/task": {
      "target": "http://127.0.0.1:3333"
    },
    "/CJQX/api": {
      "target": "http://127.0.0.1:3007"
    },
    "/CJQX/crud": {
      "target": "http://127.0.0.1:3007"
    },
    "/CJQX/task": {
      "target": "http://127.0.0.1:3333"
    }
  },
  plugins: [
    ['ice-plugin-fusion', {
      //themePackage: '@icedesign/theme',
    }],
    ['ice-plugin-moment-locales', {
      locales: ['zh-cn'],
    }],
  ],
  alias: {
    '@': path.resolve(__dirname, './src/'),
  },

};
