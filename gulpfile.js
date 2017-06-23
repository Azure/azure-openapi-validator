var gulp = require('gulp');
var clean = require('gulp-clean');
var run = require('gulp-run')
var mocha = require('gulp-mocha');

// All the typescript tasks
gulp.task('clean/typescript', function () {
    console.log('Cleaning build directories...');
    return gulp.src('src/typescript/**/*.{js,d.ts}', { read: false })
        .pipe(clean({ force: true }));
});

gulp.task('build/typescript', ['clean/typescript'], function () {
    console.log('Running the typescript transpiler...');
    return gulp.src('./src/typescript/').pipe(run('tsc --project tsconfig.json'));
});

gulp.task('test/typescript', ['build/typescript'], function () {
    console.log('Running the unit tests...');
    gulp.src(['src/typescript/azure-openapi-validator/tests/*.js'])
        .pipe(mocha({
            timeout: 120000
        }))
        .once('error', () => {
            process.exit(1);
        });
});

// All the dotnet tasks
gulp.task('clean/dotnet', function () {
    console.log('Cleaning build directories...');
    return gulp.src('src/dotnet/**/bin', { read: false })
        .pipe(clean({ force: true }));
});

gulp.task('restore/dotnet', ['clean/dotnet'], function () {
    console.log('Running dotnet restore...');
    return gulp.src('./src/dotnet/*.csproj')
        .pipe(run('dotnet restore'));
});

gulp.task('build/dotnet', ['restore/dotnet'], function () {
    console.log('Running dotnet build...');
    return gulp.src('./src/dotnet/*.csproj')
        .pipe(run('dotnet build'));
});

gulp.task('test/dotnet', ['build/dotnet'], function () {
    console.log('Running the dotnet unit tests...');
    return run('dotnet test -v q', { cwd: './src/dotnet/AutoRest.Swagger.Tests' }).exec();
});

// Now the defaults
gulp.task('test', ['test/dotnet', 'test/typescript'], function () {
    console.log('Running the unit tests...');
});

gulp.task('default', function () {
    return gulp.run('test');
});
