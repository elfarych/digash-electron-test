// const {svelte} = import('@sveltejs/vite-plugin-svelte');
// import {svelte} from '@sveltejs/vite-plugin-svelte';

// const {svelte} = require("@sveltejs/vite-plugin-svelte");

function viteRawPlugin(options) {
  return {
    name: 'vite-raw-plugin',
    transform(code, id) {
      if (options.fileRegex.test(id)) {
        const json = JSON.stringify(code)
          .replace(/\u2028/g, '\\u2028')
          .replace(/\u2029/g, '\\u2029')

        return {
          code: `export default ${json}`
        }
      }
    }
  }
}

module.exports = {
  module: {
    rules: [
      // svelte({emitCss: false}),
      {
        test: /\.navy$/i,
        use: 'raw-loader',
      },
    ]
  },
  plugins: [
    viteRawPlugin({fileRegex: /\.navy$/i})
  ]
};
