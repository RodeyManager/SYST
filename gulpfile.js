var fs          = require('fs'),
    gulp        = require('gulp'),
    watch       = require('gulp-watch'),
    rename      = require('gulp-rename'),
    concat      = require('gulp-concat'),
    sourcemaps  = require('gulp-sourcemaps'),
    uglify      = require('gulp-uglify'),
    livereload  = require('gulp-livereload'),
    notify      = require('gulp-notify'),
    clean       = require('gulp-clean'),
    ts          = require('gulp-typescript');

//版本号
var syst_version = '1.0.3';

//mod version
modVersion('src/SYST.js');
modVersion('src/ts/ST.ts');

function modVersion(src){
    if(fs.existsSync(src)){
        var syst_text = fs.readFileSync('src/SYST.js', 'utf8');
        syst_text = syst_text.replace(/\s*SYST.version\s*=\s*['|"]([\s\S]*?)['|"];/gi, function(match, version){
            return match.replace(version, syst_version);
        }).replace(/static version:[\s\S]*?=['|"]([\s\S]*?)['|"];/gi, function(match, version){
            return match.replace(version, syst_version);
        });

        fs.writeFileSync('src/SYST.js', syst_text, 'utf8');
    }
}

var srcs = [
    'SYST',
    'validate',
    'tools',
    'promise',
    'template',
    'event',
    'model',
    'ajax',
    'shareModel',
    'view',
    'controller',
    'router',
    'native'
].map(function(src){
        return 'src/' + src + '.js';
    });

var tses = srcs.map(function(item){
    var ts = item.replace(/src?/i, 'src/ts').replace(/.js/i, '.ts');
    if(!fs.existsSync(ts)){
        return null;
    }
    return ts;
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
        .pipe(ts({
            declaration: true,
            out: 'dist/SYST.js'
        }))
        .pipe(gulp.dest('dist/ts'));
});

//监听文件变化
gulp.task('watch', function(){
    //livereload.listen();
    gulp.watch(srcs, ['build.syst']);
    gulp.watch('src/ts/*', ['build.ts']);
});

//执行任务
gulp.task('default', ['dist.clean'], function(){
    //gulp.start('build.syst', 'build.ts', 'watch');
    gulp.start('build.syst', 'watch');
});
