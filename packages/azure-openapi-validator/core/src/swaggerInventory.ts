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
  constructor(private fileSystem:IFileSystem = defaultFileSystem){
  }

  public getSingleDocument(specPath: string) {
    return this.getDocument(specPath)?.getObj()
  }

  public getDocumentContent(specPath: string) {
    return this.getDocument(specPath)?.getContent()
  }

  public getDocument(specPath: string) {
    const urlPath = normalizePath(specPath)
    if (this.referenceCache.has(urlPath)) {
      return this.referenceCache.get(urlPath)
    }
    throw new Error(`No cached file:${specPath}`)
  }

  public referencesOf(specPath: string): string[]{
    return this.inventory.dependantsOf(normalizePath(specPath))
  }

  public getAllDocuments(): Map<string, any> {
      return this.allDocs
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

  async loadDocument(specPath: string) {
    const urlPath = normalizePath(specPath)
    let cache = this.referenceCache.get(urlPath)
    if (cache) {
      return cache
    }
    cache = await this.cacheDocument(urlPath)
    const references = cache.getReferences()
    const promises = []
    for (const ref of references) {
      promises.push(this.cacheDocument(ref))
    }
    await Promise.all(promises)
    return cache
  }

  async cacheDocument(specPath: string) {
    const parser = new JsonParser()
    const document = new OpenapiDocument(specPath, parser,this.fileSystem)
    await document.resolve()
    this.referenceCache.set(specPath, document)
    this.allDocs.set(specPath,document.getContent())
    return document
  }

}
