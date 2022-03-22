"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nativeRulesets = exports.spectralRulesets = exports.spectralArmRulesetFile = exports.spectralCommonRulesetFile = void 0;
const path_1 = require("path");
const arm_1 = __importDefault(require("./native/rulesets/arm"));
const legacy_1 = __importDefault(require("./native/rulesets/legacy"));
const arm_2 = __importDefault(require("./spectral/arm"));
const common_1 = __importDefault(require("./spectral/common"));
function getRuleSetFile(filename) {
    return (0, path_1.join)(__dirname, "dist", "spectral", filename + '.js');
}
const spectralCommonRulesetFile = () => getRuleSetFile("common");
exports.spectralCommonRulesetFile = spectralCommonRulesetFile;
const spectralArmRulesetFile = () => getRuleSetFile("arm");
exports.spectralArmRulesetFile = spectralArmRulesetFile;
exports.spectralRulesets = {
    spectralCommonRulesetFile: exports.spectralCommonRulesetFile,
    spectralArmRulesetFile: exports.spectralArmRulesetFile,
    spectralArmRuleset: arm_2.default,
    spectralCommonRuleset: common_1.default
};
exports.nativeRulesets = {
    common: legacy_1.default,
    arm: arm_1.default,
};
//# sourceMappingURL=index.js.map