// production config
const merge = require('webpack-merge');
const { resolve } = require('path');
const commonConfig = require('./common');
const Dotenv = require('dotenv-webpack');

module.exports = merge(commonConfig, {
  mode: 'production',
  entry: './index.tsx',
  output: {
    filename: 'js/bundle.[hash].min.js',
    path: resolve(__dirname, '../../../docs'),
    // publicPath: '/CurriculumVitae/',
  },
  devtool: 'source-map',
  plugins: [
    new Dotenv({ path: './.env.prod' }),
  ],
});
