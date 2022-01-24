import { dirname, isAbsolute, join } from "path"
import { fileURLToPath, URL } from "url"
import { normalizePath } from "./document"

export class Resolver {
  private references = new Set<string>()
  constructor(private innerDoc: any, private currentFile: string) {}

  // return resolved doc
  resolve() {
    this.walk(this.innerDoc, ["/"], new Set<any>(), this, this.updateFileRefs)
  }

  updateFileRefs(node: any, path: string[], ctx: any) {
    if (typeof node === "object" && typeof node.$ref === "string") {
      const slices = node.$ref.split("#") as string[]
      if (slices.length === 2 && slices[0] && !isAbsolute(slices[0])) {
        const currentPath = normalizePath(ctx.currentFile)
        const referenceFile = currentPath.split(/\\|\//).slice(0,-1).concat(slices[0]).join("/")
        node.$ref = referenceFile + `#${slices[1]}`

        if (!referenceFile.includes("examples")) ctx.references.add(referenceFile)
      }
      return false
    }
    return true
  }

  walk(obj: unknown, path: string[], visited: Set<any>, context: any, visitor: (obj, path, context) => boolean) {
    if (!obj) {
      return undefined
    }
    if (visited.has(obj)) {
      return
    }
    visited.add(obj)

    if (visitor(obj, path, context) === false) {
      return
    }

    if (Array.isArray(obj)) {
      for (const [index, item] of obj.entries()) {
        this.walk(item, [...path, index.toString()], visited, context, visitor)
      }
    } else if (typeof obj === "object") {
      for (const [key, item] of Object.entries(obj!)) {
        this.walk(item, [...path, key], visited, context, visitor)
      }
    }
  }

  getReferences() {
    return Array.from(this.references.values())
  }
}
