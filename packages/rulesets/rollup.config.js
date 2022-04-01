import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json';
export default [
  {
  input: ['esm/spectral/az-arm.js'],
  output: {
    dir: 'generated/spectral',
    format: 'cjs',
    exports: 'default'
  },
  plugins: [commonjs(),json()],
  external:["@stoplight/spectral-functions","@stoplight/spectral-formats","@stoplight/spectral-rulesets"]
},
{
  input: ['esm/spectral/az-dataplane.js'],
  output: {
    dir: 'generated/spectral',
    format: 'cjs',
    exports: 'default'
  },
  plugins: [commonjs(),json()],
  external:["@stoplight/spectral-functions","@stoplight/spectral-formats","@stoplight/spectral-rulesets"]
},
{
  input: ['esm/spectral/az-common.js'],
  output: {
    dir: 'generated/spectral',
    format: 'cjs',
    exports: 'default'
  },
  plugins: [commonjs(),json()],
  external:["@stoplight/spectral-functions","@stoplight/spectral-formats","@stoplight/spectral-rulesets"]
}
];