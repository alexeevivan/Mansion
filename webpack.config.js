const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const pagesConfig = require('./webpack.pages.js');

module.exports = (env, argv) => {
	const isProduction = argv.mode === 'production';

	// Генерация HtmlWebpackPlugin для каждой страницы из webpack.pages.js
	const generateHtmlPlugins = () => {
		return Object.entries(pagesConfig).map(([filename, config]) => {
			return new HtmlWebpackPlugin({
				filename: `./${filename}`,
				template: `./src/html/${filename}`,
				chunks: config.chunks,
				minify: isProduction
					? {
						collapseWhitespace: true,
						removeComments: true,
						removeRedundantAttributes: true,
						useShortDoctype: true,
						removeEmptyAttributes: true,
						removeStyleLinkTypeAttributes: true,
						keepClosingSlash: true,
						minifyJS: true,
						minifyCSS: true,
					}
					: false,
			});
		});
	};

	return {
		mode: isProduction ? 'production' : 'development',
		devtool: isProduction ? false : 'source-map',

		optimization: {
			minimize: isProduction,
			minimizer: isProduction ? ['...', new CssMinimizerPlugin()] : [],
		},

		entry: {
			main: './src/js/index.js',
			garden: './src/js/garden.js',
			system: './src/js/system.js',
			concept: './src/js/concept.js',
			restaurant: './src/js/restaurant.js'
		},

		output: {
			filename: 'js/[name].js',
			path: path.resolve(__dirname, 'dist'),
			clean: true,
		},

		devServer: {
			static: './dist',
			port: 3000,
			open: true,
			hot: true,
		},

		module: {
			rules: [
				// JSON
				{
					test: /\.canvas$/i,
					type: 'json',
				},
				// SCSS
				{
					test: /\.scss$/i,
					use: [
						isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
						'css-loader',
						{
							loader: 'sass-loader',
							options: {
								sassOptions: {
									quietDeps: true,
									silenceDeprecations: ['legacy-js-api', 'import', 'global-builtin', 'color-functions'],
								},
							},
						},
					],
				},
				// HTML (сначала posthtml разворачивает include, потом html-loader делает JS-модуль)
				{
					test: /\.html$/i,
					use: [
						'html-loader',
						{
							loader: 'posthtml-loader',
							options: {
								plugins: [
									require('posthtml-include')({
										root: path.resolve(__dirname, 'src/html'),
									}),
								],
							},
						},
					],
				},
				// Шрифты
				{
					test: /\.(woff|woff2|eot|ttf|otf)$/i,
					type: 'asset/resource',
					generator: {
						filename: 'assets/fonts/[name][ext]',
					},
				},
				// SVG и изображения
				{
					test: /\.(svg|png|jpe?g|gif|webp)$/i,
					type: 'asset/resource',
					generator: {
						filename: 'assets/[path][name][ext]',
					},
				},
			],
		},

		plugins: [
			new MiniCssExtractPlugin({
				filename: 'css/[name].css',
			}),

			// Автоматическая генерация всех страниц из webpack.pages.js
			...generateHtmlPlugins(),
		],
	};
};