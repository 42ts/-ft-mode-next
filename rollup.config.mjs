import terser from '@rollup/plugin-terser';
import banner2 from 'rollup-plugin-banner2';

export default {
  input: 'compile/index.js',
  output: {
    dir: 'dist',
    format: 'cjs',
  },
  plugins: [
    terser(),
    banner2(() => `'use client';`),
  ],
};
