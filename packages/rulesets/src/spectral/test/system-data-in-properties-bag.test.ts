import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

beforeAll(async () => {
  linter = await linterForRule("SystemDataInPropertiesBag")
  return linter
})

test("", async () => {
  const oasDoc = {}
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].path.join(".")).toBe("")
    expect(results[0].message).toBe("")
  })
})
