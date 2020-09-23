import { runLinter } from "./linting"
import { allSpecs } from "./specsFilter"

describe("validate all readme files", () => {
  test.each(allSpecs)("'%s'", runLinter, 1000000)
})
