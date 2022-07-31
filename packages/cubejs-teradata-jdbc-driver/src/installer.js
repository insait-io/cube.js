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
exports.__esModule = true;
exports.downloadJDBCDriver = void 0;
var path_1 = require("path");
var inquirer_1 = require("inquirer");
var shared_1 = require("@cubejs-backend/shared");
function acceptedByEnv() {
    var acceptStatus = shared_1.getEnv('teradataAcceptPolicy');
    if (acceptStatus) {
        console.log('You accepted Terms & Conditions for JDBC driver from Teradata by CUBEJS_DB_TERADATA_ACCEPT_POLICY');
    }
    if (acceptStatus === false) {
        console.log('You declined Terms & Conditions for JDBC driver from Teradata by CUBEJS_DB_TERADATA_ACCEPT_POLICY');
        console.log('Installation will be skipped');
    }
    return acceptStatus;
}
function cliAcceptVerify() {
    return __awaiter(this, void 0, void 0, function () {
        var licenseAccepted;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Teradata driver is using JDBC driver from Teradata');
                    console.log('By downloading the driver, you agree to the Terms & Conditions');
                    console.log('link to insert');
                    console.log('More info: say no more');
                    if (!process.stdout.isTTY) return [3 /*break*/, 2];
                    return [4 /*yield*/, inquirer_1["default"].prompt([{
                                type: 'confirm',
                                name: 'licenseAccepted',
                                message: 'You read & agree to the Terms & Conditions'
                            }])];
                case 1:
                    licenseAccepted = (_a.sent()).licenseAccepted;
                    return [2 /*return*/, licenseAccepted];
                case 2:
                    shared_1.displayCLIWarning('Your stdout is not interactive, you can accept it via CUBEJS_DB_DATABRICKS_ACCEPT_POLICY=true');
                    return [2 /*return*/, false];
            }
        });
    });
}
function downloadJDBCDriver(isCli) {
    if (isCli === void 0) { isCli = false; }
    return __awaiter(this, void 0, void 0, function () {
        var driverAccepted;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    driverAccepted = acceptedByEnv();
                    if (!(driverAccepted === undefined && isCli)) return [3 /*break*/, 2];
                    return [4 /*yield*/, cliAcceptVerify()];
                case 1:
                    driverAccepted = _a.sent();
                    _a.label = 2;
                case 2:
                    if (!driverAccepted) return [3 /*break*/, 4];
                    console.log('Downloading terajdbc4');
                    return [4 /*yield*/, shared_1.downloadAndExtractFile('https://drive.google.com/uc?export=download&id=11HlWnmzCJ7S5zFRYA_FWHFdz0gfs5Isj', {
                            showProgress: true,
                            cwd: path_1["default"].resolve(path_1["default"].join(__dirname, '..', '..', 'download'))
                        })];
                case 3:
                    _a.sent();
                    console.log('Release notes: Todo');
                    return [2 /*return*/, path_1["default"].resolve(path_1["default"].join(__dirname, '..', '..', 'download', 'terajdbc4.jar'))];
                case 4: return [2 /*return*/, null];
            }
        });
    });
}
exports.downloadJDBCDriver = downloadJDBCDriver;
