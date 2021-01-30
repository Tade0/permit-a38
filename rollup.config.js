// rollup.config.js
const typescript = require('@rollup/plugin-typescript');
const json = require('@rollup/plugin-json');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');

export default {
  input: 'src/index.ts',
  output: {
    dir: './lib',
    format: 'cjs'
  },
  plugins: [,
    commonjs(),
    json(),
    nodeResolve(),
    typescript({
      rootDir: './src',
    })
  ],
  external: [
    'typescript'
  ],
};
