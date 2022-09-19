# HostParametersValidation

## Description

This is to validate if parameters in the 'x-ms-parameterized-host' follow the following rules::

1. If a parameter matches belows, therefore it must be called 'endpoint' and be typed 'type:string, format:url'.
   - Client level (x-ms-parameter-location: client)
   - A path component (in: path)
   - Part of a 'x-ms-parametrized-host' with 'useSchemePrefix: false'
   - Tagged 'x-ms-skip-encoding: true'

## How to fix

Follow above rules to adjust the parameters in 'x-ms-paramterized-host'.

## Why?

This rule can prevent inconsistent code been generated with dataplane codegen.
