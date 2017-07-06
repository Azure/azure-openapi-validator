# Pack

The pack module is responsible for running `dotnet pack` or essentially packaging a project into a nuget package. You can get more help by running `dotnet pack --help`

```js
let {pack} = require('gulp-dotnet-cli');

```


## Options

The [pack model](/lib/models/PackModel.js) contains the actual model we validate against


#### output

* type: `string`

> Directory in which to place built packages.

#### noBuild

* type: `bool`

> Skip building the project prior to packing. By default, the project will be built.

#### includeSymbols 

* type: `bool`

> Include packages with symbols in addition to regular packages in output directory.

#### includeSource

* type `bool`

> Include PDBs and source files. Source files go into the src folder in the resulting nuget package

#### configuration

* type `string` 

> Configuration to use for building the project.  Default for most projects is  "Debug"

#### versionSuffix

* type `string`

> Defines the value for the $(VersionSuffix) property in the project.

#### serviceable

* type `bool`

> Set the serviceable flag in the package. For more information, please see [https://aka.ms/nupkgservicing](https://aka.ms/nupkgservicing)

#### verbosity 

* type: `string`
**valid values:** 'quiet', 'minimal', 'normal', 'detailed', 'diagnostic'

> sets the console verbosity

#### msbuildArgs

* type: `Array<string>`

> Any extra options that should be passed to MSBuild. See dotnet msbuild -h for available options

#### echo

* type: `bool`

* default: false

> Logs the command we run to the console