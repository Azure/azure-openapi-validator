import { createRulesetFunction } from '@stoplight/spectral-core';

// given a path object key for ARM resource in swagger , validate the path is valid.
/**
 * valid paths samples:
 * 1 /<scope>/providers
 * 2 /subscriptionId/{subscriptionID}/providers/{providerName}/resourceType/{resourceTypeName}
 * 3 /subscriptionId/{subscriptionID}/resourceGroups/{resourceGroupName}/providers/{providerName}/resourceType/{resourceTypeName}
 * 4 /subscriptionId/{subscriptionID}/resourceGroups/{resourceGroupName}/providers/{providerName}/{resourceType}/{resourceName}/providers/{providerName}/extensionResourceType/{extensionResourceName}
 *
 */

function matchAnyPatterns(patterns: RegExp[], path: string) {
  return patterns.some((p) => p.test(path))
}
function notMatchPatterns(patterns: RegExp[], path: string) {
  return patterns.every((p) => !p.test(path))
}

function verifyResourceGroup(path: string) {
  const lowerCasePath = path.toLowerCase()
  if (lowerCasePath.includes("/resourcegroups/") && !lowerCasePath.includes("/resourcegroups/{resourcegroupname}")) {
    return false
  }
  return true
}

function verifySubscriptionId(path: string) {
  const lowerCasePath = path.toLowerCase()
  if (lowerCasePath.includes("/subscriptions/") && !lowerCasePath.includes("/subscriptions/{subscriptionid}")) {
    return false
  }
  return true
}

function verifyResourceGroupScope(path: string) {
  // valid patterns:
  // 1 /<scope>/providers/Microsoft.Compute/virtualMachine/{vmName}
  // 2 /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachine/{vmName}
  // 3 /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachine/{vmName}/providers/Microsoft.Billing/extensions/{extensionName}
  const patterns = [
    /^\/subscriptions\/{subscriptionId}\/resourceGroups\/{resourceGroupName}\/providers\/.+/gi,
    /^\/?{\w+}\/resourceGroups\/{resourceGroupName}\/providers\/.+/gi,
    /^\/?{\w+}\/providers\/.+/gi,
  ]
  return matchAnyPatterns(patterns, path)
}
function verifyResourceType(path: string) {
  // invalid paths:
  //  1 <scope>/providers/Microsoft.Compute/{vmName}
  //  2 <scope>/providers/{resourceName}...
  //  3 <scope>/providers/ResourceType/...
  //  4 /providers/Microsoft.Compute/{vmName}
  const patterns = [/^.*\/providers\/microsoft\.\w+\/\w+.*/gi]
  return matchAnyPatterns(patterns, path)
}

function verifyNestResourceType(path: string) {
  // invalid patterns:
  // 1 <scope>/providers/Microsoft.Compute/virtualMachine/{vmName}/nestedResourceType/actions
  // 2 <scope>/providers/Microsoft.Compute/virtualMachine/{vmName}/{nestedResourceType}

  const patterns = [
    /^.*\/providers\/microsoft\.\w+\/\w+\/{\w+}(?:\/\w+\/(?!default)\w+){1,2}$/gi,
    /^.*\/providers\/microsoft\.\w+(?:\/\w+\/(default|{\w+})){1,2}(?:\/\w+\/(?!default)\w+)+$/gi,
    /^.*\/providers\/microsoft\.\w+\/\w+\/{\w+}(?:\/{\w+})+.*$/gi,
  ]
  return notMatchPatterns(patterns, path)
}

export type Options = {
  schema: Record<string, unknown>;
};
/**
 *
 * @param fullPath path key for ARM resource in swagger
 * @param _opts object containing options for the rule: {
 *    segmentToCheck: "resourceGroupParam", "subscriptionIdParam", "resourceType", "nestedResourceType"
 * }
 * @param paths
 * @returns
 */

export const verifyArmPath = createRulesetFunction<unknown, Options>(
  {
    input: null,
    options: {
      type: 'object',
      properties: {
        segmentToCheck: {
          oneOf: [
          {
            type:"string",
            enum: ["resourceGroupParam", "subscriptionIdParam", "resourceType", "nestedResourceType","resourceGroupScope"]
          },
          {
            type:"array",
            items: {
               type:"string",
               "enum": ["resourceGroupParam", "subscriptionIdParam", "resourceType", "nestedResourceType","resourceGroupScope"]
            }
          }]
        },
      },
      additionalProperties: false,
    },
  }, (fullPath: any, _opts: any, paths: any) => {
  if (fullPath === null || typeof fullPath !== "string") {
    return []
  }

  const path = paths.path || []

  const errors: any[] = []

  const optionsHandlers = {
    resourceType: (fullPath: string) => {
      if (!verifyResourceType(fullPath)) {
        errors.push({
          message: `The path for the CURD methods do not contain a resource type.`,
          path,
        })
      }
    },
    nestedResourceType: (fullPath: string) => {
      if (!verifyNestResourceType(fullPath)) {
        errors.push({
          message: `The path for nested resource doest not meet the valid resource pattern.`,
          path,
        })
      }
    },
    resourceGroupParam: (fullPath: string) => {
      if (!verifyResourceGroup(fullPath)) {
        errors.push({
          message: `The path for resource group scoped CRUD methods does not contain a resourceGroupName parameter.`,
          path,
        })
      }
    },
    subscriptionIdParam: (fullPath: string) => {
      if (!verifySubscriptionId(fullPath)) {
        errors.push({
          message: `The path for the subscriptions scoped CRUD methods do not contain the subscriptionId parameter.`,
          path,
        })
      }
    },
    resourceGroupScope: (fullPath: string) => {
      if (!verifyResourceGroupScope(fullPath)) {
        errors.push({
          message: "",
          path,
        })
      }
    },
  }
  const segments = typeof _opts.segmentToCheck === "string" ? [_opts.segmentToCheck] : _opts.segmentToCheck
  segments.forEach((segment: string) => {
    optionsHandlers[segment](fullPath)
  })
  return errors
}
)

export default verifyArmPath
