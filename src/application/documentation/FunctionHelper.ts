import {container, injectable} from 'tsyringe';

import fsExtra from 'fs-extra';
import path from 'path';

import {CommonsTool} from '../toolkit/CommonsTool';
import {BuilderTool} from '../toolkit/BuilderTool';
import {JsonObject} from '../object/JsonObject';

@injectable ()
export class FunctionHelper {

    public async generateDocumentation (paramsObject: JsonObject): Promise<void> {

        paramsObject.set ('txt_directory', 'src/database');
        paramsObject.set ('txt_extension', '.sql');
        paramsObject.set ('txt_output', 'src/documentation/database/function_list.md');

        const databaseObjects = await this.processFunctionDirectory (paramsObject);
        
        await this.createFunctionOutput (paramsObject, databaseObjects);

    }

    private async processFunctionDirectory (paramsObject: JsonObject): Promise<any> {

        const databaseObject = {
            schemas: {}
        };

        const itemStrings = fsExtra.readdirSync (paramsObject.get ('txt_directory'));

        for (const itemString of itemStrings) {

            const directoryString = path.join (paramsObject.get ('txt_directory'), itemString);

            const newParamsObject = container.resolve (JsonObject);

            newParamsObject.set ('txt_directory', directoryString);
            newParamsObject.set ('txt_extension', paramsObject.get ('txt_extension'));

            const stats = fsExtra.statSync (directoryString);

            if (stats.isDirectory ()) {

                const partialDatabaseObject = await this.processFunctionDirectory (newParamsObject);

                await this.mergeFunctionObjects (databaseObject, partialDatabaseObject);

            } else if (itemString.endsWith (paramsObject.get ('txt_extension'))) {

                const contentString = fsExtra.readFileSync (directoryString, 'utf-8');

                await this.processFunctionFile (contentString, databaseObject, path.relative (paramsObject.get ('txt_directory'), directoryString));

            }

        }

        return databaseObject;

    }

    private async processFunctionFile (contentString: string, databaseObject: any, filePath: string): Promise<void> {

        const lineStrings = contentString.split ('\n');

        for (const lineString of lineStrings) {

            const functionStrings = lineString.match (/drop function (?:if exists )?([\w.]+)/i);

            if (!functionStrings) {

                return;

            }

            const [schemaString, functionString] = functionStrings[1].includes ('.') ? functionStrings[1].split ('.') : ['public', functionStrings[1]];

            const functionObject = {
                name: functionString,
                sourceFile: filePath
            };

            if (!databaseObject.schemas[schemaString]) {

                databaseObject.schemas[schemaString] = {functions: []};

            }

            databaseObject.schemas[schemaString].functions.push (functionObject);

        }

    }

    private async mergeFunctionObjects (databaseObject: any, partialDatabaseObject: any): Promise<void> {

        for (const schemaString in partialDatabaseObject.schemas) {

            if (!databaseObject.schemas[schemaString]) {

                databaseObject.schemas[schemaString] = {
                    functions: []
                };

            }

            databaseObject.schemas[schemaString].functions.push (...partialDatabaseObject.schemas[schemaString].functions);

        }

    }

    private async createFunctionOutput (paramsObject: JsonObject, databaseObject: any): Promise<void> {

        let markdownString = '# Function List\n';

        for (const schemaName of Object.keys (databaseObject.schemas).sort ()) {

            const schema = databaseObject.schemas[schemaName];

            if (schema.functions.length === 0) {

                continue;

            }

            markdownString += '\n### ' + await CommonsTool.toPascalCase (schemaName) + '\n\n';

            const functionArray = [...schema.functions].sort ((a, b) => a.name.localeCompare (b.name));

            markdownString += await BuilderTool.buildTable (['***Name***', '***File***'], functionArray.map (t => [t.name, t.sourceFile]));

        }

        fsExtra.writeFileSync (paramsObject.get ('txt_output'), markdownString);

    }

}