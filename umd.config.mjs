import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';

const terserOptions = {
  compress: {
    passes: 2,
  }
};

export default [
  {
    input: './src/index.ts',
    output: [
      {
        dir: 'dist',
        format: 'umd',
        entryFileNames: '[name].umd.js',
        name: 'firework',
        sourcemap: false,
        plugins: [terser(terserOptions)]
      },
    ],
    plugins: [commonjs(), nodeResolve(), typescript({ module: "ESNext" })]
  }
]

