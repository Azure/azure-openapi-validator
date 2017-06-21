var gulp = require('gulp');
var clean = require('gulp-clean');
var run = require('gulp-run')
var mocha = require('gulp-mocha');

gulp.task('clean', function () {
    console.log('Cleaning build directories...');
    return gulp.src('src/**/*.{js,d.ts}', { read: false })
        .pipe(clean({ force: true }));
});

gulp.task('build', ['clean'], function () {
    console.log('Running the Typescript transpiler...');
    return gulp.src('./src/').pipe(run('tsc --project tsconfig.json'));
});

gulp.task('test', ['build'], function () {
    console.log('Running the unit tests...');
    gulp.src(['src/typescript/azure-openapi-validator/tests/*.js'])
        .pipe(mocha({
            timeout: 120000
        }))
        .once('error', () => {
            process.exit(1);
        });
});

gulp.task('default', function () {
    return gulp.run('test');
});
