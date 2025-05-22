import {injectable} from 'tsyringe';

import {FileModel} from '../../common/model/FileModel';
import {ColumnModel} from "../model/ColumnModel";
import {ConstraintModel} from "../model/ConstraintModel";
import {IndexModel} from "../model/IndexModel";
import {TableModel} from "../model/TableModel";

@injectable ()
export class TableHelper {

    public async process (fileStructure: FileModel): Promise<TableModel | null> {

        const sourceString = fileStructure.sourceString;

        const pathString = fileStructure.pathString;

        const createTableRegExp = /CREATE\s+(?:TEMPORARY\s+|TEMP\s+)?TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([\w.]+)\s*\(([\s\S]*?)\)(?:\s*WITH\s*\([^)]*\))?(?:\s*TABLESPACE\s+\w+)?\s*;/i;

        const regExpMatchArray = sourceString.match (createTableRegExp);

        if (!regExpMatchArray || regExpMatchArray.index === undefined) {

            return null;

        }

        const nameString = regExpMatchArray[1];

        const columnsDefinition = regExpMatchArray[2].trim ();

        const [schemaString, tableString] = nameString.includes ('.') ? nameString.split ('.') : ['public', nameString];

        let tableComment = '';

        const commentRegExp = new RegExp (`COMMENT\\s+ON\\s+TABLE\\s+${nameString.replace ('.', '\\.')}\\s+IS\\s+'([^']*)'`, 'i');

        const commentMatch = sourceString.match (commentRegExp);

        if (commentMatch) {

            tableComment = commentMatch[1];

        }

        const columnStructures: ColumnModel[] = [];

        const columnLines = columnsDefinition.split ('\n')

            .map (line => line.trim ())

            .filter (line => line && !line.startsWith ('CONSTRAINT') && !line.startsWith ('PRIMARY KEY')

                && !line.startsWith ('FOREIGN KEY') && !line.startsWith ('UNIQUE') && !line.startsWith ('CHECK'));

        for (const line of columnLines) {

            const columnRegExp = /^([\w]+)\s+([\w]+(?:\(\d+(?:,\d+)?\))?)(?:\s+(?:COLLATE\s+\w+)?(?:\s+DEFAULT\s+[^,]+)?)?(?:\s+(?:NOT\s+NULL|NULL))?(?:\s+(?:GENERATED\s+(?:ALWAYS|BY\s+DEFAULT)\s+AS\s+IDENTITY)?)?(?:\s+PRIMARY\s+KEY)?/i;

            const columnMatch = line.match (columnRegExp);

            if (columnMatch) {

                const columnName = columnMatch[1].trim ();

                const columnType = columnMatch[2].trim ();

                const isNullable = !line.includes ('NOT NULL');

                const hasDefault = line.includes ('DEFAULT');

                const isPrimaryKey = line.includes ('PRIMARY KEY');

                const isIdentity = line.includes ('GENERATED');

                let columnComment = '';

                const columnCommentRegExp = new RegExp (`COMMENT\\s+ON\\s+COLUMN\\s+${nameString.replace ('.', '\\.')}\\.${columnName}\\s+IS\\s+'([^']*)'`, 'i');

                const columnCommentMatch = sourceString.match (columnCommentRegExp);

                if (columnCommentMatch) {

                    columnComment = columnCommentMatch[1];

                }

                columnStructures.push ({
                    name: columnName,
                    type: columnType,
                    isNullable,
                    hasDefault,
                    isPrimaryKey,
                    isIdentity,
                    comment: columnComment
                });

            }

        }

        const constraintModels: ConstraintModel[] = [];

        let constraintMatch;

