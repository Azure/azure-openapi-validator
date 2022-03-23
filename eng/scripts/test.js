import {forEachProject} from './helper.js'
import { run } from './helper.js'
function main () {
    let errorCnt = 0
    forEachProject((packageName, projectFolder, project, each)=>{
    try {
        process.chdir(projectFolder)
        run("npm",["run","test"])
    }
    catch(e) {
        errorCnt++
    }
    })
    process.exitCode = errorCnt
}
main()