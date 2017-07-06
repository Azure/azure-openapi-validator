# Test

The test module is responsible for running `dotnet test` or essentially running your unit tests. You can get more help by running `dotnet test --help`

```js
let {test} = require('gulp-dotnet-cli');

```


## Options

The [test model](/lib/models/TestModel.js) contains the actual model we validate against


#### settings 

* type: `string`

> Settings file to use when running tests.

#### listTests 

* type: `bool`

> Lists discovered tests

#### filter 

* type: `string`

> Lists discovered tests

#### testAdapterPath 

* type: `string`

> Use custom adapters from the given path in the test run.

#### logger 

* type: `string`

> Specify a logger for test results.

#### configuration 

* type: `string`

> Configuration to use for building the project. Default for most projects is  "Debug"

#### framework 

* type: `string`

> Looks for test binaries for a specific framework

#### output 

* type: `string`

> Directory in which to find the binaries to be run

#### diag 

* type: `string`

> Enable verbose logs for test platform. Logs are written to the provided file.

#### noBuild 

* type: `bool`

> Do not build project before testing.

#### verbosity 

* type: `string`

**valid values:** 'quiet', 'minimal', 'normal', 'detailed', 'diagnostic'

> sets the console verbosity


#### additionalArgs

* type: `Array<string>`

> Any extra commandline runsettings arguments that should be passed to vstest. See dotnet vstest --help for available options

#### echo

* type: `bool`

* default: false

> Logs the command we run to the console