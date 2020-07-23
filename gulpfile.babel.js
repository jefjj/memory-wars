/* eslint-disable no-console */

// gulp deploy --production (build e deploy via FTP para produção )
// gulp build --production  (build para produção)
// gulp build               (build para dev)
// gulp                     (assiste mudanças nos arquivos e gera a build)

import gulp from 'gulp';
import sass from 'gulp-sass';
import cssmin from 'gulp-clean-css';
import changed from 'gulp-changed';
import livereload from 'gulp-livereload';
import browserSync from 'browser-sync';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import babel from 'gulp-babel';
import env from 'babel-preset-env';
import runSequence from 'run-sequence';
import gulpif from 'gulp-if';
import del from 'del';
import eslint from "gulp-eslint";
import {Server} from 'karma';
import liveServer from 'gulp-live-server';

import usemin from 'gulp-usemin';
import rev from 'gulp-rev';

const argv = require('minimist')(process.argv.slice(2));

const dist = 'dist/';
const distCss = dist + 'css/';
const distJs = dist + 'js/';
const distFonts = dist + 'webfonts/';

gulp.task('build_cssVendor', () => {
    return gulp
        .src([
            'node_modules/bootstrap/dist/css/bootstrap.min.css',
            'node_modules/@fortawesome/fontawesome-free/css/all.css'
        ])
        .pipe(concat('vendor.min.css'))
        .pipe(gulpif(argv.production, cssmin()))
        .pipe(gulp.dest(distCss));
});

gulp.task('build_css', () => {
    return gulp.src('src/styles/*.scss')
        .pipe(sass())
        .pipe(concat('all.min.css'))
        .pipe(gulpif(argv.production, cssmin()))
        .pipe(gulp.dest(distCss));
});

gulp.task('build_jsVendor', () => {
    return gulp
        .src([
            'node_modules/jquery/dist/jquery.slim.min.js',
            'node_modules/bootstrap/dist/js/bootstrap.min.js',
            'node_modules/lodash/lodash.js',
            'node_modules/angular/angular.min.js'
        ])
        .pipe(concat('vendor.min.js'))
        .pipe(gulpif(argv.production, uglify({mangle: false})))
        .pipe(gulp.dest(distJs));
});

gulp.task('build_js', () => {
    return gulp.src([
            'src/scripts/app.js',
            'src/scripts/app.config.js',
            'src/scripts/app.contant.js',
            'src/scripts/**/*.js',
            '!src/scripts/**/*_test.js'
        ])
        .pipe(babel({
            presets: env
        }))
        .pipe(concat('all.min.js'))
        .pipe(gulpif(argv.production, uglify({mangle: false})))
        .pipe(gulp.dest(distJs));
});

gulp.task('build_code', () => {
    return gulp
        .src([
            'src/**/*.html'
        ])
        .pipe(changed(dist))
        .pipe(gulp.dest(dist));
});

gulp.task('build_fonts', () => {
    return gulp
        .src([
            'node_modules/@fortawesome/fontawesome-free/webfonts/*.*'
        ])
        .pipe(changed(distFonts))
        .pipe(gulp.dest(distFonts));
});

gulp.task('copy_images', () => {
    return gulp
        .src([
            'src/**/*.jpg',
            'src/**/*.jpeg',
            'src/**/*.png',
            'src/**/*.gif',
            'src/**/*.ico'
        ])
        .pipe(changed(dist))
        .pipe(gulp.dest(dist));
});

gulp.task('watch', () => {
    livereload.listen();
    gulp.watch('src/**/*.js', ['build_js']);
    gulp.watch('src/**/*.scss', ['build_css']);
    gulp.watch('src/**/*.html', ['build_code']);
});

gulp.task('browser-sync', () => {
    var files = [
        distCss + '**/*.css',
        distJs + '**/*.js',
        dist + '**/*.html'
    ];

    browserSync.init(files, {
        server: {
            baseDir: "./dist"
        },
        open: 'external',
        host: 'localhost'
    });
});

gulp.task('rev', () => {
    return gulp.src('dist/index.html')
        .pipe(usemin({
            cssVendor: [
                rev()
            ],
            cssAll: [
                rev()
            ],
            jsVendor: [
                rev()
            ],
            jsAll: [
                rev()
            ]
        }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('cleanDist', () => {
    return del([
        'dist/**/*'
    ]).then(paths => {
        console.log('Deleted files and folders:\n', paths.join('\n'));
    });
});

gulp.task('lint', () => {
    return gulp.src([
            'src/**/*.js',
            '!**/*_test.js'
        ])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('unit-test', (done) => {
    Server.start({
        configFile: __dirname + '/karma.conf.js',
        browsers: ['Chrome'],
        singleRun: true
    }, (exitCode) => {
        if (exitCode) {
            process.exit(exitCode);
        } else {
            done();
        }
    });
});

gulp.task('live-server', () => {
    let server = liveServer.static('dist', 3000);
    server.start();
});

gulp.task('devSequence', () => {
    return new Promise((resolve) => {
        runSequence(
            'cleanDist',
            ['build_js', 'build_jsVendor', 'build_css', 'build_cssVendor', 'build_code', 'build_fonts', 'copy_images'],
            ['watch', 'browser-sync'],
            resolve
        );
    });
});

gulp.task('buildSequence', () => {
    return new Promise((resolve) => {
        runSequence(
            'unit-test',
            'cleanDist',
            ['build_js', 'build_jsVendor', 'build_css', 'build_cssVendor', 'build_code', 'build_fonts', 'copy_images'],
            'rev',
            resolve
        );
    });
});

gulp.task('serveSequence', () => {
    return new Promise((resolve) => {
        runSequence(
            // 'lint',
            // 'unit-test',
            'cleanDist',
            ['build_js', 'build_jsVendor', 'build_css', 'build_cssVendor', 'build_code', 'build_fonts', 'copy_images'],
            'rev',
            'live-server',
            resolve
        );
    });
});

gulp.task('default', ['devSequence']);
gulp.task('build', ['serveSequence']);
gulp.task('serve', ['serveSequence']);
