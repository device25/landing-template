'use strict';

var cssnext = require('postcss-cssnext');
var gulp = require('gulp');
var postcss = require('gulp-postcss');
var watch = require('gulp-watch');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var rigger = require('gulp-rigger');
var cleanCSS = require('gulp-clean-css');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var rimraf = require('rimraf');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var path = {
  dest: {
    html: 'dist/',
    css: 'dist/css/',
    js: 'dist/js/',
    img: 'dist/img/',
    fonts: 'dist/fonts/'
  },
  src: {
    html: 'src/*.html',
    css: 'src/scss/main.scss',
    js: 'src/js/main.js',
    img: 'src/img/**/*.*',
    fonts: 'src/fonts/**/*.*'
  },
  watch: {
    html: 'src/**/*.html',
    css: 'src/scss/**/*.scss',
    js: 'src/js/**/*.js',
    img: 'src/img/**/*.*',
    fonts: 'src/fonts/**/*.*'
  },
  clean: 'dist'
};

var config = {
  server: {
    baseDir: "dist"
  },
  open: false
};
var configTunnel = {
  server: {
    baseDir: "dist"
  },
  tunnel: 'device',
  browser: 'Google Chrome',
  open: 'tunnel'
};

gulp.task('html:build', function () {
  gulp.src(path.src.html)
    .pipe(rigger())
    .pipe(gulp.dest(path.dest.html))
    .pipe(reload({ stream: true }));
});

gulp.task('js:build', function () {
  gulp.src(path.src.js)
    .pipe(rigger())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(path.dest.js))
    .pipe(reload({ stream: true }));
});

gulp.task('css:build', function () {
  var processors = [
    cssnext
  ];

  return gulp.src(path.src.css)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(processors))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(path.dest.css))
    .pipe(reload({ stream: true }));
});

gulp.task('img:build', function () {
  gulp.src(path.src.img)
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{ removeViewBox: false }],
      use: [pngquant()],
      interlaced: true
    }))
    .pipe(gulp.dest(path.dest.img))
    .pipe(reload({ stream: true }));
});

gulp.task('fonts:build', function () {
  gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.dest.fonts));
});

gulp.task('build', [
  'html:build',
  'css:build',
  'fonts:build',
  'img:build',
  'js:build'
]);

gulp.task('watch', function () {
  watch([path.watch.html], function () {
    gulp.start('html:build');
  });
  watch([path.watch.css], function () {
    gulp.start('css:build');
  });
  watch([path.watch.fonts], function () {
    gulp.start('fonts:build');
  });
  watch([path.watch.img], function () {
    gulp.start('img:build');
  });
  watch([path.watch.js], function () {
    gulp.start('js:build');
  });
});

gulp.task('webserver', function () {
  browserSync(config);
});

gulp.task('webserverTunnel', function () {
  browserSync(configTunnel);
});

gulp.task('clean', function (cb) {
  rimraf(path.clean, cb);
});

gulp.task('default', ['build', 'webserver', 'watch']);