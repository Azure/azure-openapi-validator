# Authoring OpenAPI Validation Rules (in C#)

## Architecture
In the AutoRest pipeline, OpenAPI files get deserialized into intermediate classes, which are then used to create the language-independent client model. Our validation logic is performed on these deserialization classes to allow logic written in C# to be used to check the object representation of the OpenAPI spec.

The root OpenAPI spec is deserialized into a [`ServiceDefinition`](../../src/dotnet/OpenAPI.Validator/Model/ServiceDefinition.cs) object. The validation step recursively traverses this object tree and applies the validation rules that apply to each property and consolidate the messages from all rules. Validation rules are associated with a property by decorating it with a `RuleAttribute`. This `RuleAttribute` will be passed the value for that property and determines if that value satisfies the rule or not. Multiple `RuleAttribute` attributes can be applied to the same property, and any rules that fail will be part of the output.

## Steps for writing a rule (see [instructions below](#instructions))
1. Define a canonical name that represents the rule and a message that should be shown to the user explaining the validation failure
2. Determine if your rule is an `Info`, a `Warning` or an `Error`
3. Determine if your rule is applicable to `ARM`, `DataPlane` or `Default` OpenAPI specs
4. For advanced usage, determine if rule is applicable in the `Individual` or `Composed` merge state
5. Implement the logic that validates this rule against a given object
6. Define where this validation rule gets applied in the object tree
7. Write a test that verifies that this rule correctly validates OpenAPI specs

## Instructions
### 1. Add the rule name and message
- The name of your validation rule should be added to the end of the `ValidationExceptionName` enum
- Messages are added to the [`AutoRest.Core.Properties.Resource` resx](../../src/dotnet/OpenAPI.Validator/Properties/Resources.resx).

### 2. Add a `Rule` subclass that implements your validation rule logic
- Create a subclass of the `Rule` class, and override the `bool IsValid(object entity)` method.
- For more complex rules (including getting type information in `IsValid()`, see the [Complex rules](#complex-rules) section below.

### 3. Decorate the appropriate Swagger model property that your rule applies to
- Add a `[Rule(typeof({MyRule})]` attribute above the property that should satisfy the rule. Replace `{MyRule}` with the subclass that you implemented.
- The `typeof()` is necessary because C# doesn't support generics in attributes.

### 4. Add a test to `OpenAPIModelerValidationTests.cs` that validates your validation rule 
- Add an incorrect OpenAPI file to the [`Resource/OpenAPI/`](../../src/dotnet/OpenAPI.Validator.Tests/Resource/OpenAPI) folder that should trigger your validation rule.
- Add a test case to [`OpenAPIModelerValidationTests.cs`](../../src/dotnet/OpenAPI.Validator.Tests/OpenAPIModelerValidationTests.cs) that asserts that the validation message returned for the OpenAPI file is  

### 5. Ensure your validation rule applies to `clean-complex-spec.json`  
- `clean-complex-spec.json` is a complex json that passes each validation rule specified in `OpenAPIModelerValidationTests.cs`
- Upon adding your validation rule, ensure this json passes the rule by running the `CleanFileValidation` test

## Complex rules
### Typed rules
The `IsValid()` method of the `Rule` class only passes an object with no type information. You can have your rule subclass work on a typed model class by inheriting from the `TypedRule<T>` class instead. By replacing `T` with a model class, your override of `IsValid()` will use `T` as the type for the `entity` parameter.

### Message interpolation (e.g. `"'foo' is not a valid MIME type for consumes"`)
Simple rules can simply override the `bool IsValid(object entity)` method when subclassing `Rule` and return true or false, depending on if the object satisfies the rule. However, some messages are more useful if they provide the incorrect value as part of the message.

Rules can override a different `IsValid` overload (`IsValid(object enitity, out object[] formatParameters)`. Any objects returned in `formatParameters` will be passed on to `string.Format()` along with the message associated with the rule. When writing the message, use standard `string.Format()` conventions to define where replacements go (e.g. `"'{0}' is not a valid MIME type for consumes"`).

### Collection rules
Sometimes, a rule should apply to every item in a list or dictionary, but it cannot be applied to the class definition (since the same class can be used in multiple places in the `ServiceDefinition` tree).

An example of this is the `AnonymousTypesDiscouraged` rule. The purpose of this rule is to have schemas defined in the `definitions` section of the OpenAPI file instead of in the parameter that it will be used for. It validates the `Schema` class, but it cannot be applied to all instances of this class, because the `definitions` section also uses the `Schema` class.

Since we want to apply this rule to parameters in an operation, we can decorate the `Parameters` property of the [`OperationResponse`](../../src/dotnet/OpenAPI.Validator/Model/Operation.cs) class with the `CollectionRule` attribute. When the object tree is traversed to apply validation rules, each item in the collection will be validated against the `AnonymousParameterTypes` logic.