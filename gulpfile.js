'use strict';

var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var eslint = require('gulp-eslint');
var babel = require('gulp-babel');
var del = require('del');
var runSequence = require('run-sequence');
var concat = require('gulp-concat');
var notify = require('gulp-notify');
var notifier = require('node-notifier');
var plumber = require('gulp-plumber');

gulp.task('compile', ['js']);

gulp.task('compile:js', function() {
  return gulp.src([
    './src/jquery-match-heights.js'
  ], { base: './' })
    .pipe(sourcemaps.init())
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(rename(function (path) {
      path.dirname = '';
      return path;
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('lint', ['lint:js']);

gulp.task('lint:js', function () {
  return gulp.src([
    './src/jquery-match-heights.js'
  ])
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('js', function() {
  return gulp.src('./src/jquery-match-heights.js')
    .pipe(sourcemaps.init())
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(babel({
        presets: ['env']
    }))
    .pipe(concat('jquery-match-heights.min.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('clean', ['clean:js']);

gulp.task('clean:js', function () {
  return del([
    './dist/*'
  ], {force: true});
});

gulp.task('watch', function() {
  gulp.watch([
    './src/jquery-match-heights.js'
  ], ['lint:js', 'js']).on('change', function() {
    notifier.notify({
      title: 'Watch',
      message: 'running tasks...'
    });
  });
});

gulp.task('default', function(callback) {
  runSequence(
    'clean',
    'compile',
    'lint',
    function() {
      notifier.notify({ title: 'Build', message: 'Done' });
      callback();
    }
  );
});
