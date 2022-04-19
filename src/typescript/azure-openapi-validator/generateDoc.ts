require("./index")
import { OpenApiTypes, rules } from "./rule"
import { writeFileSync } from "fs";

const generateDoc = () => {

  const generateOpenapiType = (type:OpenApiTypes)=> {
  let res = ''
  if (type & OpenApiTypes.arm) {
    res += "ARM"
  }
  if (type & OpenApiTypes.rpaas) {
    res += "ARM"
  }
  if (type & OpenApiTypes.dataplane) {
    if (res) {
      res += ' and '
    }
    res += "Data plane"
  }
   res += " OpenAPI(swagger) specs"
   return res
  }

  rules.forEach(rule => {
    const dateStr = new Date(Date.now()).toLocaleString('default', { month: 'long',day:"numeric",year:"numeric" })
    let doc = ''
    doc += `### <a name="${rule.id.toLowerCase()}"></a>${rule.id} ${rule.name}\n`
    doc += `**Applies to** : ${generateOpenapiType(rule.openapiType)}\n`
    doc += `**Output Message** : \n`
    doc += `**Description**: \n`
    doc += `**CreatedAt**: ${dateStr}\n`
    doc += `**LastModifiedAt**: ${dateStr}\n`
    doc += `**Why this rule is important**:\n`
    doc += `**How to fix the violation**\n`
    doc += `Good Example: \n`
    doc += `Bad Example: \n`
    doc += `Links: [Index](#index) | [Error vs. Warning](#error-vs-warning) | [Automated Rules](#automated-rules) | [ARM](#arm-violations): [Errors](#arm-errors) or [Warnings](#arm-warnings) | [SDK](#sdk-violations): [Errors](#sdk-errors) or [Warnings](#sdk-warnings)`
    const docFileName = `${__dirname}/docs/${rule.id}.md`
    writeFileSync(docFileName,doc)
  });
}

generateDoc()