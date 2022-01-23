import * as _ from "lodash"
import * as path from "path"
const DepGraph = require("dependency-graph").DepGraph
import $RefParser = require("@apidevtools/json-schema-ref-parser")
import glob = require("glob")
import { normalizePath, OpenapiDocument } from "./document"
import { JsonParser } from "./jsonParser"
import { isAbsolute, normalize } from "path"
import url from "url"

export class DocumentDependencyGraph {
  private graph = new DepGraph()
  parser = new $RefParser()
  private referenceCache = new Map<string, OpenapiDocument>()
  private referenceSet = new Set<string>()

  public async scanFolder(folderPath: string, options: any) {
    const specPaths: string[] = glob.sync(path.join(folderPath, "**/*.json"), {
      ignore: ["**/examples/**/*.json"]
    })
    for (const spec of specPaths) {
      const simpleSpec = normalizePath(spec)
      this.createIfNotExists(simpleSpec)

      const refs = await this.getReferences(spec)
      for (const ref of refs) {
        if (options.ignoreCommonType && ref.match(/.*common-types[\\|\/]resource\-management[\\|\/]v\d[\\|\/].+\.json$/)) {
          continue
        }
        const simpleRef = normalizePath(ref)
        this.createIfNotExists(simpleRef)

        if (simpleRef !== simpleSpec) {
          this.graph.addDependency(simpleSpec, simpleRef)
        }
      }
    }
  }

  createIfNotExists(node: string) {
    if (!this.graph.hasNode(node)) {
      this.graph.addNode(node)
      this.referenceSet.add(node)
    }
  }

  getApiVersion(fullPath: string) {
    const segments = fullPath.split(/\\|\//)
    return segments[segments.length - 2]
  }

  public async generateGraph(folderPath: string) {
    const options = { ignoreCommonType: false, outputReadmeGraph: true }
    await this.scanFolder(folderPath, options)
  }

  private async getReferences(specPath: string): Promise<string[]> {
    const document = await this.cacheDocument(normalizePath(specPath))
    return document.getReferences()
  }

  async loadDocument(specPath: string) {
    if (!isAbsolute(specPath)) {
      specPath = normalize(specPath)
    }
    const urlPath = normalizePath(specPath)
    if (this.referenceCache.has(urlPath)) {
      return this.referenceCache.get(urlPath)
    }
    return await this.cacheDocument(urlPath)
  }

  getDocument(specPath: string) {
    const urlPath = normalizePath(specPath)
    if (this.referenceCache.has(urlPath)) {
      return this.referenceCache.get(urlPath)
    }
    throw new Error(`No cached file:${specPath}`)
  }

  async cacheDocument(specPath: string) {
    const parser = new JsonParser()
    const document = new OpenapiDocument(specPath, parser)
    await document.resolve()
    this.referenceCache.set(specPath, document)
    return document
  }

  public dependantsOf(specPath: string) {
    return this.graph.dependantsOf(normalizePath(specPath))
  }

  public dependenciesOf(specPath: string) {
    return this.graph.dependenciesOf(normalizePath(specPath))
  }

  public getDocFromJsonRef(ref: string) {
    const urlPath = normalizePath(ref)
    if (this.referenceCache.has(urlPath)) {
      return this.referenceCache.get(urlPath)
    }
    return undefined
  }
}
