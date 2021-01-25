// rollup.config.js
const typescript = require('@rollup/plugin-typescript');

export default {
  input: 'src/index.ts',
  output: {
    dir: './build',
    format: 'cjs'
  },
  plugins: [typescript()]
};
