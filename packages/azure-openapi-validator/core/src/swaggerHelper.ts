import $RefParser, { FileInfo } from "@apidevtools/json-schema-ref-parser"
import _ from "lodash"
import {isExample, traverse } from "./utils"
import { ISwaggerInventory, ISwaggerHelper } from "./types"
export class SwaggerHelper implements ISwaggerHelper {
  private schemaCaches = new Map<string, any>()
  constructor(private specPath: string, private inventory?: ISwaggerInventory) {
  }

  private resolveExternalRef = async (ref: string) => {
    if (ref && this.schemaCaches.has(ref)) {
      return this.schemaCaches.get(ref)
    }
    const inventory = this.inventory
    const resolveOption: $RefParser.Options = {
      resolve: {
        file: {
          canRead: true,
          read(file: FileInfo) {
            if (isExample(file.url)) {
              return ""
            }
            return inventory?.getSingleDocument(file.url)
          }
        }
      }
    }


    const resolvedSchema = await $RefParser.dereference({ $ref: ref }, resolveOption)
    this.schemaCaches.set(ref, resolvedSchema)
    return resolvedSchema
  }

  static isExternalRef(schema: any) {
    return schema.$ref && !schema.$ref.startsWith("#/")
  }

  public getResolvedRef(ref: string) {
    return this.schemaCaches.get(ref)
  }

  public async resolveSchema(schema: any | string) {
    if (!schema) {
      return schema
    }

    if (SwaggerHelper.isExternalRef(schema)) {
      return await this.resolveExternalRef(schema.$ref)
    }

    if (typeof schema === "string") {
      schema = {
        $ref: schema
      }
    } else {
      schema = _.cloneDeep(schema)
    }

    const replace = (to: any, from: any) => {
      if (!to || !from) {
        return
      }
      delete to.$ref
      Object.entries(from).forEach(v => {
        to[v[0]] = v[1]
      })
    }

    const collectRefs = (schema: any) => {
      const refs = new Set<string>()
      traverse(schema, ["/"], new Set<string>(), {}, (current, path, ctx) => {
        if (SwaggerHelper.isExternalRef(current)) {
          refs.add(current.$ref)
          return false
        }
        return true
      })
      return Array.from(refs.values())
    }

    const promises = []
    for (const ref of collectRefs(schema)) {
      promises.push(this.resolveExternalRef(ref))
    }
    await Promise.all(promises)

    traverse(schema, ["/"], new Set<string>(), this, (current, path, ctx) => {
      if (SwaggerHelper.isExternalRef(current)) {
        const resolved = ctx.getResolvedRef(current.$ref)
        replace(current, resolved)
        return false
      }
      return true
    })
    return schema
  }

  getSpecPath() {
    return this.specPath
  }
}
