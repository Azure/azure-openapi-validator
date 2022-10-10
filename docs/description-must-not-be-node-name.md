# DescriptionMustNotBeNodeName

## Category

ARM Error

## Applies to

ARM and Data plane OpenAPI(swagger) specs

## Output Message

Description must not match the name of the node it is supposed to describe.

## Description

Description section must provide details on the current operation or model. Using the name of node in description does not provide any value.

## Why the rule is important

The description must provide a detailed description of the current context. This will ensure that all the operations and models are well documented.

## How to fix the violation

Provide detailed description of the node in the description section.
