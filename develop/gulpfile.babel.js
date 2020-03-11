'use strict';
//  * ===================
//  Modules
//  * ===================
// const gulp = require('gulp');
// const fs = require('fs');
// const del = require('del');
// const log = require('fancy-log');
// const plumber = require('gulp-plumber');
// const rename = require('gulp-rename');
// const watch = require('gulp-watch');
// const ejs = require('gulp-ejs');
// const sass = require('gulp-sass');
// const autoprefixer = require('gulp-autoprefixer');
// const webpack = require('webpack');
// const webpackStream = require('webpack-stream');
// const webpackConfig = require('./webpack.config.babel');
// const browserSync = require('browser-sync').create();
// const runSequence = require('run-sequence');
// const htmlmin = require('gulp-htmlmin');
// const cssmin = require('gulp-cssmin');
// const uglify = require('gulp-uglify');
import fs from 'fs';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';
import webpackConfig from './webpack.config.babel.js';
import browserSync from 'browser-sync';

const gulpPlugins = gulpLoadPlugins();

//  * ===================
//  Config
//  * ===================
// const config = {
// }

const BUILD_DIR = 'dist';
const APP_DIR = 'src';
const TEMP_DIR = '.tmp';
const PATH = {
  'img': '/**/img/',
  'scss': '/**/*.scss',
  'css': '/**/*.css',
  'script': '/**/*.js',
  'scriptDir': '/assets/js/',
  'ejs': '/**/*.ejs',
  'template': '/**/_*.ejs',
  'font': '/**/font/**/',
  'json': '/**/*.json',
  'php': '/**/*.php',
  'meta': '/_template/meta.json',
};

// //  * ===================
// //  Config
// //  * ===================
// const _config = {
//   inputFileName: {
//     js: 'import.js',
//     css: 'import.scss',
//   },
//   outputFileName: {
//     css: 'style.css',
//     js: 'common.js',
//   },
//   path: {
//     src: {
//       ejs: './src/ejs',
//       css: './src/scss',
//       js: './src/js',
//     },
//     public: './public',
//     dist: './dist',
//   },
//   browserSync: {
//     open: false,
//     server: './public',
//     port: 8080,
//     ghostMode: false,
//     notify: false,
//   },
//   autoprefixer: {
//     browsers: ['last 2 versions'],
//     cascade: false
//   },
//   minify: {
//     html: true,
//     js: true,
//     css: true,
//   }
// };

//  * ===================
//  Tasks
//  * ===================
//  ** ------------------
//  html
//  ** ------------------
// /* generate html files */
function html() {
  let json = JSON.parse(fs.readFileSync(APP_DIR + PATH.meta));

  return gulp.src([
    APP_DIR + PATH.ejs,
    '!' + APP_DIR + PATH.template,
  ])
  .pipe(gulpPlugins.ejs({json}, {}, {ext: '.html'}))
  // .pipe(gulpPlugins.ejs().on('error', log))
  .pipe(gulp.dest(TEMP_DIR))
  .pipe(gulp.dest(BUILD_DIR))
  .pipe(browserSync.stream())
}

// gulp.task('html', () => {
//   const configFile = `${_config.path.src.ejs}/_config.json`;

//   fs.access(configFile, fs.R_OK | fs.W_OK, function (err) {
//     const config = (err) ? {} : JSON.parse(fs.readFileSync(configFile, 'utf8'));

//     return gulp.src(
//       [
//         `${_config.path.src.ejs}/**/*.ejs`,
//         `!${_config.path.src.ejs}/**/_*.ejs`,
//       ]
//     )
//     .pipe(plumber({
//       errorHandler: function (_err) {
//         log.error(_err);
//         this.emit('end');
//       }
//     }))
//     .pipe(ejs({
//       config: config,
//     }, {}, {
//       ext: '.html'
//     }))
//     .pipe(gulp.dest(`${_config.path.public}`));
//   });
// });

