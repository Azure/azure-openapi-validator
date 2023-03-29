// ResourceMustReferenceCommonTypes
// Validates that resource definitions use the common types TrackedResource or ProxyResource definitions.
// RPC Code: <not coded yet>

// regex matching paths that end with common-types/resource-management/<version number>/types.json#definitions/<ProxyResource or TrackedResource>
const RESOURCE_COMMON_TYPES_REGEX = /.*common-types\/resource-management\/v\d+\/types.json#\/definitions\/(Proxy|Tracked)Resource/

export const resourceMustReferenceCommonTypes = (ref: any, _opts: any, ctx: any) => {
  console.log("ref: " + ref.toString())
  if (!ref) {
    return []
  }

  const swagger = ctx?.documentInventory?.resolved
  const definitions = swagger?.definitions

  console.log("definitions: " + definitions.toString())

  if (!definitions) {
    return []
  }

  // check the ref for each 200 response of get, put, patch
  // e.g.
  // "responses": {
  //   "200": {
  //     "description": "Successfully updated the PrincipalAssignment.",
  //     "schema": {
  //       "$ref": "#/definitions/ClusterPrincipalAssignment"
  //     }
  //   }
  // },

  // get the resource name using the last word of the ref path
  const resourceName = ref.toString().split("/").pop()
  console.log("resourceName: " + resourceName?.toString())
  // find the resource definition by name, get the references under it
  const allOfRef = definitions[resourceName]?.properties?.allOf
  const path = ["definitions", resourceName]
  const error = [
    {
      message: `Resource definition '${resourceName}' must reference the common types resource definition for ProxyResource or TrackedResource.`,
      path: path,
    },
  ]

  console.log("allOfRef: " + allOfRef?.toString())

  // if there are no refs under the resource definition, error
  if (!allOfRef) {
    return error
  }

  // if any of the refs under the resource definition match the common types regex, return no errors
  for (const refObj of allOfRef) {
    console.log("refObj: " + refObj.toString())
    if (refObj.$ref?.match(RESOURCE_COMMON_TYPES_REGEX)) {
      return []
    }
  }

  // none of the refs under the resource definition match the common types regex, so return an error
  return error
}
