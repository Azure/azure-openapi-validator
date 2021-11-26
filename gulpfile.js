/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

var path = require('path');
var gulp = require('gulp');
var clean = require('gulp-clean');
var run = require('gulp-run')
var mocha = require('gulp-mocha');
var { restore, build, test } = require('gulp-dotnet-cli');
var shell = require('gulp-shell');

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

gulp.task("build/typescript", gulp.series(["clean/typescript"], function () {
  console.log("Running the typescript transpiler...")
  return gulp.src("./src/typescript/").pipe(run("tsc --project tsconfig.json"))
}))

gulp.task('test/typescript', gulp.series(['build/typescript'], function (done) {
  console.log('Running the unit tests...');
  gulp.src(['src/typescript/azure-openapi-validator/tests/*.js'])
    .pipe(mocha({
      timeout: 120000
    }))
    .once('error', () => {
      process.exit(1);
    });
  done()
}));

gulp.task(
  "generate/doc",
  gulp.series(["build/typescript"], function(done) {
    console.log("Generating the doc...")
    gulp
      .src("src/typescript/azure-openapi-validator/generateDoc.js")
      .once("error", () => {
        process.exit(1)
      })
    done()
  })
)

// All the dotnet tasks
gulp.task('clean/dotnet', function () {
  console.log('Cleaning build directories...');
  return gulp.src(['src/dotnet/**/bin', 'src/dotnet/**/obj'], { read: false })
    .pipe(clean({ force: true }));
});

gulp.task('restore/dotnet', gulp.series(['clean/dotnet'], function () {
  console.log('Running dotnet restore...');
  return gulp.src('src/dotnet/**/*.csproj')
    .pipe(restore());
}))

gulp.task('build/dotnet', gulp.series(['restore/dotnet'], function () {
  console.log('Running dotnet build...');
  return gulp.src('src/dotnet/**/*.csproj')
    .pipe(build());
}))

gulp.task('build/regressionTest', gulp.series([], function () {
  console.log('Running regression test build...');
  return gulp.src("./").pipe(run("tsc --project tsconfig.json"))
}))

gulp.task('test/dotnet', gulp.series(['build/dotnet'], function () {
  console.log('Running the dotnet unit tests...');
  return gulp.src('src/dotnet/OpenAPI.Validator.Tests/OpenAPI.Validator.Tests.csproj')
    .pipe(test({ verbosity: 'minimal' }));
}))

// Now the defaults/commons
gulp.task(
  "build",
  gulp.parallel(["build/dotnet", "build/typescript", "build/regressionTest"], function (done) {
    console.log("Building code...")
    done()
  })
)

gulp.task(
  "clean",
  gulp.parallel(["clean/typescript", "clean/dotnet"], function (done) {
    console.log("Cleaning artifacts...")
    done()
  })
)

gulp.task(
  "test",
  gulp.parallel(["test/dotnet", "test/typescript"], function (done) {
    console.log("Successfully ran the tests...")
    done()
  })
)

gulp.task('dotnet', gulp.series(['test/dotnet'], function (done) {
  done()
}))

gulp.task('typescript', gulp.series(['test/typescript'], function (done) {
  done()
}))

gulp.task(
  "default",
  gulp.parallel(["dotnet", "typescript"], function (done) {
    console.log("Successfully built and tested the repo...")
    done()
  })
)

gulp.task(
  "dotnet/pack",
  gulp.series(["dotnet", "typescript"], function () {
    console.log("Kicking off the dotnet publish task...")
    return gulp
      .src("src/dotnet/AutoRest/AutoRest.csproj")
      .pipe(run("dotnet publish src/dotnet/AutoRest/AutoRest.csproj --configuration release --output bin/netcoreapp2.0"))
  })
)

gulp.task('pack/typescript', function () {
  return run('cd src/typescript && npm pack').exec();
})

gulp.task('pack/dotnet', function () {
  return run('cd src/dotnet/AutoRest && npm pack').exec();
})

// this task can be excuted only when `gulp test` has been excuted successfully
gulp.task(
  "pack",
  gulp.series(["pack/dotnet", "pack/typescript"], function (done) {
    gulp.src(["src/dotnet/AutoRest/*.tgz", "src/typescript/*.tgz"]).pipe(gulp.dest("dist/"))
    console.log("Successfully Packed the repo...")
    done()
  })
)

gulp.task('coverage/ts', shell.task([
  'npx nyc mocha ./src/typescript/azure-openapi-validator/tests/**/*.js',
]));
