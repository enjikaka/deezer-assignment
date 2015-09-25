var gulp = require('gulp');
var sass = require('gulp-sass');
var ap = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();

gulp.task('sass', function() {
  gulp.src('./scss/*.scss')
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(ap({
      browers: ['last 2 versions']
    }))
    .pipe(gulp.dest('./css'));
});

gulp.task('watch', ['sass'], function() {
  browserSync.init({
    server: './'
  });

  gulp.watch('./scss/*.scss', ['sass']).on('change', browserSync.reload);
  gulp.watch('./index.html').on('change', browserSync.reload);
  gulp.watch('./js/*.js').on('change', browserSync.reload);
});

gulp.task('sass:watch', function() {
  gulp.watch('./scss/*.scss', ['sass']);
});