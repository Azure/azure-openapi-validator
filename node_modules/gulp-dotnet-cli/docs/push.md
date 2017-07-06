# push

The push module is responsible for running `dotnet nuget push` or essentially pushing a nuget package to a nuget server. You can get more help by running `dotnet nuget push --help` 

```js
let {push} = require('gulp-dotnet-cli');

```


## Options

The [NugetPush model](/lib/models/NugetPushModel.js) contains the actual model we validate against

#### forceEnglishOutput

* type: `bool`

> Forces the application to run using an invariant, English-based culture.

#### source 

* type: `string`

> Specifies the server URL

#### symbolsource 

* type: `string`

> Specifies the symbol server URL. If not specified, nuget.smbsrc.net is used when pushing to nuget.org

#### timeout 

* type: `int`

> Specifies the timeout for pushing to a server in seconds. Defaults to 300 seconds (5 minutes)

#### apiKey 

* type: `string`

> The API key for the server.

#### symbolApiKey 

* type: `string`

> The API key for the symbol server.

#### disableBuffering 

* type: `bool`

> Disable buffering when pushing to an HTTP(S) server to decrease memory usage.

#### noSymbols 

* type: `bool`

> If a symbols package exists, it will not be pushed to a symbols server.

#### echo

* type: `bool`

* default: false

> Logs the command we run to the console