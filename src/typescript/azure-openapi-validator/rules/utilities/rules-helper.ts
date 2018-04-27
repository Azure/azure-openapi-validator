/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export function getResponseSchema(node, doc): any {
  const schemaRef = node['responses']['200']['schema']['$ref'];
  const schemaPath: string[] = (<string>schemaRef).split('/');
  const schemaProperties = doc.definitions[schemaPath[2]].properties;
  return schemaProperties;
}