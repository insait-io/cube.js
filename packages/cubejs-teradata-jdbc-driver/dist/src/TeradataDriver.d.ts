import { JDBCDriver, JDBCDriverConfiguration } from '@cubejs-backend/jdbc-driver';
import { TeradataQuery } from './TeradataQuery';
export declare type TeradataDriverConfiguration = JDBCDriverConfiguration & {
    readOnly?: boolean;
};
declare type ShowTableRow = {
    database: string;
    tableName: string;
};
export declare class TeradataDriver extends JDBCDriver {
    protected readonly config: TeradataDriverConfiguration;
    static dialectClass(): typeof TeradataQuery;
    constructor(configuration: Partial<TeradataDriverConfiguration>);
    readOnly(): boolean;
    protected getCustomClassPath(): Promise<string>;
    createSchemaIfNotExists(schemaName: string): Promise<any>;
    quoteIdentifier(identifier: string): string;
    tableColumnTypes(table: string): Promise<{
        name: any;
        type: string;
    }[]>;
    getTablesQuery(databaseName: string): Promise<{
        table_name: any;
    }[]>;
    protected getTables(): Promise<ShowTableRow[]>;
    toGenericType(columnType: string): string;
    tablesSchema(): Promise<Record<string, Record<string, object>>>;
}
export {};
//# sourceMappingURL=TeradataDriver.d.ts.map