// RPC Code: RPC-Get-V1-11

function matchAnyPatterns(patterns: RegExp[], path: string) {
  return patterns.every((p) => p.test(path))
}

function verifyNestResourceType(path: string) {
  const patterns = [/^\/subscriptions\/{\w+}\/resourceGroups\/{\w+}\/providers\/\w+\.\w+\/\w+\/{\w+}\/\w+.*/gi]

  return matchAnyPatterns(patterns, path)
}

function verifyResourceType(path: string) {
  const patterns = [/^\/subscriptions\/{\w+}\/resourceGroups\/{\w+}\/providers\/\w+\.\w+\/\w+\/{\w+}.*/gi]

  return matchAnyPatterns(patterns, path)
}

export const validateSegmentsInNestedResourceListOperation: any = (fullPath: any, _opts: any, ctx: any) => {
  const swagger = ctx?.documentInventory?.resolved

  if (fullPath === null || typeof fullPath !== "string" || fullPath.length === 0 || swagger === null) {
    return []
  }

  const otherPaths = Object.keys(swagger.paths).filter((p: string) => p !== fullPath)

  if (verifyNestResourceType(fullPath)) {
    let count = 0

    for (const apiPath of Object.values(otherPaths)) {
      if (verifyResourceType(apiPath)) {
        if (fullPath.includes(apiPath)) {
          count++
          break
        }
      }
    }

    if (count === 0) {
      return [
        {
          message: "A nested resource type's List operation must include all the parent segments in its api path.",
          ctx,
        },
      ]
    }
  }

  return []
}
