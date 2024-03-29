const gulp = require('gulp'); 


//HTML
const fileInclude = require('gulp-file-include');
const htmlclean = require('gulp-htmlclean')

// SASS
const sass = require('gulp-sass')(require('sass'))
const sassGlob = require('gulp-sass-glob');
const autoprefixer = require ('gulp-autoprefixer')
const csso = require('gulp-csso');


const server = require('gulp-server-livereload');
const clean = require('gulp-clean');
const fs = require('fs');
const sourseMaps = require('gulp-sourcemaps')
const groupMedia = require('gulp-group-css-media-queries') 
const plumber = require('gulp-plumber')
const notify = require('gulp-notify')


const webpack = require('webpack-stream')
const babel = require('gulp-babel')

const imagemin = require('gulp-imagemin')


const changed = require('gulp-changed')


gulp.task('clean::docs', function(done) {
    if (fs.existsSync('./docs/')) {
        return gulp.src('./docs/', {read: false}) // much faster
        .pipe(clean({force: true})) //  with force option it will delete everything!

    }
    done();
})
const plumberNotify = (title) => {
    return {
        errorHandler: notify.onError({
            title: title,
            messages: 'Error <%= error.message %>',
            sound: false
        }),
    };
}

gulp.task('html::docs', function () {
    return gulp
        .src(['./src/html/**/*.html', '!./src/html/blocks/*.html']) // Dont compile blocks to html
        .pipe(changed('./docs/'))
        .pipe(plumber(plumberNotify('HTML Error')))
        .pipe(fileInclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(htmlclean())
        .pipe(gulp.dest('./docs/'));
})

gulp.task('sass::docs', function() {
    return gulp.src('./src/scss/*.scss')
    .pipe(changed('./docs/css/'))
    .pipe(plumber(plumberNotify('SCSS Error')))
    .pipe(sourseMaps.init())
    .pipe(autoprefixer())
    .pipe(sassGlob())
    .pipe(groupMedia())
    .pipe(sass())
    .pipe(csso())
    .pipe(sourseMaps.write())
    .pipe(gulp.dest('./docs/css/'))
})

gulp.task('images::docs', function () {
    return gulp.src('./src/img/**/*') // All files
    .pipe(changed('./docs/img/'))
    .pipe(imagemin({ verbose: true }))
    .pipe(gulp.dest('./docs/img/'))
})

gulp.task('fonts::docs', function () {
    return gulp.src('./src/fonts/**/*') // All files
    .pipe(changed('./docs/fonts/'))
    .pipe(gulp.dest('./docs/fonts/'))
})

gulp.task('files::docs', function () {
    return gulp.src('./src/files/**/*') // All files
    .pipe(changed('./docs/files/'))
    .pipe(gulp.dest('./docs/files/'))
})

gulp.task('js::docs', function() {
    return gulp.src('./src/js/*.js')
    .pipe(changed('./docs/js/'))
    .pipe(plumber(plumberNotify('JS Error')))
    .pipe(babel())
    .pipe(webpack(require('./../webpack.config.js')))
    .pipe(gulp.dest('./docs/js'));
})



gulp.task('server::docs', function() {
    return gulp.src('./docs/')
    .pipe(server({
        livereload: true,
        // directoryListing: true,
        open: true
    }))
})


