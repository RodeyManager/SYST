var fs          = require('fs'),
    gulp        = require('gulp'),
    watch       = require('gulp-watch'),
    rename      = require('gulp-rename'),
    concat      = require('gulp-concat'),
    sourcemaps  = require('gulp-sourcemaps'),
    plumber     = require('gulp-plumber'),
    uglify      = require('gulp-uglify'),
    notify      = require('gulp-notify'),
    clean       = require('gulp-clean'),
    ts          = require('gulp-typescript'),
    replaceVar  = require('gulp-replace'),
    toZip       = require('gulp-zip');



var version = require('./package.json').version;

var srcs = [
    'SYST',
    'validate',
    'tools',
    'promise',
    //'ajax',
    'http',
    'template',
    'event',
    'watcher',
    'model',
    'shareModel',
    'view',
    'controller',
    'router',
    'native'
].map(function(src){
        return 'src/' + src + '.js';
    });

//清理dist目录下的js文件
gulp.task('dist.clean', function(){
    return gulp.src(['dist/*.js', 'dist/ts/*.js'], { read: true })
        .pipe(clean());

});

//合拼并压缩src目录下的js文件
gulp.task('build.syst', function(){
    var version = require('./package.json').version;

    gulp.src(srcs)                           //需要操作的文件
        .pipe(plumber())

        //SYST.js
        .pipe(replaceVar(/\{\{@version\}\}/i, version))
        .pipe(concat('SYST.js'))                    //合并所有js到main.js
        .pipe(gulp.dest('dist'))                    //输出到文件夹

        //SYST.min.js
        .pipe(rename({basename: 'SYST', suffix: '.min'}))             //rename压缩后的文件名
        .pipe(uglify({ preserveComments: '!' }))    //压缩
        .pipe(gulp.dest('dist'))                    //输出
        .pipe(notify({ message: 'SYST.min.js created success!' }));

});

//to bind version suffix
gulp.task('build.version', function(){
    var version = require('./package.json').version;

    gulp.src(srcs)                           //需要操作的文件
        .pipe(plumber())

        //SYST.js
        .pipe(replaceVar(/\{\{@version\}\}/i, version))
        .pipe(concat('SYST'+ version +'.js'))
        .pipe(gulp.dest('dist'))

        .pipe(uglify({ preserveComments: '!' }))    //压缩             //输出
        .pipe(rename({basename: 'SYST', suffix: '.'+ version +'.min'}))
        .pipe(gulp.dest('dist'))

        .pipe(notify({ message: 'SYST'+ version +'.min.js created success!' }));
});

//to zip
gulp.task('build.zip', function(){
    var version = require('./package.json').version;
    gulp.src(['./**/*', '!node_modules/*/**', '!bower_components/*/**'])
        .pipe(toZip('SYST-' + version + '.zip'))
        .pipe(gulp.dest('dist'));
});

//编译 TypeScript 文件
gulp.task('build.ts', function(){

    var tses = [
        'ST',
        'validate',
        'tools',
        'promise',
        'template',
        'event',
        'ajax',
        'model',
        'shareModel',
        'view',
        'controller',
        'router',
        'native',
        'Global'
    ].map(function(src){
            return 'src/ts/' + src + '.ts';
        });
    gulp.src(tses)
        .pipe(replaceVar(/\{\{@version\}\}/i, version))
        .pipe(ts({
            declaration: true,
            out: 'dist/SYST.js'
        }))
        .pipe(gulp.dest('dist/ts'))

        .pipe(rename({suffix: '.min'}))             //rename压缩后的文件名
        .pipe(uglify({ preserveComments: '!' }))    //压缩
        .pipe(gulp.dest('dist/ts'));
});

//监听文件变化
gulp.task('watch', function(){
    //livereload.listen();
    gulp.watch(srcs.concat(['./package.json']), ['build.syst']);
    gulp.watch('src/ts/*', ['build.ts']);
});

//执行任务
gulp.task('default', ['dist.clean'], function(){
    //gulp.start('build.syst', 'build.ts', 'watch');
    gulp.start('build.syst', 'watch');
});
