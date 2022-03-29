import {forEachProject} from './helper.js'
import { run } from './helper.js'
function main () {
    let errorCnt = 0
    forEachProject((packageName, projectFolder, project, each)=>{
    try {
        if (!packageName.includes("regression")) {
            process.chdir(projectFolder)
            run("npm",["pack"])
        }
   
    }
    catch(e) {
        errorCnt++
    }
    })
    process.exitCode = errorCnt
}
main()