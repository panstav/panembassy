var gulp =    require('gulp');
var plugins = require('gulp-load-plugins')();

var shortid = require('shortid');

//-=======================================================---
//------------------ Setup
//-=======================================================---

var revision = shortid.generate();

var jsSources = [
	'source/myapp.js',
	'source/index.js'
];

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
		.pipe(gulp.dest('public/stylesheets'));

});

gulp.task('compileJade', function(){

	var jadeOptions = { pretty: !!process.env.LOCAL };

	var resources = {
		css:  'stylesheets/styles' + (process.env.LOCAL ? '' : '-' + revision) + '.css',
		js:   'scripts/scripts' + (process.env.LOCAL ? '' : '-' + revision) + '.js'
	};

	return gulp.src('source/index.jade')
		.pipe(plugins.jade(jadeOptions))
		.pipe(plugins.htmlReplace(resources))
		.pipe(gulp.dest('public/partials'));

});

gulp.task('uglifyJs', function(){

	var uglifier = !process.env.LOCAL ? plugins.uglify : plugins.util.noop;

	return gulp.src(jsSources)
		.pipe(plugins.concat('scripts' + (process.env.LOCAL ? '' : '-' + revision) + '.js'))
		.pipe(uglifier())
		.pipe(gulp.dest('public/scripts'));

});

//-=======================================================---
//------------------ Build Commands
//-=======================================================---

gulp.task('build', ['uglifyJs', 'compileSass', 'compileJade']);

gulp.task('local', ['defineLocal', 'build']);

gulp.task('heroku', ['build']);