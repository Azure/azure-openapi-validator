# HostParametersValidation

## Description

This rule is to valiate the parameters in the 'x-ms-parameterized-host' to ensure they are following below rules:

1. If a parameter matches belows, therefore it must be called 'endpoint' and be typed 'type:string, format:uri'.
    - Client level (x-ms-parameter-location: client)
    - A path component (in: path)
    - Part of a 'x-ms-parametrized-host' with 'useSchemePrefix: false'
    - Tagged 'x-ms-skip-encoding: true'

## How to fix

Follow above rules to adjust the parameters in 'x-ms-paramterized-host'.

## Why?

This rule can prevent inconsistent code been generated with dataplane codegen.
