var gulp = require('gulp');
var clean = require('gulp-clean');
var run = require('gulp-run')
var mocha = require('gulp-mocha');
var { restore, build, test, pack, publish } = require('gulp-dotnet-cli');

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
    return gulp.src(['src/dotnet/**/bin', 'src/dotnet/**/obj'], { read: false })
        .pipe(clean({ force: true }));
});

gulp.task('restore/dotnet', ['clean/dotnet'], function () {
    console.log('Running dotnet restore...');
    return gulp.src('src/dotnet/**/*.csproj')
        .pipe(restore({ verbosity: 'diagnostic' }));
});

gulp.task('build/dotnet', ['restore/dotnet'], function () {
    console.log('Running dotnet build...');
    //return gulp.src('src/dotnet/**/*.csproj')
    //  .pipe(build({ verbosity: 'diagnostic' }));
    return gulp.src('./src/dotnet/**/*.csproj')
        .pipe(run('dotnet restore')).exec();
});

gulp.task('test/dotnet', ['build/dotnet'], function () {
    console.log('Running the dotnet unit tests...');
    return gulp.src('src/dotnet/OpenAPI.Validator.Tests/OpenAPI.Validator.Tests.csproj')
        .pipe(test({ verbosity: 'minimal' }));
});

// Now the defaults/commons
gulp.task('build', ['build/dotnet', 'build/typescript'], function () {
    console.log('Building code...');
});

gulp.task('clean', ['clean/typescript', 'clean/dotnet'], function () {
    console.log('Cleaning artifacts...');
});

gulp.task('test', ['test/dotnet', 'test/typescript'], function () {
    console.log('Successfully ran the tests...');
});

gulp.task('dotnet', ['test/dotnet'], function () {
});

gulp.task('typescript', ['test/typescript'], function () {
});

gulp.task('default', ['dotnet', 'typescript'], function () {
    console.log('Successfully built and tested the repo...');
});
