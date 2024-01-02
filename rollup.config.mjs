import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';

export default [
  {
    input: './src/index.ts',
    output: [
      {
        dir: 'dist',
        format: 'cjs',
        entryFileNames: '[name].cjs.js',
        sourcemap: false,
      },
      {
        dir: 'dist',
        format: 'esm',
        entryFileNames: '[name].esm.js',
        sourcemap: false,
      },
    ],
    plugins: [commonjs(), typescript({ module: "ESNext" })]
  }
]

