const glob = require('glob');
const path = require('path');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const mode = process.env.NODE_ENV === 'development' ? 'development' : 'production';
const environment = process.env.SHOPIFY_ENV ? process.env.SHOPIFY_ENV : 'development';
const isDev = mode !== 'production';
const devtool = isDev ? 'eval-cheap-source-map' : false;

// Build up the entrypoints array here
let entryFiles = [];

glob.sync('./src/*.html').forEach((path) => {
  entryFiles.push(path);
});
glob.sync('./src/scss/theme-*.scss').forEach((path) => {
  entryFiles.push(path);
});

module.exports = {
  mode: mode,
  entry: entryFiles,
  output: {
    filename: '../[name].sync',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 3000,
      server: {
        baseDir: ['dist']
      }
    }),
    new CopyPlugin({
      patterns: [
        { from: 'src/assets', to: 'assets' },
        { from: 'src/js', to: '' },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(eot|ttf|woff|woff2|otf|png|jpg|gif|svg)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'url-loader'
          }
        ],
      },
      {
        test: /\.html$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].html',
            }
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].js',
            }
          },
          {
            loader: 'babel-loader',
            options: {
              ignore: [
                "node_modules/**/*"
              ],
              presets: [
                "@babel/preset-env"
              ],
              plugins: [
                "@babel/plugin-transform-runtime"
              ]
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          {
						loader: 'file-loader',
						options: {
							name: '[name].css',
						}
					},
					{ loader: 'extract-loader' },
          { loader: 'css-loader',
            options: {
              url: false
            }
          },
          { loader: 'postcss-loader' },
          { loader: 'sass-loader' }
        ]
      }
    ]
  }
}