import { dirname, isAbsolute, join } from "path"
import { normalizePath } from "./swaggerUtils"

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

        if (!referenceFile.includes("examples")) ctx.references.add(referenceFile)
      }
      return false
    }
    return true
  }

  getReferences() {
    return Array.from(this.references.values())
  }
}
export function traverse(obj: unknown, path: string[], visited: Set<any>, options: any, visitor: (obj, path, context) => boolean) {
  if (!obj) {
    return undefined
  }
  if (visited.has(obj)) {
    return
  }
  visited.add(obj)

  if (visitor(obj, path, options) === false) {
    return
  }

  if (Array.isArray(obj)) {
    for (const [index, item] of obj.entries()) {
      traverse(item, [...path, index.toString()], visited, options, visitor)
    }
  } else if (typeof obj === "object") {
    for (const [key, item] of Object.entries(obj!)) {
      traverse(item, [...path, key], visited, options, visitor)
    }
  }
}
