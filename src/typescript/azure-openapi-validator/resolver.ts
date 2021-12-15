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
    this.walk(this.innerDoc, ["/"], new Set<any>(), this.updateFileRefs)
  }

  updateFileRefs(node: any, path: string[]) {
    if (typeof node === "object" && typeof node.$ref === "string") {
      const slices = node.$ref.split("#") as string[]
      if (slices.length === 2 && slices[0] && !isAbsolute(slices[0])) {
        node.$ref =
          join(dirname(this.currentFile), slices[0])
            .split(/\\|\//)
            .join("/") + `#${slices[1]}`

        if (!node.$ref.includes("examples")) this.references.add(node.$ref)
      }
      return false
    }
    return true
  }

  walk(obj: unknown, path: string[], visited: Set<any>, visitor: (obj, path) => boolean) {
    if (!obj) {
      return undefined
    }
    if (visited.has(obj)) {
      return
    }
    visited.add(obj)

    if (visitor(obj, path) === false) {
      return
    }

    if (Array.isArray(obj)) {
      for (const [index, item] of obj.entries()) {
        this.walk(item, [...path, index.toString()], visited, visitor)
      }
    } else if (typeof obj === "object") {
      for (const [key, item] of Object.entries(obj!)) {
        this.walk(item, [...path, key], visited, visitor)
      }
    }
  }

  getReferences() {
    return this.references
  }
}
