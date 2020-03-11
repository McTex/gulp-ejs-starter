'use strict';
//  * ===================
//  Modules
//  * ===================
import fs from 'fs';
import del from 'del';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import pngquant from 'imagemin-pngquant';
import mozjpeg from 'imagemin-mozjpeg';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';
import webpackConfig from './webpack.config.babel.js';
import browserSync from 'browser-sync';

const gulpPlugins = gulpLoadPlugins();

//  * ===================
//  Config
//  * ===================
const config = {
  directory: {
    build: 'dist',
    src: 'src',
    temp: '.tmp'
  },
  path: {
    img: '/**/img/',
    scss: '/**/*.scss',
    css: '/**/*.css',
    script: '/**/*.js',
    scriptDir: '/assets/js/',
    ejs: '/**/*.ejs',
    template: '/**/_*.ejs',
    font: '/**/font/**/',
    json: '/**/*.json',
    meta: '/_template/meta.json',
  }
}

//  * ===================
//  Tasks
//  * ===================
//  ** ------------------
//  html
//  ** ------------------
function html() {
  let json = JSON.parse(fs.readFileSync(config.directory.src + config.path.meta));

  return gulp.src([
    config.directory.src + config.path.ejs,
    '!' + config.directory.src + config.path.template,
  ])
  .pipe(gulpPlugins.ejs({json}))
  .pipe(gulpPlugins.rename({ extname: '.html' }))
  // .pipe(gulpPlugins.ejs().on('error', log))
  .pipe(gulp.dest(config.directory.temp))
  .pipe(gulp.dest(config.directory.build))
  .pipe(browserSync.stream())
  .pipe(gulpPlugins.size({
    title: 'html'
  }))
}

//  ** ------------------
//  javascript
//  ** ------------------
function script() {
  return webpackStream(webpackConfig, webpack)
  .pipe(gulp.dest(config.directory.temp + config.path.scriptDir))
  .pipe(gulp.dest(config.directory.build + config.path.scriptDir))
  .pipe(browserSync.stream())
  .pipe(gulpPlugins.size({
    title: 'script'
  }))
}

//  ** ------------------
//  css
//  ** ------------------
function style() {
  return gulp.src([
    config.directory.src + config.path.scss,
    config.directory.src + config.path.css,
  ])
  .pipe(gulpPlugins.newer(config.directory.temp + config.path.css))
  .pipe(gulpPlugins.sass({
    precision: 10
  })).on("error", gulpPlugins.sass.logError)
  .pipe(gulpPlugins.autoprefixer({ grid: true }))
  // .pipe(gulpPlugins.if('*.css', gcmq({log: true})))
  .pipe(gulpPlugins.if('*.css', gulpPlugins.cleanCss({
    compatibility: 'ie8',
  })))
  .pipe(gulp.dest(config.directory.temp))
  .pipe(gulp.dest(config.directory.build))
  .pipe(browserSync.stream())
  .pipe(gulpPlugins.size({
    title: 'style'
  }))
}

//  ** ------------------
//  imagemin
//  ** ------------------
function imagemin() {
  return gulp.src(config.directory.src + config.path.img + '**/*.{png,jpg}')
  .pipe(gulpPlugins.changed(config.directory.temp + config.path.img))
  .pipe(gulpPlugins.imagemin([
    pngquant({
      quality: [0.7, 0.85],
      speed: 1,
    }),
    mozjpeg({
      quality: 75,
      progressive: true,
    })
  ]))
  .pipe(gulp.dest(config.directory.temp))
  .pipe(gulp.dest(config.directory.build))
  .pipe(gulpPlugins.size({
    title: 'imagemin'
  }))
}

//  ** ------------------
//  clean
//  ** ------------------
function clean() {
  return del([config.directory.temp, config.directory.build + '/*', '!' + config.directory.build + '/.git'], {dot: true});
}

//  ** ------------------
//  clearCache
//  ** ------------------
function clearCache() {
  return gulpPlugins.cache.clearAll();
}

//  ** ------------------
//  copy
//  ** ------------------
function copy() {
  return gulp.src([
    config.directory.src + '/**/**',
    '!' + config.directory.src + config.path.ejs,
    '!' + config.directory.src + config.path.scss,
    '!' + config.directory.src + config.path.script,
    '!' + config.directory.src + config.path.img + '**/*.{png,jpg}',
    '!' + config.directory.src + '/**/_**/',
    '!' + config.directory.src + '/**/_**/**',
  ], {
    dot: true,
  })
  .pipe(gulp.dest(config.directory.build))
  .pipe(gulpPlugins.size({
    title: 'copy'
  }))
}

//  ** ------------------
//  Serve
//  ** ------------------
gulp.task('serve', gulp.series(gulp.parallel(style, script, html), (callback) => {
  browserSync.init({
    notify: false,
    logPrefix: 'SITE',
    server: [config.directory.temp, config.directory.src],
  });

  gulp.watch(config.directory.src + config.path.scss).on('change', style);
  gulp.watch(config.directory.src + config.path.script).on('change', script);
  gulp.watch(config.directory.src + config.path.template).on('change', html);
  gulp.watch(config.directory.src + config.path.ejs).on('change', html);
}));

//  ** ------------------
//  default
//  ** ------------------
gulp.task('default', gulp.series(clean, gulp.parallel(script, copy, html, imagemin, style)));

// //  ** ------------------
// //  buildf
// //  ** ------------------
// gulp.task('build', () => {
//   runSequence(
//     'clean',
//     'copy',
//     'minifyHtml',
//     'minifyJs',
//     'minifyCss'
//   );
// });
