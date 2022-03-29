import { run } from './helper.js'
function main () {
    process.chdir("regression")
    run("npm",["run","test"])
}
main()