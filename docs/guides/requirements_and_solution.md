
# Linter requirements & thoughts

## key questions needs to focus

- manage rulesets independently with review process
  props:
     different teams can be responsible for each.
     better to partner ARM team to develop consistence shared rules

- where to place ruleset ?
  azure-rest-api-repos
  azure-openapi-validator 
  azure-api-style-guide

- how to support multiple swagger rules
   merging swagger  ?
     many conflicts in autorest v2 version
   travellig swaggers in rule ?
   push service to update their swagger ?

- how to use autorest v3?
  - lint before transforms
  - lint after transforms
  - does not use it. replaced by some other tools ?

- which linter 
  - spectral
  - azure-openapi-validator
  - both

- how we can share it effectively with our service teams to help them improve their api documentation without incurring breaking changes.


## autorest transformation cases

1. https://github.com/Azure/azure-rest-api-specs/blob/main/specification/monitor/resource-manager/readme.md

This section is a temporary solution to resolve the failure in those pipeline that is still using modeler v1.
directive:
- from: activityLogAlerts_API.json
  where: $.definitions
  transform: delete $["Resource"]

2. Don't expose the GET endpoint since it's behavior is more limited than POST
specification\operationalinsights\data-plane\readme.md

3. specification\policyinsights\resource-manager\readme.md
 transform: delete $['x-ms-paths']
    reason: other languages which still use track1 does not support remove '/' for 'next_link'

4. C:\code\azure-rest-api-specs\specification\applicationinsights\resource-manager\readme.typescript.md
  # Duplicate OperationId Operations_List is detected in Microsoft.Insights/stable/2015-05-01/aiOperations_API.json and Microsoft.Insights/preview/2020-06-02-preview/livetoken_API.json
    from: aiOperations_API.json
    where: $.paths
    transform: delete $["/providers/Microsoft.Insights/operations"]