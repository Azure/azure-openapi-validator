# Azure Ruleset

The following is the rule set for Azure API specs.

## AvoidNestedProperties
### Description
This rule appears when you define a property with the name `properties`, and do not use the [`x-ms-client-flatten` extension](../../extensions/readme.md#x-ms-client-flatten). Users often provide feedback that they don't want to create multiple levels of properties to be able to use an operation. By applying the `x-ms-client-flatten` extension, you move the inner `properties` to the top level of your definition.

### How to fix

see [avoid-nested-properties](./avoid-nested-properties.md)
## Others rules
to be added...