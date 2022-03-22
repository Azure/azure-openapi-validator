import commonjs from '@rollup/plugin-commonjs';

export default {
  input: ['dist/spectral/common.js','dist/spectral/arm.js'],
  output: {
    dir: 'dist/spectral-rollup',
    format: 'cjs',
    manualChunks: () => 'chunk'
  },
  external:['@stoplight/spectral-formats','@stoplight/spectral-functions','@stoplight/spectral-rulesets'],
  plugins: [commonjs()]
};