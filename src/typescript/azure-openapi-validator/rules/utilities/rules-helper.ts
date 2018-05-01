/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export function getSuccessfulResponseSchema(node, doc): any {
  const responses = Object.keys(node['responses']);
  const response = getMostSuccessfulResponseKey(responses)
  return getResponseSchema(node['responses'][response], doc)
}

function getMostSuccessfulResponseKey(responses: string[]): string {
  var response: string = 'default';
  if (responses.includes('200')) {
    response = '200'
  } else {
    var twoHundreds = [];
    responses.forEach(function (value) {
      if (value.startsWith('2')) {
        twoHundreds.push(value);
      }
    })
    if (twoHundreds.length > 0) {
      response = twoHundreds[0];
    }
  }
  return response;
}

function getResponseSchema(response: Object, doc): any {
  const schema = response['schema'];
  if (schema === undefined || schema === null) {
    return;
  }
  if ('$ref' in schema) {
    const schemaRef = response['schema']['$ref'];
    const schemaPath: string[] = (<string>schemaRef).split('/');
    const schemaProperties = doc.definitions[schemaPath[2]].properties;
    return schemaProperties;
  }
  return schema.properties;
}