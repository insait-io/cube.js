/* eslint-disable no-restricted-syntax */
import { JDBCDriver, JDBCDriverConfiguration } from '@cubejs-backend/jdbc-driver';
import { getEnv } from '@cubejs-backend/shared';
import fs from 'fs';
import path from 'path';
import { TeradataQuery } from './TeradataQuery';

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
      throw new Error('Please place terajdbc4.jar inside the container in /cubejs/packages/cubejs/teradata-jdbc-driver/download');
    })
  );
}

type ShowTableRow = {
  database: string,
  tableName: string,
};

const TeradataToGenericType: Record<string, string> = {
  A1: 'ARRAY', // not supported
  AN: 'MULTI-DIMENSIONAL ARRAY', // not supported
  AT: 'time',
  BF: 'BYTE', // not supported
  BO: 'BLOB', // not supported
  BV: 'VARBYTE', // not supported
  CF: 'CHARACTER',
  CO: 'CLOB',
  CV: 'varchar',
  D: 'dec',
  DA: 'date',
  DH: 'INTERVAL DAY TO HOUR',
  DM: 'INTERVAL DAY TO MINUTE',
  DS: 'INTERVAL DAY TO SECOND',
  DY: 'INTERVAL DAY',
  F: 'numb',
  HM: 'INTERVAL HOUR TO MINUTE',
  HS: 'INTERVAL HOUR TO SECOND',
  HR: 'INTERVAL HOUR',
  I: 'int',
  I1: 'int',
  I2: 'int',
  I8: 'bigint',
  JN: 'JSON', // not supported
  MI: 'INTERVAL MINUTE', 
  MO: 'INTERVAL MONTH',
  MS: 'INTERVAL MINUTE TO SECOND',
  N: 'numb',
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
      database: getEnv('teradataDbName', { required: false }),
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
    return `"${identifier}"`;
  }

  private lettersNumbersSpacesDashes(str: string) {
    return /^[A-Za-z0-9 _]*$/.test(str);
  }

  public async tableColumnTypes(table: string) {
    const [databaseName, tableName] = table.split('.');
    
    try {
      let columns = await this.query(`HELP COLUMN * FROM ${tableName}`, []);
      console.log('query columns finish');
      if (!columns.length) {
        return [];
      }

      columns = columns.map((c: any) => {
        const { 'Column Name': columnName, Type: dataType, 'Primary?': keyType } = c;

        if (!columnName || !dataType || !this.lettersNumbersSpacesDashes(columnName.trim())) {
          return null;
        }
        
        console.log(columnName.trim(), dataType.trim(), `is priamry key ? ${keyType?.trim() === 'P' ? 'yes' : 'no'}`);

        return { name: columnName.trim(), type: this.toGenericType(dataType.trim()), attributes: keyType?.trim() === 'P' ? ['primaryKey'] : [] };
      }).filter(x => x !== null);
      return columns;
    } catch (error) {
      console.log('test', error);
      await this.getNumberOfListerners();
    }
    return [];
  }

  public async getNumberOfListerners() {
    console.log(`NUMBER CONNECTION ON IS : ${this.pool.size}`);
  }

  public async getTablesQuery(databaseName: string) {
    try {
      const response = await this.query(`SELECT TOP 20 
                                          DATABASENAME AS "database",
                                          TABLENAME AS "tableName",
                                          FROM dbc.tables
                                          WHERE tableKind='V' AND databasename='${databaseName}'
                                              `, []);
      return response.map((row: any) => ({
        table_name: row.tableName.trim(),
      }));
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  protected async getTables(): Promise<ShowTableRow[]> {
    const databaseName = this.config.database;
    const allTables: ShowTableRow[] = [];

    const results: any = await this.query(`SELECT TOP 20 
                                          DATABASENAME AS "database",
                                          TABLENAME AS "tableName"
                                          FROM dbc.tables
                                          WHERE tableKind='V' AND databasename='${databaseName}'
                                              `, []);
    
    for (let index = 0; index < results.length; index++) {
      const { database, tableName } = results[index];
      if (database && tableName) {
        allTables.push({ database: database.trim(), tableName: tableName.trim() });
      }
    }
    
    return allTables.flat();
  }

  public toGenericType(columnType: string): string {
    const type = TeradataToGenericType[columnType] || super.toGenericType(columnType);
    return type;
  }

  public async tablesSchema() {
    const tables = await this.getTables();
    console.log('get tables finish');
    const metadata: Record<string, Record<string, object>> = {};

    if (!tables.length) {
      return metadata;
    }

    for (const table of tables) {
      if (table) {
        const { database, tableName } = table;
        if (!(database in metadata) || !database || !tableName) {
          metadata[database] = {};
        }
        console.log(`requests ${database}.${tableName}`);
        const columns = await this.tableColumnTypes(`${database}.${tableName}`);
        console.log('table finish:', table);
        if (columns.length) {
          metadata[database][tableName] = columns;
        }
      }
    }
    
    return metadata;
  }
}
