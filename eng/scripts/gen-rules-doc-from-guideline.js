
import { readdirSync, readFileSync, writeFileSync } from "fs";
import {join} from "path";
import { repoRoot } from "./helper.js";

export function genDocs() {
    const docsFile = join(repoRoot,"regression/azure-rest-api-specs/documentation/openapi-authoring-automated-guidelines.md")
    const file = readFileSync(docsFile).toString()
    const docsDir = join(repoRoot,"docs","old")
    const ruleDocs = []
    let ruleStart = false
    let rule = {}
    file.split("\n").forEach(line => {
        if (line.trim().startsWith("### <a name=")) {
            ruleStart = true
            rule = Object.assign({})
            const nameSlices = line.trim().split(" ")
            rule.name = nameSlices[nameSlices.length -1].trim()
            rule.description = ""
            return
        }
        if (line.trim().startsWith("Links: [Index](#index)")) {
            ruleStart = false
            ruleDocs.push(rule)
        }
        if (ruleStart) {
            rule.description += formatDescription(line) + "\n"
        }
    })
    for (const doc of ruleDocs) {
        const ruleContent = `# ${doc.name}

${doc.description}`.trim() + "\n"
        writeFileSync(join(docsDir,doc.name + ".md"),ruleContent)

    }
}
function formatDescription(line) {
    const regexForTitle =  /\*\*(?<subTitle>.+)\*\*.*/
    const match = regexForTitle.exec(line)
    if (match) {
        return `## ${match.groups['subTitle']}\n\n` + line.substring(line.indexOf(":")+1).trim()
    }
    return line
}

genDocs()