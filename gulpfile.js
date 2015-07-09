var config =          require('./config');

var gulp =            require('gulp');
var plugins =         require('gulp-load-plugins')();
var runSeq =          require('run-sequence');

var webpack =         require('webpack');
var webpackOptions =  require("./webpack.config");

var shortid =         require('shortid');

//-=======================================================---
//------------------ Setup
//-=======================================================---

var revision = shortid.generate();

//-=======================================================---
//------------------ Executables
//-=======================================================---

gulp.task('nodemon', ['local'], function(){
	return plugins.nodemon(
		{
			script: 'index.js',
			ignore: ['node_modules/**']
		});
});

//-=======================================================---
//------------------ Building Blocks
//-=======================================================---

gulp.task('defineLocal', function(){
	process.env.LOCAL = true;
});

gulp.task('compileSass', function(){

	var sassOptions = process.env.LOCAL ?
	                  { errLogToConsole: true, sourceComments : 'normal' } :
	                  { outputStyle: 'compressed' };

	return gulp.src('source/global.sass')
		.pipe(plugins.sass(sassOptions))
		.pipe(plugins.rename({ basename: 'styles' + (process.env.LOCAL ? '' : ('-' + revision)) }))
		.pipe(gulp.dest('public'));

});

gulp.task('compileJade', function(){

	var jadeOptions = { pretty: !!process.env.LOCAL };

	var resources = {
		css: 'styles' + (process.env.LOCAL ? '' : '-' + revision) + '.css',
		js: 'bundle' + (process.env.LOCAL ? '' : '-' + revision) + '.js'
	};

	return gulp.src(['source/*/index.jade', '!source/about/index.jade'])
		.pipe(plugins.rename(function(path){ path.basename = path.dirname === 'front-page' ? 'index' : path.dirname; }))
		.pipe(plugins.jade(jadeOptions))
		.pipe(plugins.rename(function(path){ path.dirname = '.' }))
		.pipe(plugins.htmlReplace(resources))
		.pipe(gulp.dest('public'));
});

gulp.task('uglifyJs', function(){

	var uglifier = !process.env.LOCAL ? plugins.uglify : plugins.util.noop;

	return gulp.src('public/bundle.js')
		.pipe(plugins.rename({ basename: 'bundle' + (process.env.LOCAL ? '' : ('-' + revision)) }))
		.pipe(uglifier())
		.pipe(gulp.dest('public'));

});

gulp.task("webpackJs", function(done) {

	webpack(webpackOptions, function(err, stats){
		if(err) throw new plugins.util.PluginError("webpack", err);

		done();
	});

});

gulp.task('sitemap', function(){

	var sitemapOptions = {
		siteUrl: config.domain,
		mappings: [
			{
				pages: [ '/' ],
				changefreq: 'weekly',
				priority: 1,
				lastmod: Date.now()
			}
		]
	};

	return gulp.src(['public/**/*.html', '!public/components/**'])
		.pipe(plugins.sitemap(sitemapOptions))
		.pipe(gulp.dest('./public'))

});

//-=======================================================---
//------------------ Build Commands
//-=======================================================---

gulp.task('build', function(done){
	runSeq('webpackJs', 'uglifyJs', 'compileSass', 'compileJade', done);
});

gulp.task('local', function(){
	runSeq('defineLocal', 'build');
});

gulp.task('heroku:production', function(){
	runSeq('build', 'sitemap');
});