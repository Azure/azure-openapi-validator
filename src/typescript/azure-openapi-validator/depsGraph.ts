import * as _ from "lodash"
import * as path from "path"
import { dirname, isAbsolute } from "path"
const DepGraph = require("dependency-graph").DepGraph
import $RefParser = require("@apidevtools/json-schema-ref-parser")
import glob = require("glob")
import { OpenapiDocument } from "./document"

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
      .slice(-4)
      .join("/")
  }

  getApiVersion(fullPath: string) {
    const segments = fullPath.split(/\\|\//)
    return segments[segments.length - 2]
  }

  public async generateDiagramGraph(folderPath: string) {
    const options = { ignoreCommonType: false, outputReadmeGraph: true }
    await this.scanFolder(folderPath, options)
  }

  private async getReferences(specPath: string): Promise<string[]> {
    const document = await this.cacheDocument(specPath)
    return document.getReference()
    /*
    await this.parser.resolve(specPath)
    const refs = _.uniq(
      this.parser.$refs
        .paths()
        .filter(f => f.indexOf("examples") === -1)
        .map(f => (isAbsolute(f) ? f : path.join(dirname(specPath), f)))
    ) as string[]
    return refs */
  }

  async getDocument(specPath: string) {
    if (this.referenceCache.has(specPath)) {
      return this.referenceCache.get(specPath)
    }
    return await this.cacheDocument(specPath)
  }

  async cacheDocument(specPath: string) {
    const document = new OpenapiDocument(specPath)
    await document.resolve()
    this.referenceCache.set(specPath, document)
    return document
  }

  public dependantsOf(specPath: string) {
    return this.graph.dependantsOf(this.getSimplyPath(specPath))
  }
}
