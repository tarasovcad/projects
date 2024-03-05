const gulp = require('gulp'); 
const fileInclude = require('gulp-file-include');
const sass = require('gulp-sass')(require('sass'));
const server = require('gulp-server-livereload');
const clean = require('gulp-clean');
const fs = require('fs');
const sourseMaps = require('gulp-sourcemaps')
const groupMedia = require('gulp-group-css-media-queries')



gulp.task('clean', function(done) {
    if (fs.existsSync('./dist/')) {
        return gulp.src('./dist/', {read: false}) // much faster
        .pipe(clean({force: true})) //  with force option it will delete everything!

    }
    done();
})


gulp.task('html', function () {
    return gulp.src('./src/*.html')
        .pipe(fileInclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('./dist'));
})

gulp.task('sass', function() {
    return gulp.src('./src/scss/*.scss')
    .pipe(sourseMaps.init())
    .pipe(sass())
    .pipe(groupMedia())
    .pipe(sourseMaps.write())
    .pipe(gulp.dest('./dist/css/'))
})

gulp.task('images', function () {
    return gulp.src('./src/img/**/*') // All files
    .pipe(gulp.dest('./dist/img/'))
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
})

gulp.task('default', gulp.series(
    'clean', 
    gulp.parallel('html', 'sass', 'images'),
    gulp.parallel('server', 'watch')
))