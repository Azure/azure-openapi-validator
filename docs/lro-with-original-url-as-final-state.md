# LroWithOriginalUriAsFinalState

## Description

The long running operation with final-state-via:original-uri should have a sibling 'get' operation.

## How to fix

Add the missing get operation.

## What's the impact if breaking the rule

If no get operation, the generated SDK could not know the response schema of the final state.
