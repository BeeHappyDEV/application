import {injectable} from 'tsyringe';

import {FileModel} from '../../common/model/FileModel';
import {FunctionModel} from '../model/FunctionModel';
import {ParameterModel} from '../model/ParameterModel';
import {TableModel} from '../model/TableModel';

@injectable ()
export class FunctionHelper {

    public async process (fileModel: FileModel): Promise<FunctionModel | null> {

        const pathString = await this.getPathString (fileModel);
        const sourceString = await this.getSourceString (fileModel);

        let regExp = /(?:DROP\s+FUNCTION\s+IF\s+EXISTS\s+[\w.]+\s*;?\s*)?CREATE(?:\s+OR\s+REPLACE)?\s+FUNCTION\s+([\w.]+)\s*\(([^)]*)\)\s*RETURNS\s+([\w]+)(?=\s|$)/i;

        const regExpMatchArray = sourceString.match (regExp);

        if (!regExpMatchArray || regExpMatchArray.index === undefined) {

            return null;

        }

        const schemaString = await this.getSchemaString (regExpMatchArray);
        const functionString = await this.getFunctionString (regExpMatchArray)
        const returnString = await this.getReturnString (regExpMatchArray);
        const parameterModels = await this.getParameterModels (regExpMatchArray);
        const tableModels = await this.getTableModels (sourceString, regExpMatchArray);
        const dependencyModels = await this.getDependencyModels (sourceString, regExpMatchArray);

