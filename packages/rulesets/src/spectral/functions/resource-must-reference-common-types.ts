// ResourceMustReferenceCommonTypes
// Validates that resource definitions use the common types TrackedResource or ProxyResource definitions.
// RPC Code: <not coded yet>

// regex matching paths that end with common-types/resource-management/<version number>/types.json#definitions/<ProxyResource or TrackedResource>
const RESOURCE_COMMON_TYPES_REGEX = /.*common-types\/resource-management\/v\d+\/types.json#\/definitions\/(Proxy|Tracked)Resource/

export const resourceMustReferenceCommonTypes = (ref: any, _opts: any, ctx: any) => {
  if (!ref) {
    return []
  }

  const swagger = ctx?.documentInventory?.resolved
  const definitions = swagger?.definitions

  if (!definitions) {
    return []
  }

  // get the resource name using the last word of the ref path
  const resourceName = ref.toString().split("/").pop()
  // find the resource definition by name, get the references under it
  const allOfRef = definitions[resourceName]?.properties?.allOf
  const path = ["definitions", resourceName]
  const error = [
    {
      message: `Resource definition '${resourceName}' must reference the common types resource definition for ProxyResource or TrackedResource.`,
      path: path,
    },
  ]

  // if there are no refs under the resource definition, error
  if (!allOfRef) {
    return error
  }

  // if any of the refs under the resource definition match the common types regex, return no errors
  for (const refObj of allOfRef) {
    if (refObj.$ref?.match(RESOURCE_COMMON_TYPES_REGEX)) {
      return []
    }
  }

  // none of the refs under the resource definition match the common types regex, so return an error
  return error
}
