
import { readdirSync, readFileSync, writeFileSync } from "fs";
import {join} from "path";
import { repoRoot } from "./helper.js";

export function genDocIndex() {
    const docsDir = join(repoRoot,"docs")
    const files = readdirSync(docsDir,{withFileTypes:true})
    const ruleHeader = `# Azure Rules

There are a number of rules that can be validated with azure openapi validator, they are focused with Azure API specs ( ARM and/or Dataplane).

## Rules

`
    const ruleDocs = []
    files.forEach(file => {
        if (file.isFile() && file.name.endsWith(".md") && file.name !== "rules.md") {
            let ruleDoc = ""
            const lines = readFileSync(join(docsDir,file.name)).toString().split("\n");
            let findDescription = false
            for (const line of lines) {
                if (line.trim().startsWith("# ")) {
                    const ruleName = line.substring(2)
                    ruleDoc += '### ' + ruleName + '\n\n'
                }
                if (findDescription && line.trim().startsWith("## ")) {
                    findDescription = false
                    ruleDoc += `\nPlease refer to [${file.name}](./${file.name}) for details.\n`
                    ruleDocs.push(ruleDoc)
                    break
                }
                if (findDescription && line.trim()) {
                    ruleDoc += line + '\n'
                }
                if (line.trim().startsWith("## Description")) {
                    findDescription = true
                }
            }
        }
    })
    writeFileSync(join(docsDir,"rules.md"), ruleHeader + ruleDocs.join("\n"))
}
genDocIndex()