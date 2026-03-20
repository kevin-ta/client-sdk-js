// @ts-check
import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import packageJson from './package.json';

export function kebabCaseToPascalCase(string = '') {
  return string.replace(/(^\w|-\w)/g, (replaceString) =>
    replaceString.replace(/-/, '').toUpperCase(),
  );
}

/**
 * @type {import('rollup').InputPluginOption}
 */
export const commonPlugins = [
  nodeResolve({ browser: true, preferBuiltins: false }),
  commonjs(),
  json(),
  babel({
    babelHelpers: 'bundled',
    plugins: ['@babel/plugin-transform-object-rest-spread'],
    presets: ['@babel/preset-env'],
    extensions: ['.js', '.ts', '.mjs'],
    babelrc: false,
  }),
];

/**
 * @type {import('rollup').RollupOptions}
 */
// Strip npm scope (e.g. "@kevin-ta/livekit-client" → "livekit-client") so that
// output file names stay consistent with the paths declared in package.json exports.
const packageBaseName = packageJson.name.replace(/^@[^/]+\//, '');

export default {
  input: 'src/index.ts',
  output: [
    {
      file: `dist/${packageBaseName}.esm.mjs`,
      format: 'es',
      strict: true,
      sourcemap: true,
      compact: true,
    },
    {
      file: `dist/${packageBaseName}.umd.js`,
      format: 'umd',
      strict: true,
      sourcemap: true,
      name: kebabCaseToPascalCase(packageBaseName),
      plugins: [terser()],
    },
  ],
  plugins: [typescript({ tsconfig: './tsconfig.json' }), ...commonPlugins],
};
