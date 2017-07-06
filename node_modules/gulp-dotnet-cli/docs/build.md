# Build

The build module is responsible for running `dotnet build` or essentially calling the compiler. You can get more help by running `dotnet build --help`

```js
let {build} = require('gulp-dotnet-cli');

```


## Options

The [build model](/lib/models/BuildModel.js) contains the actual model we validate against


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
       
#### noIncremental

* type: `bool`

> Disables incremental build.

#### noDepenencies

* type: `bool`

> Set this flag to ignore project-to-project references and only build the root project


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