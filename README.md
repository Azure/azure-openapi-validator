# Contributing

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Build dependencies
- Node (6.9.5 or higher)
- Node Package Manager
- Typescript (2.3.0 or higher)

## Build scripts
### How to build
The first step would be to run ```npm install``` so we have all the required modules installed.

```
gulp build
```
This transpiles the typescript scripts into javascript files under the js folder.
### How to test
```
gulp test
```
This runs the tests under tests directory.

### How to write a new validation rule
1. Add a typescript file under ```azure-openapi-linter``` directory named same as the name of the rule. Add the ```id```, ```name```, ```severity```, ```category```,  ```mergeState```,  ```openapiType```,  ```appliesTo_JsonQuery``` properties to the rule. ```appliesTo_JsonQuery``` is the node(s) to which the rule needs to be applied. This is evaluated using JsonPaths. Please refer [here](https://www.npmjs.com/package/jsonpath#jsonpath-syntax) for a brief tutorial about JsonPaths.
2. Next, implement the ```run``` method under the rule that actually does the validation. Add a reference to this script file under ```src\azure-openapi-linter\index.ts```.
3. Lastly add a test case for the validation rule, by adding a test json/yaml under ```src\azure-openapi-linter\tests\resources``` and a script under ```src\azure-openapi-linter\tests``` depending on the type of the validation rule.