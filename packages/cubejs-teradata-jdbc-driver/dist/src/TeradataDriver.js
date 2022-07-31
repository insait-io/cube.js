"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeradataDriver = void 0;
/* eslint-disable no-restricted-syntax */
const jdbc_driver_1 = require("@cubejs-backend/jdbc-driver");
const shared_1 = require("@cubejs-backend/shared");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const TeradataQuery_1 = require("./TeradataQuery");
const installer_1 = require("./installer");
async function fileExistsOr(fsPath, fn) {
    if (fs_1.default.existsSync(fsPath)) {
        return fsPath;
    }
    return fn();
}
const jdbcDriverResolver = null;
async function resolveJDBCDriver() {
    if (jdbcDriverResolver) {
        return jdbcDriverResolver;
    }
    return fileExistsOr(path_1.default.join(process.cwd(), 'terajdbc4.jar'), async () => fileExistsOr(path_1.default.join(__dirname, '..', '..', 'download', 'terajdbc4.jar'), async () => {
        const pathOrNull = await installer_1.downloadJDBCDriver(false);
        if (pathOrNull) {
            return pathOrNull;
        }
        throw new Error(`Please download and place terajdbc4.jar inside your project directory ${path_1.default.join(__dirname, '..', '..', 'download')}`);
    }));
}
const TeradataToGenericType = {
    A1: 'ARRAY',
    AN: 'MULTI-DIMENSIONAL ARRAY',
    AT: 'TIME',
    BF: 'BYTE',
    BO: 'BLOB',
    BV: 'VARBYTE',
    CF: 'CHARACTER',
    CO: 'CLOB',
    CV: 'VARCHAR',
    D: 'DECIMAL',
    DA: 'DATE',
    DH: 'INTERVAL DAY TO HOUR',
    DM: 'INTERVAL DAY TO MINUTE',
    DS: 'INTERVAL DAY TO SECOND',
    DY: 'INTERVAL DAY',
    F: 'FLOAT',
    HM: 'INTERVAL HOUR TO MINUTE',
    HS: 'INTERVAL HOUR TO SECOND',
    HR: 'INTERVAL HOUR',
    I: 'INTEGER',
    I1: 'BYTEINT',
    I2: 'SMALLINT',
    I8: 'BIGINT',
    JN: 'JSON',
    MI: 'INTERVAL MINUTE',
    MO: 'INTERVAL MONTH',
    MS: 'INTERVAL MINUTE TO SECOND',
    N: 'NUMBER',
    PD: 'PERIOD(DATE)',
    PM: 'PERIOD(TIMESTAMP WITH TIME ZONE)',
    PS: 'PERIOD(TIMESTAMP)',
    PT: 'PERIOD(TIME)',
    PZ: 'PERIOD(TIME WITH TIME ZONE)',
    SC: 'INTERVAL SECOND',
    SZ: 'TIMESTAMP WITH TIME ZONE',
    TS: 'TIMESTAMP',
    TZ: 'TIME WITH TIME ZONE',
    UT: 'UDT Type',
    XM: 'XML',
    YM: 'INTERVAL YEAR TO MONTH',
    YR: 'INTERVAL YEAR',
    '++': 'TD_ANYTYPE'
};
class TeradataDriver extends jdbc_driver_1.JDBCDriver {
    constructor(configuration) {
        const config = {
            drivername: 'com.teradata.jdbc.TeraDriver',
            database: shared_1.getEnv('dbName', { required: false }),
            dbType: 'teradata',
            url: shared_1.getEnv('teradataUrl'),
            customClassPath: undefined,
            properties: {},
            ...configuration
        };
        super(config);
        this.config = config;
    }
    static dialectClass() {
        return TeradataQuery_1.TeradataQuery;
    }
    readOnly() {
        return !!this.config.readOnly;
    }
    async getCustomClassPath() {
        return resolveJDBCDriver();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async createSchemaIfNotExists(schemaName) {
        // do nothing for the moment.
    }
    quoteIdentifier(identifier) {
        return `'${identifier}'`;
    }
    async tableColumnTypes(table) {
        const [databaseName, tableName] = table.split('.');
        console.log(`database: ${databaseName} and tableName: ${tableName}`);
        const queryString = `SELECT
        "ColumnName" as "column_name",
        "ColumnType" as "data_type"
        FROM dbc.columns
        WHERE databaseName = ${this.quoteIdentifier(databaseName)} AND TableName = ${this.quoteIdentifier(tableName)}`;
        const columns = await this.query(queryString, []);
        return columns.map(c => ({ name: c.column_name.trim(), type: this.toGenericType(c.data_type.trim()) }));
    }
    async getTablesQuery(databaseName) {
        const response = await this.query(`
        SELECT DISTINCT TABLENAME AS "tableName"
        FROM dbc.columns
        WHERE databaseName = ${this.quoteIdentifier(databaseName)}`, []);
        return response.map((row) => ({
            table_name: row.tableName.trim(),
        }));
    }
    async getTables() {
        // const databases: ShowDatabasesRow[] = await this.query('SELECT DISTINCT Databasename FROM dbc.columns', []);
        const allTables = [];
        /* for (let index = 0; index < databases.length; index++) {
          // const { databaseName } = databases[index];
          const result: any = await this.query(
            `SELECT DISTINCT TABLENAME AS "tableName",
                    DATABASENAME AS "database"
                    FROM dbc.columns
                    WHERE databasename = 'LEUMIMVP'`, []
          );
          allTables.push({ database: result.database, tableName: result.tableName });
        } */
        const results = await this.query(`SELECT DISTINCT 
                                    TABLENAME AS "tableName", 
                                    DATABASENAME AS "database"
                                    FROM dbc.columns
                                    WHERE databasename = 'LEUMIMVP'`, []);
        for (let index = 0; index < results.length; index++) {
            const { database, tableName } = results[index];
            allTables.push({ database: database.trim(), tableName: tableName.trim() });
        }
        return allTables.flat();
    }
    toGenericType(columnType) {
        return TeradataToGenericType[columnType] || super.toGenericType(columnType);
    }
    async tablesSchema() {
        const tables = await this.getTables();
        console.log(tables);
        const metadata = {};
        await Promise.all(tables.map(async ({ database, tableName }) => {
            if (!(database in metadata)) {
                metadata[database] = {};
            }
            const columns = await this.tableColumnTypes(`${database}.${tableName}`);
            metadata[database][tableName] = columns;
        }));
        return metadata;
    }
}
exports.TeradataDriver = TeradataDriver;
//# sourceMappingURL=TeradataDriver.js.map