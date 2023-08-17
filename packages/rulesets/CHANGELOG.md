# Change Log - @microsoft.azure/openapi-validator-rulesets

This log was last generated on Wed, 16 Aug 2023 22:39:14 GMT and should not be manually modified.

## 1.2.0
Wed, 16 Aug 2023 22:39:14 GMT

### Minor changes

- Added rule to check that parameters already defined in common-types are not being redefined.
- Remove RequiredReadOnlyProperties rule
- Update to 1.1.0

### Patches

- Add support for rfc7231 datetime
- Add test for RPC-POST-V1-01
- test
- fix wrong changes from a merge conflict
- implement RPC-PATCH-V1-01
- Added rule to detect additionalProperties(RPC-Policy-V1-05)
- re-implement rule ImplementPrivateEndpointApis
- disable recent unverified rules (since 5/10/2023) from running in production
- Disable few rules known to be buggy: ResourceMustReferenceCommonTypes, LROPostFinalStateViaProperty, ProvisioningStateMustBeReadOnly
- Add test for ProvisioingStateMustBeReadOnly 
- Fix leftover changes for 'rush build' and 'rush regen-ruleindex'
- implement rule to validate if provisioingState is readOnly
- implement rule to flag usage of obsolete versions of common-types
- Implement RPC-Async-V1-02
- implement rpc_patch_v1_06
- implement RPC-POST-V1-05
- implement RPC_delete_v1_01
- implement RPC-GET-V1-08
- impelement rpc-post-v1-09
- Implement RPC-PUT-V1-11
- Added rule to detect non-default error codes.
- update PatchResponseCodes
- Implement PostResponseCodes(RPC-ASYNC-V1-11)
- Implement PutResponseCodes(RPC-Async-V1-01) 
- Make RPC-Put-V1-25 as an Error for ARM
- Add rule to check that resource definitions are using the common types references for ProxyResource or TrackedResource
- Revert PR 494
- merging linter rules DeleteOperationAsyncResponseValidation and delete-response-codes and removing the checks from long-running-response-status-code as they have conflicting implementations
- fixing documenation and error message for CreateOperationAsyncResponseValidation to be in sync with the implementation
- fixing PutRequestResponseSchemeArm for the case where a model has a property that is empty
- fixing rush build inconsistency
- fix verifyArmPath to account for third party RP namespaces
- removing all code related to ProvisioningStateSpecifiedForLRODelete
- removing dead code for ResourceMustReferenceCommonTypes and LROPostFinalStateViaProperty
- Modified category from warning to error for linter rules LroExtension, LroStatusCodesReturnTypeSchema, DescriptiveDescriptionRequired, ParameterDescriptionRequired
- fixing rpc_patch_v1_02
- fixing generated files due to missed prior rush build
- Added linter rule for RPC-Common-V1-05 and updated documentation for parameter common types rule.
- Add rule that checks for service-defined resource names and ensures they are represented as an enum type with modelAsString set to true, not as a static string in the path
- Added linter rule for RPC-Get-V1-09 that ensures collection GET endpoints have properties `value` and `nextLink`, and no other properties.
- Add a linter rule for RPC-Operations-V1-01 and RPC-Operations-V1-02 to check for operations API at levels other than tenant level (e.g., subscription level).
- Added a linter rule for using the common types operations API response.
- implement RPC-POST-V1-02 and RPC-POST-V1-03 rules"
- Add rt1/rt2/{resourceName} to invalid patterns for RPC-URI-V1-06/RPC-Put-V1-02
- Adding ARM RPC rule RPC-Put-V1-07
- implement rpc-v1-11
- Add linter rule for RPC-SystemData-V1-01
- Add linter rule for RPC-Uri-V1-10 to detect path duplication when using the scope parameter.
- update APIVersionPattern & ValidFormat
- bugfix for 4 rules
- refactor internal names
- Added rule to detect additionalProperties(RPC-Policy-V1-05)
- Added rule to detect PropertiesTypeObjectNoDefinition (RPC-Policy-V1-03)
- Deleted files and context related to rule RPC-Put-V1-11
- Updated linter rule for RPC-Get-V1-09 that ensures collection GET endpoints have properties `value` and `nextLink`, and no other properties.
- Removed the check which is not required as the part of "CreateOperationAsyncResponseValidation" amd removed the RPC-Async-V1-06 rule
- updated existing rule to address FPS RPC-Policy-V1-03

## 1.0.1
Thu, 24 Nov 2022 04:00:42 GMT

### Patches

- fix rule DefinitionsPropertiesNamesCamelCase & validFormats

