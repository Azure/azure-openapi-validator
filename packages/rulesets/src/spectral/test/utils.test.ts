import { getProperties, jsonPath } from "../functions/utils"

test("getProperties return empty object", () => {
  expect(getProperties(undefined)).toEqual({})
})

test("jsonPath return undefined", () => {
  expect(jsonPath(["/"], "string")).toBe(undefined)
})
