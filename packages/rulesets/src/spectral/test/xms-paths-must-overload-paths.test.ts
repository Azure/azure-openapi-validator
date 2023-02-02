import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

beforeAll(async () => {
  linter = await linterForRule("XmsPathsMustOverloadPaths")
  return linter
})

test("XmsPathsMustOverloadPaths should find errors", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        put: {
          operationId: "Path_Create",
          responses: {
            200: {
              description: "Success",
            },
          },
        },
      },
    },
    "x-ms-paths": {
      "/api/Path?op=baz": {
        put: {
          operationId: "Path_Create",
          responses: {
            200: {
              description: "Success",
            },
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].message).toBe(
      `Paths in x-ms-paths must overload a normal path in the paths section, i.e. a path in the x-ms-paths must either be same as a path in the paths section or a path in the paths sections followed by additional parameters.`
    )
    expect(results[0].path.join(".")).toBe("x-ms-paths./api/Path?op=baz")
  })
})

test("XmsPathsMustOverloadPaths should find no errors", () => {
  const myOpenApiDocument = {
    swagger: "2.0",
    paths: {
      "/api/Paths": {
        put: {
          operationId: "Path_Create",
          responses: {
            200: {
              description: "Success",
            },
          },
        },
      },
    },
    "x-ms-paths": {
      "/api/Paths?op=baz": {
        put: {
          operationId: "Path_Create",
          responses: {
            200: {
              description: "Success",
            },
          },
        },
      },
    },
  }
  return linter.run(myOpenApiDocument).then((results) => {
    expect(results.length).toBe(0)
  })
})
