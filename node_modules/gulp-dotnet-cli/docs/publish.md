# Publish

The publish module is responsible for running `dotnet publish` or essentially publishing project to the local filesystem for deployment. You can get more help by running `dotnet publish --help`

```js
let {publish} = require('gulp-dotnet-cli');

```


## Options

The [publish model](/lib/models/PublishModel.js) contains the actual model we validate against


#### output 

* type: `string`

> Output directory in which to place built artifacts

#### framework

* type: `string`

> Target framework to build for. The target framework has to be specified in the project file.

#### runtime

* type: `string`

> Target runtime to build for. The default is to build a portable application.

#### configuration 

* type: `string`

> Configuration to use for building the project. Default for most projects is  "Debug"

#### versionSuffix

* type: `string`

> Defines the value for the $(VersionSuffix) property in the project

#### verbosity 

* type: `string`

**valid values:** 'quiet', 'minimal', 'normal', 'detailed', 'diagnostic'

> sets the console verbosity

#### version 

* type: `string`

> Sets the $(Version) property in msbuild


#### msbuildArgs

* type: `Array<string>`

> Any extra options that should be passed to MSBuild. See dotnet msbuild -h for available options

#### echo

* type: `bool`

* default: false

> Logs the command we run to the console