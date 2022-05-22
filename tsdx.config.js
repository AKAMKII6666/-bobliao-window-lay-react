const postcss = require('rollup-plugin-postcss');
const url = require('postcss-url');
const copy = require('rollup-plugin-copy');

module.exports = {
  rollup(config, options) {
    config.plugins = [
      copy({
        targets: [{ src: './src/img/**/*', dest: './dist/img' }],
      }),
      postcss({
        inject: true,
        extract: false,
        plugins: [
          url({
            url: 'inline', // enable inline assets using base64 encoding
            maxSize: 500, // maximum file size to inline (in kilobytes)
            fallback: 'rebase', // fallback method to use if max size is exceeded
          }),
        ],
      }),
      ...config.plugins,
    ];
    return config;
  },
};
