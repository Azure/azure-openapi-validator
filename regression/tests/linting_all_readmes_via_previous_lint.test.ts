import { runLinter } from "./utils/previous-linting"
import { allIssues, snapshotGroupByCode } from "./utils/snapshot-help"
import { allSpecs } from "./utils/specs-filter"

describe("linting", () => {
  allIssues.splice(0,allIssues.length)
  test.each(allSpecs)("'%s'", runLinter, 1000000)
  test("result group bu rule",()=> {
    snapshotGroupByCode("v2")
  })
})
