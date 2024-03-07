const gulp = require('gulp'); 
const fileInclude = require('gulp-file-include');
const sass = require('gulp-sass')(require('sass'));
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


gulp.task('clean', function(done) {
    if (fs.existsSync('./dist/')) {
        return gulp.src('./dist/', {read: false}) // much faster
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

gulp.task('html', function () {
    return gulp.src('./src/*.html')
        .pipe(plumber(plumberNotify('HTML Error')))
        .pipe(fileInclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('./dist'));
})

gulp.task('sass', function() {
    return gulp.src('./src/scss/*.scss')
    .pipe(plumber(plumberNotify('SASS Error')))
    .pipe(sourseMaps.init())
    .pipe(sass())
    .pipe(groupMedia())
    .pipe(sourseMaps.write())
    .pipe(gulp.dest('./dist/css/'))
})

gulp.task('images', function () {
    return gulp.src('./src/img/**/*') // All files
    .pipe(changed('./dist/img/'))
    .pipe(imagemin({ verbose: true }))
    .pipe(gulp.dest('./dist/img/'))
})

gulp.task('fonts', function () {
    return gulp.src('./src/fonts/**/*') // All files
    .pipe(gulp.dest('./dist/fonts/'))
})

gulp.task('files', function () {
    return gulp.src('./src/files/**/*') // All files
    .pipe(gulp.dest('./dist/files/'))
})

gulp.task('js', function() {
    return gulp.src('./src/js/*.js')
    .pipe(plumber(plumberNotify('JS Error')))
    .pipe(babel())
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('./dist/js'));
})



gulp.task('server', function() {
    return gulp.src('./dist/')
    .pipe(server({
        livereload: true,
        // directoryListing: true,
        open: true
    }))
})

gulp.task('watch', function() {
    gulp.watch('./src/scss/**/*.scss', gulp.parallel('sass'));
    gulp.watch('./src/**/*.html', gulp.parallel('html'));
    gulp.watch('./src/img/**/*', gulp.parallel('images'))
    gulp.watch('./src/fonts/**/*', gulp.parallel('fonts'))
    gulp.watch('./src/files/**/*', gulp.parallel('files'))
    gulp.watch('./src/js/**/*.js', gulp.parallel('js'))
})

gulp.task('default', gulp.series(
    'clean', 
    gulp.parallel('html', 'sass', 'images', 'fonts', 'files', 'js'),
    gulp.parallel('server', 'watch')
))