"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadJDBCDriver = void 0;
const path_1 = __importDefault(require("path"));
const inquirer_1 = __importDefault(require("inquirer"));
const shared_1 = require("@cubejs-backend/shared");
function acceptedByEnv() {
    const acceptStatus = shared_1.getEnv('teradataAcceptPolicy');
    if (acceptStatus) {
        console.log('You accepted Terms & Conditions for JDBC driver from Teradata by CUBEJS_DB_TERADATA_ACCEPT_POLICY');
    }
    if (acceptStatus === false) {
        console.log('You declined Terms & Conditions for JDBC driver from Teradata by CUBEJS_DB_TERADATA_ACCEPT_POLICY');
        console.log('Installation will be skipped');
    }
    return acceptStatus;
}
async function cliAcceptVerify() {
    console.log('Teradata driver is using JDBC driver from Teradata');
    console.log('By downloading the driver, you agree to the Terms & Conditions');
    console.log('link to insert');
    console.log('More info: say no more');
    if (process.stdout.isTTY) {
        const { licenseAccepted } = await inquirer_1.default.prompt([{
                type: 'confirm',
                name: 'licenseAccepted',
                message: 'You read & agree to the Terms & Conditions',
            }]);
        return licenseAccepted;
    }
    shared_1.displayCLIWarning('Your stdout is not interactive, you can accept it via CUBEJS_DB_DATABRICKS_ACCEPT_POLICY=true');
    return false;
}
async function downloadJDBCDriver(isCli = false) {
    let driverAccepted = acceptedByEnv();
    if (driverAccepted === undefined && isCli) {
        driverAccepted = await cliAcceptVerify();
    }
    if (driverAccepted) {
        console.log('Downloading terajdbc4');
        await shared_1.downloadAndExtractFile('https://drive.google.com/uc?export=download&id=11HlWnmzCJ7S5zFRYA_FWHFdz0gfs5Isj', {
            showProgress: true,
            cwd: path_1.default.resolve(path_1.default.join(__dirname, '..', '..', 'download')),
        });
        console.log('Teradata jdbc file has been download and unzip');
        return path_1.default.resolve(path_1.default.join(__dirname, '..', '..', 'download', 'terajdbc4.jar'));
    }
    return null;
}
exports.downloadJDBCDriver = downloadJDBCDriver;
//# sourceMappingURL=installer.js.map