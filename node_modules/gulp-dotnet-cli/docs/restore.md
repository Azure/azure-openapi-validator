# Restore

The restore module is responsible for running `dotnet restore` or essentially downloading your nuget dependencies. You can get more help by running `dotnet restore --help`

```js
let {restore} = require('gulp-dotnet-cli');

```


## Options

The [restore model](/lib/models/RestoreModel.js) contains the actual model we validate against


#### source

* type: `string`

> Specifies a NuGet package source to use during the restore.

#### runtime

* type: `string`

> Target runtime to restore packages for.

#### packages

* type: `string`

> Directory to install packages in.

#### disableParallel

* type: `bool`

> Disables restoring multiple projects in parallel.

#### configfile

* type: `string`

> The NuGet configuration file to use.

#### disableParallel

* type: `bool`

> Do not cache packages and http requests.

#### ignoreFailedSources

* type: `bool`

> Treat package source failures as warnings.

#### noDependencies

* type: `bool`

> Set this flag to ignore project to project references and only restore the root project


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