        return {
            pathString: pathString,
            sourceString: sourceString,
            schemaString: schemaString,
            functionString: functionString,
            returnString: returnString,
            parameterModels: parameterModels,
            tableModels: tableModels,
            dependencyModels: dependencyModels,
            isRecursive: false //dependencyModels.some (f => f.isRecursive)
        };

    }

    private async getPathString (fileModel: FileModel): Promise<string> {

        return fileModel.pathString;

    }

    private async getSourceString (fileModel: FileModel): Promise<string> {

        return fileModel.sourceString;

    }

    private async getSchemaString (regExpMatchArray: RegExpMatchArray): Promise<string> {

        return regExpMatchArray[1].includes ('.') ? regExpMatchArray[1].split ('.')[0] : 'public';

    }

    private async getFunctionString (regExpMatchArray: RegExpMatchArray): Promise<string> {

        return regExpMatchArray[1].includes ('.') ? regExpMatchArray[1].split ('.')[1] : regExpMatchArray[0];

    }

    private async getReturnString (regExpMatchArray: RegExpMatchArray): Promise<string> {

        return regExpMatchArray[3].trim ();

    }

    private async getParameterModels (regExpMatchArray: RegExpMatchArray): Promise<ParameterModel[]> {

        const parametersString = regExpMatchArray[2].trim ();

        const parameterModels: ParameterModel[] = [];

        if (parametersString) {

            parametersString.split (',').forEach (itemString => {

                const regExpMatchArray = itemString.trim ().match (/(?:in\s+)?(\w+)\s+([\w\[\]]+)/i);

                if (regExpMatchArray) {

                    parameterModels.push ({
                        name: regExpMatchArray[1].trim (),
                        type: regExpMatchArray[2].trim ()
                    });

                }

            });

        }

        return parameterModels;

    }

    private async getTableModels (sourceString: string, regExpMatchArray: RegExpMatchArray): Promise<TableModel[]> {

        const tableModels: TableModel[] = [];

        if (regExpMatchArray.index === undefined) {

            return tableModels;

        }

        const bodyNumber = regExpMatchArray.index + regExpMatchArray[0].length;

        const bodyString = sourceString.slice (bodyNumber);

        const schemaString = regExpMatchArray[1].includes ('.') ? regExpMatchArray[1].split ('.')[0] : 'public';

        const regExps = [
            {regex: /(?:FROM|JOIN)\s+([\w.]+)/gi, operation: 'SELECT'},
            {regex: /INSERT\s+INTO\s+([\w.]+)/gi, operation: 'INSERT'},
            {regex: /UPDATE\s+([\w.]+)/gi, operation: 'UPDATE'},
            {regex: /DELETE\s+FROM\s+([\w.]+)/gi, operation: 'DELETE'}
        ];

        let regExpExecArray;

        for (const regExp of regExps) {

            while ((regExpExecArray = regExp.regex.exec (bodyString)) !== null) {

                const operationObjectString = regExpExecArray[1].replace (/["`]/g, '');

                const [operationSchemaString, operationTableString] = operationObjectString.includes ('.') ? operationObjectString.split ('.') : [schemaString, operationObjectString];

                if (!tableModels.some (t => t.tableString === operationTableString && t.schemaString === operationSchemaString && t.operation === regExp.operation)) {

                    tableModels.push ({
                        pathString: '',
                        sourceString: '',
                        schemaString: operationSchemaString,
                        tableString: operationTableString,
                        columns: [],
                        constraints: [],
                        indexes: [],
                        comment: '',
                        isTemporary: false,
                        operation: regExp.operation
                    });

                }

            }

        }

        return tableModels;

    }

    private async getDependencyModels (sourceString: string, regExpMatchArray: RegExpMatchArray): Promise<DependencyModel[]> {

        let dependencyModels: DependencyModel[] = [];

        if (regExpMatchArray.index === undefined) {

            return dependencyModels;

        }

        const bodyNumber = regExpMatchArray.index + regExpMatchArray[0].length;

        const bodyString = sourceString.slice (bodyNumber);

        const schemaString = regExpMatchArray[1].includes ('.') ? regExpMatchArray[1].split ('.')[0] : 'public';

        const functionString = regExpMatchArray[1].includes ('.') ? regExpMatchArray[1].split ('.')[1] : regExpMatchArray[0];

        let regExp = new RegExp ('\\b' + functionString + '\\s*\\(', 'gi');

        if (regExp.test (bodyString)) {

            dependencyModels.push ({
                name: functionString,
                schema: schemaString,
                isRecursive: true
            });

        }

        regExp = /\b(?:(?:(\w+)\.)?(\w+)\s*\(|CALL\s+(\w+)\.(\w+)\b)/g;

        let regExpExecArray;

        while ((regExpExecArray = regExp.exec (bodyString)) !== null) {

            const possibleSchema = regExpExecArray[1] || regExpExecArray[3];

            const functionName = regExpExecArray[2] || regExpExecArray[4];

            if (!this.isBuiltInFunction (functionName) && !this.isSqlKeyword (functionName)) {

                let finalSchema = possibleSchema;

                if (!finalSchema) {

                    let regExpMatchArray = bodyString.match (new RegExp (`\\b(\\w+)\\.${functionName}\\b`, 'g'));

                    if (regExpMatchArray) {

                        finalSchema = regExpMatchArray[0].split ('.')[0];

                    }

                }

                if (!dependencyModels.some (f => f.name === functionName && f.schema === finalSchema)) {

                    dependencyModels.push ({
                        name: functionName,
                        schema: finalSchema,
                        isRecursive: functionName === functionString
                    });

                }

            }

        }

        const excludedStrings = ['generate_series', 'json_array_elements', 'min', 'set'];

        dependencyModels = dependencyModels
            .filter (f => f.schema)
            .sort ((a, b) => (a.schema || '').localeCompare (b.schema || '') || a.name.localeCompare (b.name));

        return dependencyModels;

    }


    private isSqlKeyword (name: string): boolean {

        const sqlKeywords = [
            'lag', 'over', 'values', 'conflict', 'sign', 'replace',
            'extract', 'to_char', 'coalesce', 'current_date', 'now'
        ];

        return sqlKeywords.includes (name.toLowerCase ());

    }

    private isBuiltInFunction (name: string): boolean {

        const builtIns = new Set ([
            'array_agg',
            'avg',
            'ceil',
            'coalesce',
            'conflict',
            'count',
            'current_date',
            'current_timestamp',
            'date_part',
            'exists',
            'extract',
            'floor',
            'generate_series',
            'greatest',
            'jsonb_array_elements',
            'lag',
            'least',
            'lower',
            'max',
            'min',
            'now',
            'nullif',
            'over',
            'replace',
            'round',
            'sign',
            'string_agg',
            'sum',
            'to_char',
            'to_date',
            'to_timestamp',
            'trim',
            'upper',
            'values'
        ]);

        return builtIns.has (name.toLowerCase ());

    }

}