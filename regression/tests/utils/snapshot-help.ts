import { writeFileSync } from "fs"
import { join } from "path"
import { glob } from "glob"
import _ from "lodash"

export const allIssues:any[] = []
export function toMatchSnapshotForEachCode(issues:any[]) {
  let containsInvalidResult = false
  issues.forEach((issue:any)=> {
    if (!issue.code) {
      containsInvalidResult = true
    }
    allIssues.push(issue)
  })
  if (containsInvalidResult) {
    expect(issues).toMatchSnapshot("has invalid result")
  }
}
export function snapshotGroupByCode(version:"v2"|"v3") {
   const groupedErrors =  _.groupBy(allIssues,(issue:any)=> issue.code)
   for (const key of Object.keys(groupedErrors)) {
     const sortedIssues = _.uniqWith(groupedErrors[key],_.isEqual).sort((a:any, b:any) => {
          let isLess = 0
          ;["id", "message", "jsonpath","source"].some((key:string) => {
            if (a[key] !== b[key]) {
              isLess = a[key] < b[key] ? -1 : 1
              return true
            }
            return false
          })
          return isLess
        })
     expect(sortedIssues).toMatchSnapshot(`rule ${key} result`)
     if (key){
       writeLintingResult(sortedIssues,key,version)
     }
   }
}
const baseFolder = `tests/__linting_result__`

export function getLintResult(version:"v2"|"v3") {
  const resultFolder = join(baseFolder,version,"*.json")
  const resultFiles = glob.sync(resultFolder)
  return resultFiles
}

function writeLintingResult(issues:any[],ruleName:string,version:"v2"|"v3") {
  const resultFile = join(baseFolder,version,`${ruleName}.json`)
  writeFileSync(resultFile,JSON.stringify(issues,null,2))
}