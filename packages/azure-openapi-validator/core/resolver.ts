import { isAbsolute, join } from "path"
import { isExample, normalizePath, traverse } from "./utils"

export class Resolver {
  private references = new Set<string>()
  constructor(private innerDoc: any, private currentFile: string) {}

  // return resolved doc
  async resolve() {
    await traverse(this.innerDoc, ["/"], new Set<any>(), this, this.updateFileRefs)
  }

  updateFileRefs(node: any, path: string[], ctx: any) {
    if (typeof node === "object" && typeof node.$ref === "string") {
      const slices = node.$ref.split("#") as string[]
      if (slices.length === 2 && slices[0] && !isAbsolute(slices[0])) {
        const currentPath = normalizePath(ctx.currentFile)
        const referenceFile = join(
          ...currentPath
            .split(/\\|\//)
            .slice(0, -1)
            .concat(slices[0])
        ).replace(/\\/g, "/")
        node.$ref = referenceFile + `#${slices[1]}`

        if (!isExample(referenceFile)) ctx.references.add(referenceFile)
      }
      return false
    }
    return true
  }

  getReferences() {
    return Array.from(this.references.values())
  }
}
