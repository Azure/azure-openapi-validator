/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AutoRestPluginHost } from "./jsonrpc/plugin-host"
import { openapiValidatorPluginFunc } from "./openapiValidatorPluginFunc"
import { spectralPluginFunc } from "./spectralPluginFunc"

export const cachedFiles = new Map<string, any>()

async function main() {
  const pluginHost = new AutoRestPluginHost()
  pluginHost.Add("openapi-validator", openapiValidatorPluginFunc)
  pluginHost.Add("spectral", spectralPluginFunc)

  await pluginHost.Run()
}

main().then(
  () => {},
  () => {}
)
