var gulp = require('gulp'),
    watch = require('gulp-watch'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    livereload = require('gulp-livereload'),
    notify = require('gulp-notify'),
    clean = require('gulp-clean'),
    ts = require('gulp-typescript');

var syst_version = '0.0.4';
var srcs = [
    'src/SYST.js',
    'src/event.js',
    'src/shareModel.js',
    'src/validate.js',
    'src/tools.js',
    'src/template.js',
    'src/model.js',
    'src/ajax.js',
    'src/view.js',
    'src/controller.js',
    'src/router.js',
    'src/native.js'
];
var tses = srcs.map(function(item){
    return item.replace(/src?/i, 'src/ts').replace(/.js/i, '.ts');
});

//清理dist目录下的js文件
gulp.task('dist.clean', function(){
    return gulp.src(['dist/*.js', 'dist/ts/*.js'], { read: true })
        .pipe(clean());

});

//合拼并压缩src目录下的js文件
gulp.task('build.syst', function(){

    gulp.src(srcs)                           //需要操作的文件

        //SYST.js
        .pipe(concat('SYST.js'))                    //合并所有js到main.js
        .pipe(gulp.dest('dist'))                    //输出到文件夹
        .pipe(livereload())
        //.pipe(notify({ message: 'SYST.js created success!' }))

        //SYST.min.js
        .pipe(rename({suffix: '.min'}))             //rename压缩后的文件名
        .pipe(uglify({ preserveComments: '!' }))    //压缩
        .pipe(gulp.dest('dist'))                    //输出
        .pipe(livereload())
        .pipe(notify({ message: 'SYST.min.js created success!' }));

});

//编译 TypeScript 文件
gulp.task('build.ts', function(){

    //console.log(tses);

    gulp.src('src/ts/*.ts')
        .pipe(ts({
            declaration: true,
            noExternalResolve: true,
            noImplicitAny: true,
            out: 'dist/SYST.js'
        }))
        .pipe(gulp.dest('dist/ts'));
});

//监听文件变化
gulp.task('watch', function(){
    //livereload.listen();
    gulp.watch(srcs, ['build.syst']);
    gulp.watch(tses, ['build.ts']);
});

//执行任务
gulp.task('default', ['dist.clean'], function(){
    //gulp.start('build.syst', 'build.ts', 'watch');
    gulp.start('build.syst', 'watch');
});