        const pkRegExp = /(?:CONSTRAINT\s+([\w]+)\s+)?PRIMARY\s+KEY\s*\(([^)]+)\)/gi;

        while ((constraintMatch = pkRegExp.exec (columnsDefinition)) !== null) {

            constraintModels.push ({
                schema: schemaString,
                name: constraintMatch[1],
                type: 'PRIMARY KEY',
                columns: constraintMatch[2].split (',').map (col => col.trim ()),
                constraintSchema: '',
                constraintTable: '',
                definition: constraintMatch[0],
                referenceColumns: null
            });

        }

        const fkRegExp = /(?:CONSTRAINT\s+([\w]+)\s+)?FOREIGN\s+KEY\s*\(([^)]+)\)\s+REFERENCES\s+([\w.]+)\s*\(([^)]+)\)(?:\s+ON\s+(?:DELETE|UPDATE)\s+(?:CASCADE|SET\sNULL|RESTRICT|NO\sACTION))?/gi;

        while ((constraintMatch = fkRegExp.exec (columnsDefinition)) !== null) {

            const [constraintSchema, constraintTable] = constraintMatch[3].includes ('.') ?

                constraintMatch[3].split ('.') : [schemaString, constraintMatch[3]];

            constraintModels.push ({
                schema: '',
                name: constraintMatch[1] || `${tableString}_${constraintMatch[2].replace (/,/g, '_')}_fkey`,
                type: 'FOREIGN KEY',
                columns: constraintMatch[2].split (',').map (col => col.trim ()),
                constraintSchema: constraintSchema,
                constraintTable: constraintTable,
                referenceColumns: constraintMatch[4].split (',').map (col => col.trim ()),
                definition: constraintMatch[0]
            });

        }

        const uniqueRegExp = /(?:CONSTRAINT\s+([\w]+)\s+)?UNIQUE\s*\(([^)]+)\)/gi;

        while ((constraintMatch = uniqueRegExp.exec (columnsDefinition)) !== null) {

            constraintModels.push ({
                schema: '',
                name: constraintMatch[1] || `${tableString}_${constraintMatch[2].replace (/,/g, '_')}_key`,
                type: 'UNIQUE',
                columns: constraintMatch[2].split (',').map (col => col.trim ()),
                constraintSchema: '',
                constraintTable: '',
                definition: constraintMatch[0],
                referenceColumns: null
            });

        }

        const checkRegExp = /(?:CONSTRAINT\s+([\w]+)\s+)?CHECK\s*\(([^)]+)\)/gi;

        while ((constraintMatch = checkRegExp.exec (columnsDefinition)) !== null) {

            constraintModels.push ({
                constraintSchema: '',
                schema: '',
                name: constraintMatch[1] || `${tableString}_${constraintModels.filter (c => c.type === 'CHECK').length + 1}_check`,
                type: 'CHECK',
                columns: [],
                constraintTable: '',
                referenceColumns: null,
                definition: constraintMatch[0],
                condition: constraintMatch[2]
            });

        }

        const indexStructures: IndexModel[] = [];

        let indexMatch;

        const indexRegExp = new RegExp (`CREATE(?:\\s+UNIQUE)?(?:\\s+CONCURRENTLY)?\\s+INDEX\\s+(?:IF\\s+NOT\\s+EXISTS\\s+)?([\\w.]+)\\s+ON\\s+${nameString.replace ('.', '\\.')}\\s*\\(([^)]+)\\)`, 'gi');

        while ((indexMatch = indexRegExp.exec (sourceString)) !== null) {

            indexStructures.push ({
                name: indexMatch[1],
                isUnique: indexMatch[0].includes ('UNIQUE'),
                columns: indexMatch[2].split (',').map (col => col.trim ()),
                definition: indexMatch[0]
            });

        }

        return {
            schemaString: schemaString,
            tableString: tableString,
            sourceString: sourceString,
            pathString: pathString,
            columns: columnStructures,
            constraints: constraintModels,
            indexes: indexStructures,
            comment: tableComment,
            isTemporary: sourceString.includes ('TEMPORARY TABLE') || sourceString.includes ('TEMP TABLE'),
            operation: ''
        }

    }

}