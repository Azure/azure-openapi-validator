import { runLinter } from "./utils/linting"
import { allIssues, snapshotGroupByCode } from "./utils/snapshot-help"
import { allSpecs } from "./utils/specs-filter"

allIssues.splice(0,allIssues.length)

describe("linting", () => {
  test.each(allSpecs)("'%s'", runLinter, 1000000)

  test("result group by rule",()=> {
    snapshotGroupByCode()
  })
})
