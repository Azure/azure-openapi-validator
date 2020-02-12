/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

var path = require('path');
var gulp = require('gulp');
var clean = require('gulp-clean');
var run = require('gulp-run')
var mocha = require('gulp-mocha');
var { restore, build, test, pack, publish } = require('gulp-dotnet-cli');

// add .bin to PATH
function getPathVariableName() {
    // windows calls it's path 'Path' usually, but this is not guaranteed.
    if (process.platform === 'win32') {
        for (const key of Object.keys(process.env))
            if (key.match(/^PATH$/i))
                return key;
        return 'Path';
    }
    return "PATH";
}
process.env[getPathVariableName()] = path.join(__dirname, "src/dotnet/AutoRest/node_modules/.bin") + path.delimiter + process.env[getPathVariableName()];

// All the typescript tasks
gulp.task('clean/typescript', function () {
    console.log('Cleaning build directories...');
    return gulp.src(['src/typescript/azure-openapi-validator/*.{js,d.ts}', 'src/typescript/jsonrpc/*.{js,d.ts}'], { read: false })
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
        .pipe(restore());
});

gulp.task('build/dotnet', ['restore/dotnet'], function () {
    console.log('Running dotnet build...');
    return gulp.src('src/dotnet/**/*.csproj')
        .pipe(build());
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

gulp.task('dotnet/pack', ['dotnet', 'typescript'], function () {
    console.log('Kicking off the dotnet publish task...');
    return gulp.src('src/dotnet/AutoRest/AutoRest.csproj')
        .pipe(run('dotnet publish src/dotnet/AutoRest/AutoRest.csproj --configuration release --output bin/netcoreapp2.0'));
});

gulp.task('pack/typescript', [], function () {
    return run('cd src/typescript && npm pack').exec();
});

gulp.task('pack/dotnet', [], function () {
    return run('cd src/dotnet/AutoRest && npm pack').exec();
});

// this task can be excuted only when `gulp test` has been excuted successfully
gulp.task('pack', ['pack/dotnet', 'pack/typescript'], function () {
    gulp.src(['src/dotnet/AutoRest/*.tgz', 'src/typescript/*.tgz']).pipe(gulp.dest('dist/'));
    console.log('Successfully Packed the repo...');
});
