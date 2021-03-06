const path = require('path');
const webpack = require('webpack');
const VAR = require('./config/variables');

module.exports = {
	entry: {
		app: './app/app.js',
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, './dist'),
	},
	node: {
		fs: 'empty',
		net: 'empty',
		tls: 'empty',
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader',
				options: {
					presets: ['@babel/preset-env', '@babel/preset-react'],
					plugins: ['@babel/transform-runtime'],
				}
			},
			{
				test: /\.html$/,
				use: [
					'html-loader',
				],
			},
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader'
				],
			},
			{
				test: /\.(sass|scss)$/,
				use: [
					'style-loader',
					'css-loader',
					'sass-loader'
				],
			},
			{
				test: /\.(eot|svg|gif|png|jpg|ttf|woff(2)?)(\?v=\d+\.\d+\.\d+)?/,
				use: [
					'url-loader'
				],
			},
		],
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(VAR.NODE_ENV),
			'process.env.KEYSTROKE_DNA_APP_ID': JSON.stringify(VAR.KEYSTROKE_DNA_APP_ID),
			'process.env.LOCAL_STORAGE_KEY': JSON.stringify(VAR.LOCAL_STORAGE_KEY),
		})
	]
};
