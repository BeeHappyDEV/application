import {ColumnModel} from "./ColumnModel";
import {ConstraintModel} from "./ConstraintModel";
import {IndexModel} from "./IndexModel";

export interface TableModel {
    pathString: string;
    sourceString: string;
    schemaString: string;
    tableString: string;

    columns: ColumnModel[];
    constraints: ConstraintModel[];
    indexes: IndexModel[];
    comment?: string;
    isTemporary: boolean;
    operation: string;
}