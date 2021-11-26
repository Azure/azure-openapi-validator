/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { safeLoad } from "js-yaml"
import { run } from "./azure-openapi-validator"
import { MergeStates, OpenApiTypes } from "./azure-openapi-validator/rule"
import { AutoRestPluginHost } from "./jsonrpc/plugin-host"

async function main() {
  const pluginHost = new AutoRestPluginHost()
  pluginHost.Add("openapi-validator", async initiator => {
    const files = await initiator.ListInputs()
    const mergeState: string = await initiator.GetValue("merge-state")
    const openapiType: string = await initiator.GetValue("openapi-type")
    let subType: string = await initiator.GetValue("openapi-subtype")
    subType = subType === "providerHub" ? "rpaas" : subType
    for (const file of files) {
      initiator.Message({
        Channel: "verbose",
        Text: `Validating '${file}'`
      })

      try {
        const openapiDefinitionDocument = await initiator.ReadFile(file)
        const openapiDefinitionObject = safeLoad(openapiDefinitionDocument)
        await run(
          file,
          openapiDefinitionObject,
          initiator.Message.bind(initiator),
          // tslint:disable-next-line: no-bitwise
          subType === "rpaas" ? OpenApiTypes[subType] | OpenApiTypes[openapiType] : OpenApiTypes[openapiType],
          MergeStates[mergeState]
        )
      } catch (e) {
        initiator.Message({
          Channel: "fatal",
          Text: `Failed validating: '${file}', error encountered: ` + e
        })
      }
    }
  })

  pluginHost.Add("modelerfour-consumer", async initiator => {
    const files = await initiator.ListInputs()
    for (const file of files) {
      initiator.Message({
        Channel: "verbose",
        Text: `Validating '${file}'`
      })
      try {
        // just read the output of model4.
        await initiator.ReadFile(file)
      } catch (e) {
        initiator.Message({
          Channel: "fatal",
          Text: `Failure for get modeler4 output, error encountered: ` + e
        })
      }
    }
  })

  await pluginHost.Run()
}

main()
