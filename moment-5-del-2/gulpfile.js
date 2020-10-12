// Import plugins
const gulp = require('gulp');
const { src, series, parallel, dest, watch } = require('gulp');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const browsersync = require('browser-sync');
const sass = require('gulp-sass');

// Creates paths 
const htmlPath = 'cli/*.html';
const jsPath = 'cli/js/*.js';
const sassPath = 'cli/sass/*.scss';


// Copy all html-files to publish folder
function htmlTask() {
    return src(htmlPath)
     .pipe(gulp.dest('pub'));
}

// Concatinate ans minify all js-files
function jsTask() {
    return src(jsPath)
     .pipe(sourcemaps.init())
     .pipe(concat('main.js'))
     .pipe(terser())
     .pipe(sourcemaps.write('.'))
     .pipe(dest('pub/js'));
}

// Concatinate and minify all sass-files
function sassTask() {
    return src(sassPath)
     .pipe(sourcemaps.init())
     .pipe(sass())
     .pipe(postcss([autoprefixer(), cssnano()]))
     .pipe(sourcemaps.write('.'))
     .pipe(gulp.dest('pub/css'));
}

// Uptade when changes
function watchTask() {
    browsersync.init({
        injectChanges: false,
        server: {
            baseDir: './pub/'
        }
    })
    gulp.watch(htmlPath, htmlTask).on('change', browsersync.reload);
    gulp.watch(jsPath, jsTask).on('change', browsersync.reload);
    gulp.watch(sassPath, sassTask).on('change', browsersync.reload);
   
}

// Build public folder 
function buildTask(cb) {
    htmlTask();
    jsTask();
    sassTask();  
    console.log('Publish folder is built...');
    cb();
}

// Export tasks
exports.htmlTask = htmlTask;
exports.jsTask = jsTask;
exports.watchTask = watchTask;
exports.sassTask = sassTask;
exports.buildTask = buildTask;
// Build public folder
exports.buildTask = buildTask;

// Run all tasks and then start watchTask
exports.default = series(parallel(htmlTask, jsTask, sassTask), watchTask);
