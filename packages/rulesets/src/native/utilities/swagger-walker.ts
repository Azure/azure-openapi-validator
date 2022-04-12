import { SwaggerInventory } from "@microsoft.azure/openapi-validator-core";
import {nodes} from "./jsonpath"
type WalkCallBack = (path:string[],value:any,root:any)=>void
export class SwaggerWalker {
  constructor(private inventory : SwaggerInventory) {
  }

  private interanlWalkOnDocuments(documents:any[],paths:string[],cb:WalkCallBack) {
     for (const doc of documents) {
      for (const path of paths) {
        const result = nodes(doc,path)
        cb(result.path, result.value,doc)
      }
    }
  }

  public WarkOnJsonPathForAllDocuments(paths:string[],current:string,cb:WalkCallBack ) {
    const documents = this.inventory.referencesOf(current).values()
    this.interanlWalkOnDocuments(Object.values(documents),paths,cb)
  }

  public WarkOnJsonPathForReferencedDocuments(paths:string[],cb:WalkCallBack ) {
    const documents = Object.values(this.inventory.getDocuments())
    this.interanlWalkOnDocuments([...documents],paths,cb)
  }

  public WarkOnJsonPathForAllDocumentExceptCurrent(paths:string[],current:string,cb:WalkCallBack ) {
    const documentsRecord = this.inventory.getDocuments()
    let documents 
    if (documentsRecord[current]) {
      documents = Object.entries(documentsRecord).filter(pair=>pair[0] !== current).map(pair=>pair[1])
    }
    else {
      documents = Object.values(documentsRecord)
    }
    
    this.interanlWalkOnDocuments(documents,paths,cb)
  }
}