"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ps4_waker_platform_1 = require("./ps4-waker-platform");
function default_1(homebridge) {
    homebridge.registerPlatform(ps4_waker_platform_1.PS4WakerPlatformInfo.plugin, ps4_waker_platform_1.PS4WakerPlatformInfo.name, ps4_waker_platform_1.PS4WakerPlatform, true);
}
exports.default = default_1;
//# sourceMappingURL=index.js.map