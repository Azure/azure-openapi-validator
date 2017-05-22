var gulp = require('gulp');
var clean = require('gulp-clean');
var ts = require('gulp-typescript');
var run = require('gulp-run')
var mocha = require('gulp-mocha');
var tsProject = ts.createProject('tsconfig.json');

gulp.task('clean', function () {
    console.log('Cleaning build directories...');
    return gulp.src('bin/', { read: false })
        .pipe(clean({ force: true }));
});

gulp.task('build', ['clean'], function () {
    console.log('Running the Typescript transpiler...');
    return gulp.src(['src/**/*.ts'])
        .pipe(tsProject())
        .pipe(gulp.dest('bin/'));
});

gulp.task('test', ['build'], function () {
    console.log('Running the unit tests...');
    gulp.src(['bin/azure-openapi-validator/tests/*.js'])
        .pipe(mocha())
        .once('error', () => {
            process.exit(1);
        });
});

gulp.task('default', function () {
    return gulp.run('test');
});