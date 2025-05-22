export interface ColumnModel {
    name: string;
    type: string;
    isNullable: boolean;
    hasDefault: boolean;
    isPrimaryKey: boolean;
    isIdentity: boolean;
    comment?: string;
}