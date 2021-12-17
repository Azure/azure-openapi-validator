import { dirname, isAbsolute, join } from "path"

export class Resolver {
  private innerDoc: any
  private currentFile: string
  private references = new Set<string>()
  constructor(documentDefinition: any, currentFile: string) {
    this.innerDoc = documentDefinition
    this.currentFile = currentFile
  }

  // return resolved doc
  resolve() {
    this.walk(this.innerDoc, ["/"], new Set<any>(), this, this.updateFileRefs)
  }

  updateFileRefs(node: any, path: string[], ctx: any) {
    if (typeof node === "object" && typeof node.$ref === "string") {
      const slices = node.$ref.split("#") as string[]
      if (slices.length === 2 && !isAbsolute(slices[0])) {
        const referenceFile = join(dirname(ctx.currentFile), slices[0])
          .split(/\\|\//)
          .join("/")
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
    return this.references
  }
}
