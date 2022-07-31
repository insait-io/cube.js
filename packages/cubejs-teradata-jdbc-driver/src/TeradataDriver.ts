/* eslint-disable no-restricted-syntax */
import { JDBCDriver, JDBCDriverConfiguration } from '@cubejs-backend/jdbc-driver';
import { getEnv } from '@cubejs-backend/shared';
import fs from 'fs';
import path from 'path';
import { TeradataQuery } from './TeradataQuery';
import { downloadJDBCDriver } from './installer';

export type TeradataDriverConfiguration = JDBCDriverConfiguration & {
  readOnly?: boolean,
};

async function fileExistsOr(fsPath: string, fn: () => Promise<string>): Promise<string> {
  if (fs.existsSync(fsPath)) {
    return fsPath;
  }

  return fn();
}

const jdbcDriverResolver: Promise<string> | null = null;

async function resolveJDBCDriver(): Promise<string> {
  if (jdbcDriverResolver) {
    return jdbcDriverResolver;
  }

  return fileExistsOr(
    path.join(process.cwd(), 'terajdbc4.jar'),
    async () => fileExistsOr(path.join(__dirname, '..', '..', 'download', 'terajdbc4.jar'), async () => {
      const pathOrNull = await downloadJDBCDriver(false);
      if (pathOrNull) {
        return pathOrNull;
      }

      throw new Error(`Please download and place terajdbc4.jar inside your project directory ${path.join(__dirname, '..', '..', 'download')}`);
    })
  );
}

type ShowDatabasesRow = {
  databaseName: string,
};

type ShowTableRow = {
  database: string,
  tableName: string,
};

const TeradataToGenericType: Record<string, string> = {
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

export class TeradataDriver extends JDBCDriver {
  protected readonly config: TeradataDriverConfiguration;

  public static dialectClass() {
    return TeradataQuery;
  }

  public constructor(configuration: Partial<TeradataDriverConfiguration>) {
    const config: TeradataDriverConfiguration = {
      drivername: 'com.teradata.jdbc.TeraDriver',
      database: getEnv('dbName', { required: false }),
      dbType: 'teradata',
      url: getEnv('teradataUrl'),
      customClassPath: undefined,
      properties: {},
      ...configuration
    };

    super(config);

    this.config = config;
  }

  public readOnly() {
    return !!this.config.readOnly;
  }

  protected async getCustomClassPath() {
    return resolveJDBCDriver();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async createSchemaIfNotExists(schemaName: string): Promise<any> {
    // do nothing for the moment.
  }

  public quoteIdentifier(identifier: string): string {
    return `'${identifier}'`;
  }

  public async tableColumnTypes(table: string) {
    const [databaseName, tableName] = table.split('.');
    console.log(`database: ${databaseName} and tableName: ${tableName}`);
    const queryString: string = `SELECT
        "ColumnName" as "column_name",
        "ColumnType" as "data_type"
        FROM dbc.columns
        WHERE databaseName = ${this.quoteIdentifier(databaseName)} AND TableName = ${this.quoteIdentifier(tableName)}`;
    const columns = await this.query(queryString, []);

    return columns.map(c => ({ name: c.column_name.trim(), type: this.toGenericType(c.data_type.trim()) }));
  }

  public async getTablesQuery(databaseName: string) {
    const response = await this.query(`
        SELECT DISTINCT TABLENAME AS "tableName"
        FROM dbc.columns
        WHERE databaseName = ${this.quoteIdentifier(databaseName)}`, []);

    return response.map((row: any) => ({
      table_name: row.tableName.trim(),
    }));
  }

  protected async getTables(): Promise<ShowTableRow[]> {
    // const databases: ShowDatabasesRow[] = await this.query('SELECT DISTINCT Databasename FROM dbc.columns', []);

    const allTables: ShowTableRow[] = [];

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
    const results: any = await this.query(`SELECT DISTINCT 
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

  public toGenericType(columnType: string): string {
    return TeradataToGenericType[columnType] || super.toGenericType(columnType);
  }

  public async tablesSchema() {
    const tables = await this.getTables();
    console.log(tables);
    const metadata: Record<string, Record<string, object>> = {};

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
