/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { MergeStates, OpenApiTypes } from '../rule';
import { Message, JsonPath } from '../../jsonrpc/types';
import { suite, test, slow, timeout, skip, only } from "mocha-typescript";
import { AutoRestPluginHost } from "../../jsonrpc/plugin-host";
import { run } from "../../azure-openapi-validator";
import { stringify as jp_stringify } from 'jsonpath';
import {
  getMessagesForRule,
  collectTestMessagesFromValidator,
  getNodePaths
} from './utilities/tests-helper';
import * as assert from 'assert';

import { DescriptionTooShort } from "../rules/DescriptionTooShort";
import { DescriptionAvoidsGerunds } from "../rules/DescriptionAvoidsGerunds";
import { DescriptionMustNotBeNodeName } from "../rules/DescriptionMustNotBeNodeName"; 
import { LintDescriptionProse } from "../rules/LintDescriptionProse";
import { DescriptionNoIdenticalSiblings } from "../rules/DescriptionNoIdenticalSiblings";

const testFile:string = 'DocumentationViolations.json';
var messages: Message[];

@suite class DocumentationTests {
  static async before() {
    messages = await collectTestMessagesFromValidator(testFile, OpenApiTypes.default, MergeStates.composed);
  }

  // R4002 ("Too short") requires its own input file as it would catch too many errors on the main.defaultumentation
  // tests, which frequently use short descriptions for the purpose of easy maintenance.
  @test async "Description too short."() {
    const testFile: string = "ShortDescription.json";
    const messages: Message[] = await collectTestMessagesFromValidator(testFile, OpenApiTypes.default, MergeStates.composed);
    const violations: Message[] = getMessagesForRule(messages, DescriptionTooShort);
    const nodes: string[] = getNodePaths(violations);

    assert.equal(violations.length, 2, "Wrong number of violations.");
    assert.notEqual(nodes.indexOf('$.paths["/D4002"].get.description'), -1, "Did not find short description in paths./D4002.get.description");
    assert.notEqual(nodes.indexOf('$.paths["/D4002"].get.responses["200"].description'), -1, "Did not find short description in paths./D4002.get.responses.200.description");
  }

  @test "Description as node name"() {
    const violations: Message[] = getMessagesForRule(messages, DescriptionMustNotBeNodeName);
    const nodes: string[] = getNodePaths(violations);

    assert.equal(violations.length, 3, "Wrong number of violations.");
    assert.notEqual(nodes.indexOf('$.paths["/D4001"].post.description'), -1, "Did not find node === node.description");
    assert.notEqual(nodes.indexOf('$.paths["/D4001"].post.parameters[0].description'), -1, "Did not find node.name === node.description");
    assert.notEqual(nodes.indexOf('$.paths["/D4001"].post.responses["200"].description'), -1, "Did not find description === 'description'");
  }
  
  @test "Gerund detection"() {
    const violations: Message[] = getMessagesForRule(messages, DescriptionAvoidsGerunds);
    const nodes: string[] = getNodePaths(violations);

    assert.equal(violations.length, 1, "Wrong number of violations.");
    assert.notEqual(nodes.indexOf('$.paths["/D4004"].get.description'), -1, "Did not find gerund in paths./D4005.get.description");
    assert.equal(nodes.indexOf('$.paths["/D4004"].get.responses["200"].description'), -1, "Detected 'string' as a gerund");
  }
  
  // Testing file may trigger innumerable prose lints, so use a minimalist swagger which is known to contain
  // at least one prose lint violation.
  @test async "Linting of description prose"() {
    const testFile: string = "ProseLintViolations.json";
    const messages: Message[] = await collectTestMessagesFromValidator(testFile, OpenApiTypes.default, MergeStates.composed);
    const violations: Message[] = getMessagesForRule(messages, LintDescriptionProse);
    const nodes: string[] = getNodePaths(violations);

    assert.equal(violations.length, 1, "Wrong number of violations.");
    assert.notEqual(nodes.indexOf('$.info.description'), -1, "Did not find violation in info.description");
  }

  @test "Indentical description in siblings"() {
    const violations: Message[] = getMessagesForRule(messages, DescriptionNoIdenticalSiblings);
    const nodeMap: { [path:string]: string } = violations.reduce( (acc, message) => {
      const path = (<{path:JsonPath}>message.Source[0].Position).path;
      acc[jp_stringify(path)] = message.Text;

      return acc;
    }, {});

    assert.equal(violations.length, 2, "Wrong number of violations");
    assert(!('$.paths["/D4003_OK"]' in nodeMap), "Incorrectly detected '$.paths./D4003_OK as duplicate'");

    var violationPath = '$.paths["/D4003"].get.responses';
    if (violationPath in nodeMap) {
      assert.notEqual(nodeMap[violationPath].indexOf(`${violationPath}["200"]`), -1, `${violationPath}["200"] not detected as duplicate`);
      assert.notEqual(nodeMap[violationPath].indexOf(`${violationPath}["400"]`), -1, `${violationPath}["400"] not detected as duplicate`);
      assert.equal(nodeMap[violationPath].indexOf(`${violationPath}["500"]`), -1, `${violationPath}["500"] detected as duplicate`);
    }
    else {
      assert.fail(undefined, violationPath, "Did not detect duplicate descriptions in subnodes");
    }

    violationPath = '$.paths["/D4003"].post.parameters';
    if (violationPath in nodeMap) {
      assert.notEqual(nodeMap[violationPath].indexOf(`${violationPath}[0]`), -1, `${violationPath}[0] not detected as duplicate`);
      assert.notEqual(nodeMap[violationPath].indexOf(`${violationPath}[1]`), -1, `${violationPath}[1] not detected as duplicate`);
      assert.equal(nodeMap[violationPath].indexOf(`${violationPath}[2]`), -1, `${violationPath}[2] detected as duplicate`);
    }
    else {
      assert.fail(undefined, violationPath, "Did not detect duplicate descriptions in array");
    }
  }
}

