const gulp = require('gulp'); 

const fileInclude = require('gulp-file-include');

gulp.task('includeFiles', function () {
    return gulp.src('./src/*.html')
        .pipe(fileInclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('./dist'));
})