import { existsSync, mkdirSync, rmdirSync } from "fs"
import { join } from "path"
import { runLinter } from "./utils/previous-linting"
import { allIssues, snapshotGroupByCode } from "./utils/snapshot-help"
import { allSpecs } from "./utils/specs-filter"

describe("linting", () => {
  allIssues.splice(0,allIssues.length)
  const resultDir = join(__dirname,"__linting_result__","v2")
  if (existsSync(resultDir)) {
    rmdirSync(resultDir,{recursive:true})
    mkdirSync(resultDir)
  }
  test.each(allSpecs)("'%s'", runLinter, 1000000)
  test("result group bu rule",()=> {
    snapshotGroupByCode("v2")
  })
})
