"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var ps4_waker_1 = require("ps4-waker");
var utils_1 = require("./utils");
var PS4Device = /** @class */ (function () {
    function PS4Device(device) {
        this.api = device.api;
        this.connectionInfo = device.connectionInfo;
        this.apps = device.apps;
        this.serial = device.serial;
        this.model = device.model;
        this.timeout = device.timeout;
        this.info = device.info;
    }
    Object.defineProperty(PS4Device.prototype, "name", {
        get: function () {
            return this.info.host.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PS4Device.prototype, "id", {
        get: function () {
            return this.info.host.id;
        },
        enumerable: true,
        configurable: true
    });
    return PS4Device;
}());
exports.PS4Device = PS4Device;
function deviceFromConfig(accessoryConfig, globalConfig) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    ps4_waker_1.Detector.findWhen(function (deviceInfoRaw, connectionInfo) {
                        return accessoryConfig.ip === undefined || connectionInfo.address === accessoryConfig.ip;
                    }, {
                        timeout: accessoryConfig.timeout || globalConfig.timeout || 5000
                    }, function (err, deviceInfoRaw, connectionInfo) {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(_createDevice(accessoryConfig, globalConfig, deviceInfoRaw, connectionInfo));
                    });
                })];
        });
    });
}
exports.deviceFromConfig = deviceFromConfig;
function _createDevice(accessoryConfig, globalConfig, deviceInfoRaw, connectionInfo) {
    var api = new ps4_waker_1.Device({
        address: connectionInfo.address,
        autoLogin: true,
        credentials: accessoryConfig.credentials,
        passCode: accessoryConfig.passCode
    });
    api.lastInfo = deviceInfoRaw;
    api.lastInfo.address = connectionInfo.address;
    return new PS4Device({
        api: api,
        info: new utils_1.DeviceInfo(deviceInfoRaw),
        connectionInfo: connectionInfo,
        apps: _mergeAppConfigs(accessoryConfig.apps, globalConfig.apps),
        serial: accessoryConfig.serial,
        model: accessoryConfig.model,
        timeout: accessoryConfig.timeout || globalConfig.timeout || 5000
    });
}
function _mergeAppConfigs(accessoryApps, globalApps) {
    var res = [];
    var exists = function (toFind) {
        return function (item) { return item.id === toFind.id; };
    };
    var setGames = function (target, src) {
        if (src !== undefined) {
            for (var i = 0; i < src.length; i++) {
                var find = target.findIndex(exists(src[i]));
                if (find === -1) {
                    target.push(src[i]);
                }
                else {
                    target[find] = src[i];
                }
            }
        }
    };
    setGames(res, globalApps);
    setGames(res, accessoryApps);
    return res;
}
//# sourceMappingURL=ps4-device.js.map