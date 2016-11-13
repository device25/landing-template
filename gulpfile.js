'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    cleanCSS = require('gulp-clean-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload;

var path = {
  dest: {
    html: 'prod/',
    css: 'prod/css/',
    js: 'prod/js/',
    img: 'prod/img/',
    fonts: 'prod/fonts/'
  },
  src: {
    html: '_dev/*.html',
    css: '_dev/scss/main.scss',
    js: '_dev/js/main.js',
    img: '_dev/img/**/*.*',
    fonts: '_dev/fonts/**/*.*'
  },
  watch: {
    html: '_dev/**/*.html',
    css: '_dev/scss/**/*.scss',
    js: '_dev/js/**/*.js',
    img: '_dev/img/**/*.*',
    fonts: '_dev/fonts/**/*.*'
  },
  clean: 'prod'
};

var config = {
      server: {
        baseDir: "prod"
      },
      open: false
    },
    configTunnel = {
      server: {
        baseDir: "prod"
      },
      tunnel: 'device',
      browser: 'Google Chrome',
      open: 'tunnel'
    };

gulp.task('html:build', function () {
  gulp.src(path.src.html)
      .pipe(rigger())
      .pipe(gulp.dest(path.dest.html))
      .pipe(reload({stream: true}));
});

gulp.task('js:build', function () {
  gulp.src(path.src.js)
      .pipe(rigger())
      .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(path.dest.js))
      .pipe(reload({stream: true}));
});

gulp.task('css:build', function () {
  gulp.src(path.src.css)
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(prefixer())
      .pipe(cleanCSS())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(path.dest.css))
      .pipe(reload({stream: true}));
});

gulp.task('img:build', function () {
  gulp.src(path.src.img)
      .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()],
        interlaced: true
      }))
      .pipe(gulp.dest(path.dest.img))
      .pipe(reload({stream: true}));
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