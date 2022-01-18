import * as _ from "lodash"
import * as path from "path"
const DepGraph = require("dependency-graph").DepGraph
import $RefParser = require("@apidevtools/json-schema-ref-parser")
import glob = require("glob")
import { OpenapiDocument } from "./document"
import { JsonParser } from "./jsonParser"
import { isAbsolute, normalize } from "path"

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
      const simpleSpec = this.getSimplyPath(spec)
      this.createIfNotExists(simpleSpec)

      const refs = await this.getReferences(spec)
      for (const ref of refs) {
        if (options.ignoreCommonType && ref.match(/.*common-types[\\|\/]resource\-management[\\|\/]v\d[\\|\/].+\.json$/)) {
          continue
        }
        const simpleRef = this.getSimplyPath(ref)
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

  getSimplyPath(fullPath: string) {
    return fullPath
      .split(/\\|\//)
      .join("/")
      .split("#")[0]
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
    const document = await this.cacheDocument(specPath)
    return document.getReferences()
  }

  async loadDocument(specPath: string) {
    if (!isAbsolute(specPath)) {
      specPath = normalize(specPath)
    }
    const simplePath = this.getSimplyPath(specPath)
    if (this.referenceCache.has(simplePath)) {
      return this.referenceCache.get(simplePath)
    }
    return await this.cacheDocument(simplePath)
  }

  getDocument(specPath: string) {
    const simplePath = this.getSimplyPath(specPath)
    if (this.referenceCache.has(simplePath)) {
      return this.referenceCache.get(simplePath)
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
    return this.graph.dependantsOf(this.getSimplyPath(specPath))
  }

  public dependenciesOf(specPath: string) {
    return this.graph.dependenciesOf(this.getSimplyPath(specPath))
  }

  public getDocFromJsonRef(ref: string) {
    const simplePath = this.getSimplyPath(ref)
    if (this.referenceCache.has(simplePath)) {
      return this.referenceCache.get(simplePath)
    }
    return undefined
  }
}
