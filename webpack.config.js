var path = require('path');

module.exports = {

	context: path.join(__dirname, 'source'),

	entry: [
		'./index.js',
		'./google-analytics.js'
	],

	output: {
		path: './public',
		filename: 'bundle.js'
	},

	devtool: process.env.LOCAL ? 'eval-source-map' : null

};