// gulpfile.js
const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const gulpSass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const htmlmin = require('gulp-htmlmin');
const rename = require('gulp-rename');
const sassCompiler = require('sass');

const sass = gulpSass(sassCompiler);

// Путь к исходным файлам
const paths = {
  html: 'src/*.html',
  css: 'src/sass/**/*.scss',
  images: 'src/images/*',         // Путь к изображениям
  icons: 'src/icons/*',           // Путь к иконкам
  dest: {
    html: 'dist/',
    css: 'dist/css/',
    images: 'dist/images/',
    icons: 'dist/icons/'          // Путь для сохранения иконок
  }
};

// Задача для минификации HTML
function minifyHtml() {
  return gulp.src(paths.html)
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true,
      minifyCSS: true,
      minifyJS: true
    }))
    .pipe(gulp.dest(paths.dest.html));
}

// Задача для компиляции и минификации SCSS
function styles() {
  return gulp.src(paths.css)
    .pipe(sass().on('error', sass.logError)) // Используйте sass() без параметров
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.dest.css))
    .pipe(browserSync.stream()); // Обновление браузера
}

// Задача для запуска сервера и отслеживания изменений
function serve() {
  browserSync.init({
    server: {
      baseDir: 'dist/'
    }
  });

  gulp.watch(paths.html, minifyHtml); // Обработка HTML
  gulp.watch(paths.css, styles);       // Обработка CSS
}

// Задача по умолчанию
const defaultTask = gulp.series(minifyHtml, styles, serve);
exports.default = defaultTask;
