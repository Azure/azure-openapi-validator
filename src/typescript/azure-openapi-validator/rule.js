"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OpenApiTypes;
(function (OpenApiTypes) {
    OpenApiTypes[OpenApiTypes["default"] = 1] = "default";
    OpenApiTypes[OpenApiTypes["arm"] = 2] = "arm";
    OpenApiTypes[OpenApiTypes["dataplane"] = 4] = "dataplane";
})(OpenApiTypes = exports.OpenApiTypes || (exports.OpenApiTypes = {}));
var MergeStates;
(function (MergeStates) {
    MergeStates[MergeStates["individual"] = 0] = "individual";
    MergeStates[MergeStates["composed"] = 1] = "composed";
})(MergeStates = exports.MergeStates || (exports.MergeStates = {}));
exports.rules = [];
