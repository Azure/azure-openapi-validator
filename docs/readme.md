# Linting

There are a number of rules that can be validated with AutoRest. The current set of rules is focused on Azure Resource Management (ARM) specs and its applicable rules.

## Running linter
Run
`autorest --validation --azure-validator --input-file=<path-to-spec>`
if you'd like the output to be in Json format please use the following flag:
`--message-format=json`
