import {forEachProject} from './helper.js'
import { npmForEach } from './helper.js'
function main () {
   forEachProject((packageName, projectFolder, project, each)=>{
     npmForEach("test")
   })
}
main()