# swagger linter validation

## architecture
![image](./overview.jpg)

- dependency graph
when lint swagger , firstly we will construct the dependency graph which contains the relationship of which swaggers reference the current swagger , and which swaggers are referenced by current swagger  

## adding new rules
1 add new shared functions or use existing functions
2 add rule configuration to default rule Set

## shared rule functions

```
export type IRuleFunction = (
  openapiDocument: any,
  openapiSection: any,
  location: JsonPath,
  ctx?: RuleContext,
  opt?: any
) => Iterable<ValidationMessage> | AsyncIterable<ValidationMessage>
```
## usage
```
azure openapi linter v0.1                                    
lint [specs..]

lint for swagger

Positionals:
  specs  The paths to the swagger specs.

Options:
  --help         Show help                                             [boolean]
  --debug        Output debug log messages.           [boolean] [default: false]
  --version      Show version number                                   [boolean]
  --option       Key/value pairs that can be passed to linter.  The format is
                 'key=value'.  This parameter can be used multiple times to add
                 more options.                                           [array]
  --openapiType  the openapi type                                       [string]
  --readme       the readme.md file path.                               [string]
  --tag          the readme.md file tag.                                [string]
```

## Open questions
### suppression

1  implement suppression manager in linter
2  