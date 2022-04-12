// @ts-nocheck
import * as _ from "lodash"
import * as path from "path"
const DepGraph = require("dependency-graph").DepGraph
import glob = require("glob")
import { OpenapiDocument } from "./document"
import { JsonParser } from "./jsonParser"
import { isAbsolute, normalize } from "path"
import { defaultFileSystem, normalizePath } from "./utils"
import { ISwaggerInventory,IFileSystem } from "./types"
export class SwaggerInventory implements ISwaggerInventory {
  private inventory = new DepGraph()
  private referenceCache = new Map<string, OpenapiDocument>()
  private allDocs = new Map<string, any>()
  private docRecords:Record<string,any> = undefined
  constructor(private fileSystem:IFileSystem = defaultFileSystem){
  }

  public getSingleDocument(specPath: string) {
    return this.getInternalDocument(specPath)?.getObj()
  }

  public getDocumentContent(specPath: string) {
    return this.getInternalDocument(specPath)?.getContent()
  }

  public getInternalDocument(specPath: string) {
    const urlPath = normalizePath(specPath)
    if (this.referenceCache.has(urlPath)) {
      return this.referenceCache.get(urlPath)
    }
    throw new Error(`No cached file:${specPath}`)
  }

  public referencesOf(specPath: string): string[]{
    const result :Record<string,any> = []
    const references = this.inventory.dependantsOf(normalizePath(specPath))
    for (const ref of references) {
      result[ref] = this.allDocs.get(ref)
    }
    return result
  }

  public getDocuments(docPath?:string): Record<string, any> | any {
    if (docPath) {
      return this.getSingleDocument(docPath)
    }
    if (!this.docRecords) {
      this.docRecords = {}
      for (cosnt [key,value] of this.allDocs.entries()) {
        docs.key = value
      }
    }
    return this.docRecords
   
  }

  private dependenciesOf(specPath: string) {
    return this.inventory.dependenciesOf(normalizePath(specPath))
  }

  private createIfNotExists(node: string) {
    if (!this.inventory.hasNode(node)) {
      this.inventory.addNode(node)
    }
  }

  private async getReferences(specPath: string): Promise<string[]> {
    const document = await this.cacheDocument(normalizePath(specPath))
    return document.getReferences()
  }

  async loadDocument(specPath: string): Promise<any> {
    const urlPath = normalizePath(specPath)
    let cache = this.referenceCache.get(urlPath)
    if (cache) {
      return cache
    }
    cache = await this.cacheDocument(urlPath)
    return cache
  }

  async cacheDocument(specPath: string) {
    let cache = this.allDocs.get(specPath)
    if (cache) {
      return cache
    }
    const parser = new JsonParser()
    const document = new OpenapiDocument(specPath, parser,this.fileSystem)
    await document.resolve()
    this.referenceCache.set(specPath, document)
    this.allDocs.set(specPath,document.getContent())
    const references = document.getReferences()
    for (const ref of references) {
      if (!this.allDocs.has(ref)) {
        await this.cacheDocument(ref)
      }
    }
    return document
  }

}
