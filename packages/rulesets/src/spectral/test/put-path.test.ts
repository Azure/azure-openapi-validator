import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

beforeAll(async () => {
  linter = await linterForRule("PutPath")
  return linter
})

test("PutPath should find errors", () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/bar/baz": {
        put: {},
      },
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].path.join(".")).toBe("paths./bar/baz")
  })
})

test("PutPath should find no errors", () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/bar/{p1}": {
        put: {
          parameters: [
            {
              name: "p1",
              in: "path",
              type: "string",
              maxLength: 50,
            },
          ],
        },
      },
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0)
  })
})
