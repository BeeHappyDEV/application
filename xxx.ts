import {injectable} from 'tsyringe';


@injectable ()
export class FunctionHelper {

    public async parseFunction (fileStructure: FileStructure): Promise<FunctionStructure | null> {

        const contentString = fileStructure.content;

        const pathString = fileStructure.path;

        let regExp = /(?:DROP\s+FUNCTION\s+IF\s+EXISTS\s+[\w.]+\s*;?\s*)?CREATE(?:\s+OR\s+REPLACE)?\s+FUNCTION\s+([\w.]+)\s*\(([^)]*)\)\s*RETURNS\s+([\w]+)(?=\s|$)/i;

        const regExpMatchArray = contentString.match (regExp);

        if (!regExpMatchArray || regExpMatchArray.index === undefined) {

            return null;

        }

        const nameString = regExpMatchArray[1];

        const parametersString = regExpMatchArray[2].trim ();

        const returnString = regExpMatchArray[3].trim ();

        const [schemaString, functionString] = nameString.includes ('.') ? nameString.split ('.') : ['public', nameString];

        const bodyNumber = regExpMatchArray.index + regExpMatchArray[0].length;

        const bodyString = contentString.slice (bodyNumber);

        const parameterStructure: ParameterStructure[] = [];

        if (parametersString) {

            parametersString.split (',').forEach (itemString => {

                const regExpMatchArray = itemString.trim ().match (/(?:in\s+)?(\w+)\s+([\w\[\]]+)/i);

                if (regExpMatchArray) {

                    parameterStructure.push ({
                        name: regExpMatchArray[1].trim (),
                        type: regExpMatchArray[2].trim ()
                    });

                }

            });

        }

        const tableStructure: TableStructure[] = [];

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

                if (!tableStructure.some (t => t.name === operationTableString && t.schema === operationSchemaString && t.operation === regExp.operation)) {

                    tableStructure.push ({
                        schema: operationSchemaString,
                        name: operationTableString,
                        operation: regExp.operation
                    });

                }

            }

        }

        let dependencyStructures: DependencyStructure[] = [];

        regExp = new RegExp ('\\b' + functionString + '\\s*\\(', 'gi');

        if (regExp.test (bodyString)) {

            dependencyStructures.push ({
                name: functionString,
                schema: schemaString,
                isRecursive: true
            });

        }

        regExp = /\b(?:(?:(\w+)\.)?(\w+)\s*\(|CALL\s+(\w+)\.(\w+)\b)/g;

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

                if (!dependencyStructures.some (f => f.name === functionName && f.schema === finalSchema)) {

                    dependencyStructures.push ({
                        name: functionName,
                        schema: finalSchema || undefined,
                        isRecursive: functionName === functionString
                    });

                }

            }

        }

        const excludedStrings = ['generate_series', 'json_array_elements', 'min', 'set'];

        const tableStructures = tableStructure
            .filter (table => !excludedStrings.includes (table.name))
            .sort ((a, b) => {
                const operationStrings = ['SELECT', 'INSERT', 'UPDATE', 'DELETE'];
                const compareNumber = operationStrings.indexOf (a.operation) - operationStrings.indexOf (b.operation);
                return compareNumber !== 0 ? compareNumber : `${a.schema}.${a.name}`.localeCompare (`${b.schema}.${b.name}`);
            });

        dependencyStructures = dependencyStructures
            .filter (f => f.schema)
            .sort ((a, b) => (a.schema || '').localeCompare (b.schema || '') || a.name.localeCompare (b.name));

        return {
            schema: schemaString,
            name: functionString,
            content: contentString,
            parameters: parameterStructure,
            return: returnString,
            tables: tableStructures,
            dependencies: dependencyStructures,
            path: pathString,
            isRecursive: dependencyStructures.some (f => f.isRecursive)
        };

    }

}