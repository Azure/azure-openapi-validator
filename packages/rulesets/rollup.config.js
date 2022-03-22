import commonjs from '@rollup/plugin-commonjs';

export default {
  input: ['dist/spectral/common.js','dist/spectral/arm.js'],
  output: {
    dir: 'dist/spectral',
    format: 'cjs',
    manualChunks: () => 'function/chunk'
  },
  external:['@stoplight/spectral-formats','@stoplight/spectral-functions'],
  plugins: [commonjs()]
};