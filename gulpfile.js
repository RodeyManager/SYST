var fs          = require('fs'),
    gulp        = require('gulp'),
    watch       = require('gulp-watch'),
    rename      = require('gulp-rename'),
    concat      = require('gulp-concat'),
    sourcemaps  = require('gulp-sourcemaps'),
    plumber     = require('gulp-plumber'),
    uglify      = require('gulp-uglify'),
    notify      = require('gulp-notify'),
    strip       = require('gulp-strip-comments'),
    clean       = require('gulp-clean'),
    ts          = require('gulp-typescript'),
    replaceVar  = require('gulp-replace'),
    toZip       = require('gulp-zip'),
    banner      = require('./lib/banner'),
    joint      = require('./lib/joint');

var version = require('./package.json').version;

var srcs = [
    'util',
    'SYST',
    'validate',
    'native',
    'tools',
    'dom',
    'promise',
    'ajax',
    'http',
    'template',
    'event',
    'observe',
    'watcher',
    'model',
    'shareModel',
    'view',
    'controller',
    //'router',
    'component',
    'ui'
].map(function(src){
        return 'src/' + src + '.js';
    });

var amd_prefix = ';(function(global, factory){' +
    'if(typeof define === \'function\' && define.amd){' +
        'define(function(){ return factory(global) });' +
    '}else{' +
        'factory(global);' +
    '}}(this, function(){\n\'use strict\';',
    amd_suffix = '\nreturn SYST; \n}.call(window)));';

//清理dist目录下的js文件
gulp.task('dist.clean', function(){
    return gulp.src(['dist/SYST.js', 'dist/SYST.min.js', 'dist/ts/*.js'], { read: true })
        .pipe(clean());

});

//合拼并压缩src目录下的js文件
gulp.task('build.syst', function(){
    var version = require('./package.json').version,
        copyRight = {
            'SYST.js': 'v' + version,
            'Copyright': ' 2016, Rodey Luo',
            'Released': 'under the MIT License.',
            'Date': new Date()
        };

    gulp.src(srcs)                           //需要操作的文件
        .pipe(plumber())

        //SYST.js
        .pipe(replaceVar(/\{\{@version\}\}/i, version))
        .pipe(concat('SYST.js'))                    //合并所有js到main.js
        .pipe(joint(amd_prefix, 'top'))
        //.pipe(joint('!(function(){\'use strict\';', 'top'))
        .pipe(banner(copyRight))
        .pipe(joint(amd_suffix, 'bottom'))
        //.pipe(joint('\n}).apply(this);', 'bottom'))
        .pipe(gulp.dest('dist'))                    //输出到文件夹

        //SYST.min.js
        .pipe(rename({basename: 'SYST', suffix: '.min'}))             //rename压缩后的文件名
        .pipe(uglify({ preserveComments: '!' }))    //压缩
        .pipe(banner(copyRight))
        .pipe(gulp.dest('dist'))                    //输出
        .pipe(notify({ message: 'SYST.min.js created success!' }));

});

gulp.task('build.router', function(){

    var version = require('./package.json').version,
        copyRight = {
            //'SYST.Router.js': 'v' + version,
            'SYST.Router.js': 'v 1.0',
            'Copyright': ' 2016, Rodey Luo',
            'Released': 'under the MIT License.',
            'Date': new Date()
        };

    //router
    gulp.src('src/router.js')
        .pipe(banner(copyRight))
        .pipe(rename({basename: 'SYST.Router'}))
        .pipe(gulp.dest('dist'))
        .pipe(rename({basename: 'SYST.Router', suffix: '.min'}))             //rename压缩后的文件名
        .pipe(uglify({ preserveComments: '!' }))    //压缩
        .pipe(banner(copyRight))
        .pipe(gulp.dest('dist'))
        .pipe(notify({ message: 'SYST.Router.min.js created success!' }));
});


//to bind version suffix
gulp.task('build.version', function(){
    var version = require('./package.json').version,
        copyRight = {
            'SYST.js': 'v' + version,
            'Copyright': ' 2016, Rodey Luo',
            'Released': 'under the MIT License.',
            'Date': new Date()
        };

    gulp.src(srcs)                           //需要操作的文件
        .pipe(plumber())

        //SYST.js
        .pipe(replaceVar(/\{\{@version\}\}/i, version))
        .pipe(concat('SYST'+ '.'+ version +'.js'))
        .pipe(banner(copyRight))
        .pipe(gulp.dest('dist'))

        .pipe(uglify({ preserveComments: '!' }))    //压缩             //输出
        .pipe(rename({basename: 'SYST', suffix: '.'+ version +'.min'}))
        .pipe(banner(copyRight))
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

//监听文件变化
gulp.task('watch', function(){
    //livereload.listen();
    gulp.watch(srcs.concat(['./package.json']), ['build.syst']);
});

//执行任务
gulp.task('default', ['dist.clean'], function(){
    gulp.start('build.syst', 'watch');
});

//production
gulp.task('production', ['dist.clean'], function(){
    gulp.start('build.syst', 'build.router');
});
