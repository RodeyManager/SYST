var gulp = require('gulp'),
    watch = require('gulp-watch'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    livereload = require('gulp-livereload'),
    fs = require('fs');

var syst_version = '0.0.4';

gulp.task('build.syst', function(){

    var srcs = [
        'src/SYST.js',
        'src/event.js',
        'src/shareModel.js',
        'src/validate.js',
        'src/tools.js',
        'src/template.js',
        'src/model.js',
        'src/view.js',
        'src/controller.js',
        'src/router.js',
        'src/native.js'
    ];

    gulp.src(srcs)                           //需要操作的文件
        //.pipe(watch('src/*.js'))
        //SYST.js
        .pipe(concat('SYST.js'))                    //合并所有js到main.js
        .pipe(gulp.dest('dist'))                    //输出到文件夹
        .pipe(livereload())

        //SYST.min.js
        .pipe(rename({suffix: '.min'}))             //rename压缩后的文件名
        .pipe(uglify({ preserveComments: '!' }))    //压缩
        .pipe(gulp.dest('dist'))                    //输出
        .pipe(livereload());

});

gulp.task('watch', function(){
    livereload.listen();
    gulp.watch(['build.syst']);
});

gulp.task('default', ['build.syst', 'watch']);
