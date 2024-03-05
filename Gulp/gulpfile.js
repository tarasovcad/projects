const gulp = require('gulp'); 


gulp.task('hello', function(done) {
    console.log('hello from gulp');
    done()
});

gulp.task('default', gulp.series('hello'));