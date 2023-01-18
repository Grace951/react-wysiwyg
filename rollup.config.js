const peerDepsExternal = require('rollup-plugin-peer-deps-external');
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('@rollup/plugin-typescript');
const postcss = require('rollup-plugin-postcss');

const packageJson = require('./package.json');

module.exports = {
  input: 'src/index.tsx',
  output: [
    // CommonJS
    {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: true,
    },
    // ESM
    {
      file: packageJson.module,
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve(),
    commonjs(),
    typescript({ tsconfig: './tsconfig.json' }),
    postcss({
      extensions: ['.css'],
    }),
  ],
};
