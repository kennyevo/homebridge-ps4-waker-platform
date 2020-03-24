"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var utils_1 = require("./utils");
var homebridge_base_platform_1 = require("homebridge-base-platform");
var PS4WakerAccessoryWrapper = /** @class */ (function (_super) {
    __extends(PS4WakerAccessoryWrapper, _super);
    function PS4WakerAccessoryWrapper(context, accessory, device) {
        var _this = _super.call(this, context, accessory, device) || this;
        _this.informationService = _this.initInformationService();
        _this.onService = _this.initOnService();
        _this.appServices = _this.initAppServices();
        _this.log("Found device [" + _this.getDisplayName() + "]");
        _this.log("Device address: " + _this.device.api.opts.address);
        _this.log('Device Status:');
        _this.log(_this.device.api.getDeviceStatus());
        return _this;
    }
    PS4WakerAccessoryWrapper.prototype.initOnService = function () {
        var onService = this.getService(this.Service.Switch, this.getDisplayName(), 'onService');
        onService
            .getCharacteristic(this.Characteristic.On)
            .on('get', homebridge_base_platform_1.callbackify(this.isOn.bind(this)))
            .on('set', homebridge_base_platform_1.callbackify(this.setOn.bind(this)));
        return onService;
    };
    PS4WakerAccessoryWrapper.prototype.initInformationService = function () {
        var informationService = this.accessory.getService(this.Service.AccessoryInformation);
        informationService
            .setCharacteristic(this.Characteristic.Name, this.getDisplayName())
            .setCharacteristic(this.Characteristic.Manufacturer, 'Sony Corporation')
            .setCharacteristic(this.Characteristic.Model, this.device.model)
            .setCharacteristic(this.Characteristic.SerialNumber, this.device.serial);
        if (this.device.info.systemVersion) {
            informationService.setCharacteristic(this.Characteristic.FirmwareRevision, this.device.info.systemVersion);
        }
        return informationService;
    };
    PS4WakerAccessoryWrapper.prototype.initAppServices = function () {
        var _this = this;
        var allAppsRegistered = this._getAllAppServices(this.Service.Switch);
        var newServices = this.device.apps.map(function (config) {
            var serviceType = _appIdToServiceType(config.id);
            var oldServiceIndex = allAppsRegistered.findIndex(function (service) {
                return service.subtype === serviceType;
            });
            if (oldServiceIndex !== -1) {
                allAppsRegistered.splice(oldServiceIndex, 1);
            }
            var appService = _this.getService(_this.Service.Switch, config.name, serviceType);
            var characteristic = appService.getCharacteristic(_this.Characteristic.On);
            characteristic.on('get', homebridge_base_platform_1.callbackify(function () { return _this.isRunningApp(config); }));
            characteristic.on('set', homebridge_base_platform_1.callbackify(function (on) { return _this.setRunningApp(on, config); }));
            return appService;
        });
        allAppsRegistered.forEach(function (service) { return _this.removeService(_this.Service.Switch, service.subtype); });
        return newServices;
    };
    PS4WakerAccessoryWrapper.prototype.getRunningApp = function () {
        return __awaiter(this, void 0, void 0, function () {
            var deviceInfoRaw;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.device.api.getDeviceStatus()];
                    case 1:
                        deviceInfoRaw = _a.sent();
                        this.device.info = new utils_1.DeviceInfo(deviceInfoRaw);
                        if (this.device.info.runningApp !== undefined) {
                            return [2 /*return*/, this.device.info.runningApp];
                        }
                        return [2 /*return*/, undefined];
                }
            });
        });
    };
    PS4WakerAccessoryWrapper.prototype.isRunningApp = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            var runningApp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getRunningApp()];
                    case 1:
                        runningApp = _a.sent();
                        return [2 /*return*/, runningApp ? runningApp.id === config.id : false];
                }
            });
        });
    };
    PS4WakerAccessoryWrapper.prototype.setRunningApp = function (on, config) {
        return __awaiter(this, void 0, void 0, function () {
            var success, deviceOn, runningApp, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 15, , 16]);
                        success = false;
                        return [4 /*yield*/, this.isOn()];
                    case 1:
                        deviceOn = _a.sent();
                        if (!on) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.device.api.startTitle(config.id)];
                    case 2:
                        _a.sent();
                        success = true;
                        if (!(deviceOn === false)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.deviceDidTurnOn(true)];
                    case 3:
                        success = _a.sent();
                        _a.label = 4;
                    case 4:
                        this.log("[" + this.getDisplayName() + "] Start " + config.name);
                        return [3 /*break*/, 13];
                    case 5:
                        if (!(deviceOn === true)) return [3 /*break*/, 13];
                        runningApp = this.device.info.runningApp;
                        if (!(runningApp !== undefined && runningApp.id === config.id)) return [3 /*break*/, 13];
                        return [4 /*yield*/, this.device.api.sendKeys(['ps'])];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, new Promise((function (resolve) { return setTimeout(resolve, 250); }))];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, this.device.api.sendKeys(['option'])];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, new Promise((function (resolve) { return setTimeout(resolve, 250); }))];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, this.device.api.sendKeys(['enter'])];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, new Promise((function (resolve) { return setTimeout(resolve, 1000); }))];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, this.device.api.sendKeys(['enter'])];
                    case 12:
                        _a.sent();
                        this.log("[" + this.getDisplayName() + "] Stop " + config.name);
                        success = true;
                        _a.label = 13;
                    case 13: return [4 /*yield*/, this.device.api.close()];
                    case 14:
                        _a.sent();
                        return [2 /*return*/, success];
                    case 15:
                        err_1 = _a.sent();
                        this.log.error(err_1);
                        return [2 /*return*/, false];
                    case 16: return [2 /*return*/];
                }
            });
        });
    };
    PS4WakerAccessoryWrapper.prototype.isOn = function () {
        return __awaiter(this, void 0, void 0, function () {
            var deviceInfoRaw;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.device.api.getDeviceStatus()];
                    case 1:
                        deviceInfoRaw = _a.sent();
                        this.device.info = new utils_1.DeviceInfo(deviceInfoRaw);
                        return [2 /*return*/, this.device.info.status.code === 200];
                }
            });
        });
    };
    PS4WakerAccessoryWrapper.prototype.setOn = function (on) {
        return __awaiter(this, void 0, void 0, function () {
            var success, runningApp, appService, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.device.api === undefined) {
                            return [2 /*return*/, false];
                        }
                        success = false;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 10, , 11]);
                        if (!(on === true)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.device.api.turnOn(this.device.timeout)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.deviceDidTurnOn()];
                    case 3:
                        success = _a.sent();
                        return [3 /*break*/, 8];
                    case 4: return [4 /*yield*/, this.getRunningApp()];
                    case 5:
                        runningApp = _a.sent();
                        appService = this._getServiceFromRunningApp(runningApp);
                        return [4 /*yield*/, this.device.api.turnOff()];
                    case 6:
                        _a.sent();
                        if (appService !== undefined) {
                            appService.getCharacteristic(this.Characteristic.On).updateValue(false);
                        }
                        return [4 /*yield*/, this.deviceDidTurnOff()];
                    case 7:
                        success = _a.sent();
                        _a.label = 8;
                    case 8: return [4 /*yield*/, this.device.api.close()];
                    case 9:
                        _a.sent();
                        return [3 /*break*/, 11];
                    case 10:
                        err_2 = _a.sent();
                        this.log.error(err_2);
                        return [2 /*return*/, false];
                    case 11: return [2 /*return*/, success];
                }
            });
        });
    };
    PS4WakerAccessoryWrapper.prototype.deviceDidTurnOff = function (updateOn) {
        this.log("[" + this.getDisplayName() + "] Turn off");
        if (updateOn === true) {
            this.onService.getCharacteristic(this.Characteristic.On).updateValue(false);
        }
        return Promise.resolve(true);
    };
    PS4WakerAccessoryWrapper.prototype.deviceDidTurnOn = function (updateOn) {
        this.log("[" + this.getDisplayName() + "] Turn on");
        if (updateOn === true) {
            this.onService.getCharacteristic(this.Characteristic.On).updateValue(true);
        }
        return Promise.resolve(true);
    };
    PS4WakerAccessoryWrapper.prototype._getAllAppServices = function (serviceType) {
        return this.getServices(serviceType, (function (service) {
            if (service.subtype === undefined) {
                return false;
            }
            return service.subtype.startsWith(PS4WakerAccessoryWrapper.APP_SERVICE_PREFIX);
        }));
    };
    PS4WakerAccessoryWrapper.prototype._getServiceFromRunningApp = function (runningApp) {
        if (runningApp !== undefined) {
            var serviceType = _appIdToServiceType(runningApp.id);
            return this.accessory.getServiceByUUIDAndSubType(this.Service.Switch, serviceType);
        }
        return undefined;
    };
    PS4WakerAccessoryWrapper.APP_SERVICE_PREFIX = 'app';
    return PS4WakerAccessoryWrapper;
}(homebridge_base_platform_1.HomebridgeAccessoryWrapper));
exports.PS4WakerAccessoryWrapper = PS4WakerAccessoryWrapper;
function _appIdToServiceType(id) {
    return "" + PS4WakerAccessoryWrapper.APP_SERVICE_PREFIX + id + "Service";
}
//# sourceMappingURL=ps4-waker-accessory-wrapper.js.map