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
export function snapshotGroupByCode() {
   const groupedErrors =  _.groupBy(allIssues,(issue:any)=> issue.code)
   for (const key of Object.keys(groupedErrors)) {
     expect(groupedErrors[key]).toMatchSnapshot(`rule ${key} result`)
   }
}