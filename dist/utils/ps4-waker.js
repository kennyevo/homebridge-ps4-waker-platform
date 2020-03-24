"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DeviceInfo = /** @class */ (function () {
    function DeviceInfo(raw) {
        this.type = raw.type;
        this.status = {
            name: raw.status,
            code: parseInt(raw.statusCode),
            full: raw.statusLine
        };
        this.host = {
            id: raw['host-id'],
            type: raw['host-type'],
            name: raw['host-name'],
            requestPort: parseInt(raw['host-request-port'])
        };
        this.deviceDiscoveryProtocolVersion = DeviceInfo.toVersionString(raw['device-discovery-protocol-version']);
        this.systemVersion = DeviceInfo.toVersionString(raw['system-version']);
        if (raw['running-app-name'] !== undefined && raw['running-app-titleid'] !== undefined) {
            this.runningApp = {
                id: raw['running-app-titleid'],
                name: raw['running-app-name']
            };
        }
    }
    DeviceInfo.toVersionString = function (versionNumber) {
        var versionString = '';
        for (var i = 0; i < versionNumber.length - 1; i += 2) {
            var path = parseInt(versionNumber[i] + versionNumber[i + 1]);
            if (versionString.length !== 0) {
                versionString += '.';
            }
            versionString += path;
        }
        return versionString;
    };
    return DeviceInfo;
}());
exports.DeviceInfo = DeviceInfo;
//# sourceMappingURL=ps4-waker.js.map