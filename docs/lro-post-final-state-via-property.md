#LROPostFinalStateViaProperty

## Category

ARM Error

## Applies to

ARM OpenAPI(swagger) specs

## Related ARM Guideline Code

- RPC-Post-V1-09

## Output Message

A long running operation (LRO) post MUST have 'long-running-operation-options' specified and MUST have the 'final-state-via' property set to 'azure-async-operation'.

## Description

For long running (LRO) post operations, 'long-running-operation-options' must be present and have the 'final-state-via' property set to 'azure-async-operation'.

## How to fix the violation

Ensure that, for long running (LRO) post operations, 'long-running-operation-options' is specified and has the 'final-state-via' property set to 'azure-async-operation'.
