import commonjs from '@rollup/plugin-commonjs';

export default {
  input: ['spectral/common.js','spectral/arm.js'],
  output: {
    dir: 'spectral/js-ruleset',
    format: 'cjs',
    manualChunks: () => 'function/chunk'
  },
  external:['@stoplight/spectral-formats','@stoplight/spectral-functions'],
  plugins: [commonjs()]
};