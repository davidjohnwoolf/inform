var gulp = require('gulp');
var util = require('gulp-util');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');

gulp.task('default', function() {
  var bundler = watchify(browserify({
    entries: ['./public/js/src/main.js'],
    extentions: ['.js'],
    debug: true,
    cache: {},
    packageCache: {},
    fullPaths: true
  }));

  function build(file) {
    if (file) util.log('Recompiling ' + file);
    return bundler
      .bundle()
      .on('error', util.log.bind(util, 'Error'))
      .pipe(source('main.js'))
      .pipe(gulp.dest('./public/js'));
  }

  build()
  bundler.on('update', build)
});
