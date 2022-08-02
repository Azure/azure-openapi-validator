// Verify the parameters in 'x-ms-parameterized-host' to follow certain rules.
const hostParameters = (parameterizedHost: any, _opts: any, paths: any) => {
  if (parameterizedHost === null || typeof parameterizedHost !== "object") {
    return []
  }
  const path = paths.path || []

  const errors: any = []

  const useSchemePrefix = parameterizedHost.useSchemePrefix ?? true

  const parameters = parameterizedHost.parameters

  if (!useSchemePrefix && parameters && Array.isArray(parameters)) {
    parameters.forEach((p: any, index: number) => {
      const location = p["x-ms-parameter-location"]
      if (p.in === "path" && p["x-ms-skip-url-encoding"] === true && location === "client") {
        if (p.name !== "endpoint") {
          errors.push({
            message: "The host parameter must be called 'endpoint'.",
            path: [...path, "parameters", index],
          })
        }
        if (p.type !== "string" || p.format !== "url") {
          errors.push({
            message: "The host parameter must be typed \"type 'string', format 'url'\".",
            path: [...path, "parameters", index],
          })
        }
      }
    })
  }

  return errors
}

export default hostParameters
