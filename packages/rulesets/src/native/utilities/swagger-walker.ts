import { ISwaggerInventory } from "@microsoft.azure/openapi-validator-core"
import { nodes } from "./jsonpath"
type WalkCallBack = (path: string[], value: any, rootPath: string, root: any) => void
export class SwaggerWalker {
  constructor(private inventory: ISwaggerInventory) {}

  private _walkOnDocuments(documents: any[], paths: string[], cb: WalkCallBack) {
    for (const doc of documents) {
      for (const path of paths) {
        const results = nodes(doc[1], path)
        if (results && results.length) {
          for (const result of results) {
            cb(result.path, result.value, doc[0], doc[1])
          }
        }
      }
    }
  }

  public warkReferenced(paths: string[], current: string, cb: WalkCallBack) {
    const documents = this.inventory.referencesOf(current).values()
    this._walkOnDocuments(Object.values(documents), paths, cb)
  }

  public warkAll(paths: string[], cb: WalkCallBack) {
    const documents = Object.entries(this.inventory.getDocuments())
    this._walkOnDocuments([...documents], paths, cb)
  }

  public warkAllExcept(paths: string[], excepts: string[] | string, cb: WalkCallBack) {
    const documentsRecord = this.inventory.getDocuments()
    let documents
    excepts = Array.isArray(excepts) ? excepts : [excepts]
    if (excepts.length) {
      documents = Object.entries(documentsRecord).filter((pair) => excepts.includes(pair[0]))
    } else {
      documents = Object.values(documentsRecord)
    }

    this._walkOnDocuments(documents, paths, cb)
  }
}
