# LroPostMustNotUseOriginalUriAsFinalState

## Description

The long running post operation must not use final-stat-via:original-uri.

## How to fix

Change to use other options define in [x-ms-long-running-operation-options](https://github.com/Azure/autorest/tree/main/docs/extensions#x-ms-long-running-operation-options)

## What's the impact if breaking the rule

This usage is not allowed, as it does not make sense to have 'get' operation on the post action.