// /* reload */
// gulp.task('html-reload', ['html'], (done) => {
//   browserSync.reload();
//   done();
// });

// //  ** ------------------
// //  javascript
// //  ** ------------------

// /* generate javascript files */
// gulp.task('js', () => {
//   return gulp.src(`${_config.path.src.js}/${_config.inputFileName.js}`)
//     .pipe(plumber())
//     .pipe(webpackStream(webpackConfig, webpack))
//     .pipe(rename(_config.outputFileName.js))
//     .pipe(gulp.dest(`${_config.path.public}/assets/js`));
// });

// /* reload */
// gulp.task('js-reload', ['js'], (done) => {
//   browserSync.reload();
//   done();
// });

// //  ** ------------------
// //  css
// //  ** ------------------

// /* generate css files */
// gulp.task('css', () => {
//   return gulp
//     .src(`${_config.path.src.css}/${_config.inputFileName.css}`)
//     .pipe(plumber())
//     .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
//     .pipe(autoprefixer(_config.autoprefixer))
//     .pipe(rename(_config.outputFileName.css))
//     .pipe(gulp.dest(`${_config.path.public}/assets/css`))
//     .pipe(browserSync.stream());
// });


// //  ** ------------------
// //  Serve
// //  ** ------------------
// gulp.task('serve', () => {
//   browserSync.init(_config.browserSync);
//   watch([`${_config.path.src.ejs}/**/*.ejs`], () => {
//     return gulp.start(['html-reload']);
//   });
//   watch([`${_config.path.src.ejs}/_config.json`], () => {
//     return gulp.start(['html-reload']);
//   });
//   watch([`${_config.path.src.js}/**/*.js`], () => {
//     return gulp.start(['js-reload']);
//   });
//   watch([`${_config.path.src.css}/**/*.scss`], () => {
//     return gulp.start(['css']);
//   });
// });


//  ** ------------------
//  default
//  ** ------------------

gulp.task('default', gulp.series(html));
// // gulp.task('default', ['html', 'js', 'css', 'serve']);
// // gulp.task('default', gulp.series(gulp.parallel(scripts, styles, html), gulp.series(browsersync, watchFiles)));

// gulp.task('default', gulp.series(clean, gulp.parallel(html, js, css), serve));
// // gulp.task('default', gulp.series(clean, gulp.parallel(script, copy, ejs, imagemin, webp,style)));
// //  ** ------------------
// //  clean
// //  ** ------------------
// gulp.task('clean', () => {
//   return del([
//     `${_config.path.public}/**/*.ejs`,
//     _config.path.dist
//   ]);
// });

// //  ** ------------------
// //  copy
// //  ** ------------------
// gulp.task('copy', () => {
//   return gulp
//     .src(`${_config.path.public}/**`, {
//       base: _config.path.public
//     })
//     .pipe(gulp.dest(_config.path.dist));
// });

// //  ** ------------------
// //  minify
// //  ** ------------------
// /* html */
// gulp.task('minifyHtml', () => {
//   if (_config.minify.html) {
//     return gulp
//       .src(`${_config.path.dist}/**/*.html`)
//       .pipe(htmlmin({
//         collapseWhitespace: true
//       }))
//       .pipe(gulp.dest(_config.path.dist));
//   }
// });

// /* js */
// gulp.task('minifyJs', () => {
//   if (_config.minify.js) {
//     return gulp
//       .src(`${_config.path.dist}/**/*.js`)
//       .pipe(uglify({
//         preserveComments: 'some'
//       }))
//       .pipe(gulp.dest(_config.path.dist));
//   }
// });

// /* css */
// gulp.task('minifyCss', () => {
//   if (_config.minify.css) {
//     return gulp
//       .src(`${_config.path.dist}/**/*.css`)
//       .pipe(cssmin())
//       .pipe(gulp.dest(_config.path.dist));
//   }
// });

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
