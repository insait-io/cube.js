import { BaseFilter, BaseQuery } from '@cubejs-backend/schema-compiler';
declare class TeradataFilter extends BaseFilter {
    likeIgnoreCase(column: any, not: any, param: any, type: string): string;
}
export declare class TeradataQuery extends BaseQuery {
    newFilter(filter: any): TeradataFilter;
    convertTz(field: string): string;
    escapeColumnName(name: string): string;
    getFieldIndex(id: string): any;
    defaultRefreshKeyRenewalThreshold(): number;
}
export {};
//# sourceMappingURL=TeradataQuery.d.ts.map