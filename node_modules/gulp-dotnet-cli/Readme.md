[![Coverage Status](https://coveralls.io/repos/github/Janus-vistaprint/gulp-dotnet-cli/badge.svg?branch=master)](https://coveralls.io/github/Janus-vistaprint/gulp-dotnet-cli?branch=master) [![Build Status](https://travis-ci.org/Janus-vistaprint/gulp-dotnet-cli.svg?branch=master)](https://travis-ci.org/Janus-vistaprint/gulp-dotnet-cli)

## gulp-dotnet-cli

[gulp](https://github.com/gulpjs/gulp) plugin for the dotnet cli. 

You can run `dotnet action --help` to get help on a specific action ex. `dotnet build --help`, or view our [Api docs](docs/Readme.md) 

## Usage

You must have the [dotnet cli](http://dot.net) installed and on your path.

First, install gulp-dotnet-cli 

`npm install --save-dev gulp-dotnet-cli`

Then add it to your gulpfile.js

```javascript

let {restore, build, test, pack, publish} = require('gulp-dotnet-cli');
let version = `1.3.` + process.env.BUILD_NUMBER || '0';
let configuration = process.env.BUILD_CONFIGURATION || 'Release';
let gulp = require('gulp');
//restore nuget packages
gulp.task('restore', ()=>{
    return gulp.src('**/*.csproj', {read: false})
            .pipe(restore());
})
//compile
gulp.task('build', ['restore'], ()=>{
                    //this could be **/*.sln if you wanted to build solutions
    return gulp.src('**/*.csproj', {read: false})
        .pipe(build({configuration: configuration, version: version}));
});
//run unit tests
gulp.task('test', ['build'], ()=>{
    return gulp.src('**/*test*.csproj', {read: false})
        .pipe(test())
});
//compile and publish an application to the local filesystem
gulp.task('publish', ['test'], ()=>{
    return gulp.src('src/TestWebProject.csproj', {read: false})
                .pipe(publish({configuration: configuration, version: version}));
})
//convert a project to a nuget package
gulp.task('pack', ['build'], ()=>{
    return gulp.src('**/TestLibrary.csproj', {read: false})
                .pipe(pack({
                            output: path.join(process.cwd(), 'nupkgs') , 
                            version: version
                            }));
});
//push nuget packages to a server
gulp.task('push', ['pack'], ()=>{
    return gulp.src('nupkgs/*.nupkg', {read: false})
                .pipe(push({
                    apiKey: process.env.NUGET_API_KEY, 
                    source: 'https://myget.org/f/myfeedurl'}));
});

```
You can find a working example in our [test](test/gulpfile.js) directory