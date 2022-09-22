# ResourceNameRestriction

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-V2-URI-5

## Output Message

The resource name parameter should be defined with a 'pattern' restriction.

## Description

This rule ensures that the authors explicitly define these restrictions as a regex on the resource name. If a team does not have custom rules then the ARM's default rule should get applied.

## CreatedAt

July 18, 2022

## LastModifiedAt

July 18, 2022

## What't the impact if breaking the rule

This rule aims to mitigate below problems:

- There are currently more than 4000 resources that do not specify their name constraints in the swagger.
- Most of the products do not comply to the default limit and many of them have a different limit in the description of the resources but even so do not specify formal constraints
- If a product does work with today default constrains for name that does not mean that it will comply with the constraints if they change in the future.
- Testing the name constrains in the current environment will be onerous since it would require try to create a resource for each one of the possible name corner cases and check if it would return an error. If the resource takes long to create this could take hours.

## How to fix the violation

Adding the pattern to the resource name parameter definition.
