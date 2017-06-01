/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// polyfills for language support
require("../utilities/polyfill.min.js");

import { safeLoad } from "js-yaml";
import { AutoRestPluginHost } from "./jsonrpc/plugin-host";
import { run } from "./azure-openapi-validator";
import { OpenApiTypes, MergeStates } from './azure-openapi-validator/rule';

async function main() {
  const pluginHost = new AutoRestPluginHost();
  pluginHost.Add("azure-openapi-validator", async initiator => {
    const files = await initiator.ListInputs();
    const mergeState: string = await initiator.GetValue('merge-state');
    const openapiType: string = await initiator.GetValue('openapi-type');
    for (const file of files) {
      initiator.Message({
        Channel: "verbose",
        Text: `Validating '${file}'`
      });

      const openapiDefinitionDocument = await initiator.ReadFile(file);
      const openapiDefinitionObject = safeLoad(openapiDefinitionDocument);
      await run(file, openapiDefinitionObject, initiator.Message.bind(initiator), OpenApiTypes[openapiType], MergeStates[mergeState]);
    }
  });

  await pluginHost.Run();
}

main();