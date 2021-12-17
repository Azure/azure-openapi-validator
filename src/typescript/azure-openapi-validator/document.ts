import { readFileSync } from "fs"
import { Resolver } from "./resolver"

export class OpenapiDocument {
  private _specPath = undefined
  private _content = undefined
  private _doc = undefined
  private resolver
  constructor(specPath: string) {
    this._specPath = specPath
  }
  async resolve() {
    this._content = readFileSync(this._specPath).toString()
    this._doc = JSON.parse(this._content)
    this.resolver = new Resolver(this._doc, this._specPath)
    await this.resolver.resolve()
  }
  getObj() {
    return this._doc
  }

  getReferences() {
    return this.resolver.getReferences()
  }
  getDocumentPath() {}
  getPositionFromJsonPath(jsonPath: string[]) {}
}

export const normalizeDocPath = (path: string) => {
  return path.split(/\\|\//).join("/")
}
