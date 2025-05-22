export interface ConstraintModel {
    schema: string;
    name: string;
    type: 'PRIMARY KEY' | 'FOREIGN KEY' | 'UNIQUE' | 'CHECK';
    columns: string[];
    constraintSchema: string;
    constraintTable: string;

    referenceColumns: string[] | null;
    definition: string;
    condition?: string;
}