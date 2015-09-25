var gulp = require('gulp'),
    watch = require('gulp-watch'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    livereload = require('gulp-livereload');

gulp.task('SYST', function(){

    var path = './js/SYST/',
        systjs = path + 'SYST.js';

    gulp.src(systjs)
        .pipe(watch(systjs))
        .pipe(rename("SYST.min.js"))
        .pipe(uglify({ preserveComments: '!' }))
        .pipe(gulp.dest(path))
        .pipe(livereload());

});

gulp.task('watch', function(){
    livereload.listen();
    //gulp.watch('THJS-PLUGINS');
    //gulp.watch('SYST');

});

gulp.task('default', ['SYST', 'watch']);