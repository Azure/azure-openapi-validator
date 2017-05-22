/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { JsonPath } from "../jsonrpc/types";

export enum OpenApiTypes {
  "default" = 0,
  "arm" = 1 << 0,
  "DataPlane" = 1 << 1
}

export enum MergeStates {
  "individual",
  "composed"
}

export interface Rule {
  id: string; // see Mxxx codes on https://github.com/Azure/azure-rest-api-specs/blob/master/documentation/openapi-authoring-automated-guidelines.md
  name: string; // see same website as above
  category: ("RPCViolation" | "OneAPIViolation" | "SDKViolation")[];
  severity: "error" | "warning";

  mergeState: MergeStates;
  openapiType: OpenApiTypes;

  appliesTo_JsonQuery?: string; // see https://www.npmjs.com/package/jsonpath#jsonpath-syntax for syntax and samples
  run: (openapiDocument: any, openapiSection: any, location: JsonPath) => Iterable<{ message: string, location: JsonPath }>;
}

export const rules: Rule[] = [];