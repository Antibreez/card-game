/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
`use strict`;

let gulp = require(`gulp`);
let del = require(`del`);
let plumber = require(`gulp-plumber`);
let sourcemap = require(`gulp-sourcemaps`);
let concat = require(`gulp-concat`);
let rename = require(`gulp-rename`);
let newer = require(`gulp-newer`);
let imagemin = require(`gulp-imagemin`);
let svgstore = require(`gulp-svgstore`);
let webp = require(`gulp-webp`);
let posthtml = require(`gulp-posthtml`);
let include = require(`posthtml-include`);
let sass = require(`gulp-sass`);
let postcss = require(`gulp-postcss`);
let autoprefixer = require(`autoprefixer`);
let csso = require(`gulp-csso`);
let rollup = require(`gulp-better-rollup`);
let uglify = require(`gulp-terser`);
//let babel = require(`gulp-babel`);
let server = require(`browser-sync`).create();
let fs = require(`fs`);

let browserify = require(`browserify`);
let source = require(`vinyl-source-stream`);
let buffer = require(`vinyl-buffer`);
//var babelify = require('babelify');

gulp.task(`clean`, function () {
  return del(`build`);
});

gulp.task(`copy`, function () {
  return gulp.src([
    `source/fonts/**`,
    `source/assets/**/*`
  ], {
    base: `source`
  })
    .pipe(gulp.dest(`build`));
});

// СТИЛИ
gulp.task(`css`, function () {
  return gulp.src(`source/scss/style.scss`)
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass({
      outputStyle: `expanded`
    }))
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest(`build/css`))
    .pipe(csso())
    .pipe(rename(`style.min.css`))
    .pipe(sourcemap.write(`.`))
    .pipe(gulp.dest(`build/css`))
    .pipe(server.stream());
});

// ИЗОБРАЖЕНИЯ
gulp.task(`sprite`, function () {
  return gulp.src(`source/img/*.svg`)
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename(`sprite.svg`))
    .pipe(gulp.dest(`build/img`));
});

gulp.task(`webp`, function () {
  return gulp.src(`build/img/*.{png,jpg,gif}`)
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest(`build/img`));
});

gulp.task(`images`, function () {
  return gulp.src(`source/img/**/*.{png,jpg,svg,gif}`)
    .pipe(newer(`build/img`))
    .pipe(gulp.dest(`build/img`));
});

gulp.task(`imagemin`, function () {
  return gulp.src(`build/img/**/*.{png,jpg,svg}`)
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.mozjpeg({progressive: true}),
      imagemin.svgo({
        plugins: [{
          removeViewBox: false,
          removeUselessStrokeAndFill: false
        }]
      })
    ]))
    .pipe(gulp.dest(`build/img`));
});

// СКРИПТЫ
gulp.task(`js-vendor`, function () {
  return gulp.src([
    `source/js/vendor/*.js`,
  ])
    .pipe(plumber())
    .pipe(concat(`vendor.js`))
    .pipe(gulp.dest(`build/js`))
    .pipe(uglify())
    .pipe(rename({
      suffix: `.min`
    }))
    .pipe(gulp.dest(`build/js`));
});

gulp.task(`js`, function () {
  var b = browserify({
    entries: 'source/js/main.js',
    debug: true,
  });

  return b
  .transform("babelify", {presets: ["@babel/preset-env"]})
  .bundle()
  .pipe(source('main.js'))
  .pipe(buffer())
  .pipe(sourcemap.init({loadMaps: true}))
  //.pipe(uglify())
  .pipe(sourcemap.write('./'))
  .pipe(gulp.dest(`build/js`));
});

// HTML
gulp.task(`html`, function () {
  return gulp.src(`source/*.html`)
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest(`build`));
});

//Получение списка файлов
// const getFiles = function () {
//   const files = fs.readdirSync(`./source/img`);
//   const code = `
//     IMAGES_NAMES = ${JSON.stringify(files)}
//   `;
//   return fs.writeFile(`./build/js/modules/file.js`, code);
// };

// СТРИМ
gulp.task(`server`, function () {
  server.init({
    server: `build/`,
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch(`source/scss/**/*.scss`, gulp.series(`css`));
  gulp.watch(`source/img/**/*`, gulp.series(`images`, `sprite`, `webp`, `refresh`));
  gulp.watch(`source/js/**/*.js`, gulp.series(`js`, `js-vendor`, `refresh`));
  gulp.watch(`source/*.html`).on(`change`, gulp.series(`html`, `refresh`));
});

gulp.task(`refresh`, function (done) {
  server.reload();
  done();
});

// СБОРКА И СТАРТ
gulp.task(`build`, gulp.series(`clean`, `copy`, `images`, `webp`, `imagemin`, `sprite`, `css`, `js-vendor`, `js`, `html`));
gulp.task(`start`, gulp.series(`build`, `server`));
