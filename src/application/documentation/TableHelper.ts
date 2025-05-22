import {container, injectable} from 'tsyringe';

import fsExtra from 'fs-extra';
import path from 'path';

import {CommonsTool} from '../toolkit/CommonsTool';
import {JsonObject} from '../object/JsonObject';

@injectable ()
export class TableHelper {

    public async generateDocumentation (paramsObject: JsonObject): Promise<void> {

        paramsObject.set ('txt_directory', 'src/database');
        paramsObject.set ('txt_extension', '.sql');
        paramsObject.set ('txt_output', 'src/documentation/database/environment_configuration.md');

        const databaseObjects = await this.processTableDirectory (paramsObject);

        await this.createTableOutput (paramsObject, databaseObjects);

    }

    private async processTableDirectory (paramsObject: JsonObject): Promise<any> {

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

                const partialDatabaseObject = await this.processTableDirectory (newParamsObject);

                await this.mergeTableObjects (databaseObject, partialDatabaseObject);

            } else if (itemString.endsWith (paramsObject.get ('txt_extension'))) {

                const contentString = fsExtra.readFileSync (directoryString, 'utf-8');

                await this.processTableFile (contentString, databaseObject, path.relative (paramsObject.get ('txt_directory'), directoryString));

            }

        }

        return databaseObject;

    }

    private async processTableFile (contentString: string, databaseObject: any, filePath: string): Promise<void> {

        const lineStrings = contentString.split ('\n');

        for (const lineString of lineStrings) {

            const tableStrings = lineString.match (/drop table (?:if exists )?([\w.]+)/i);

            if (!tableStrings) {

                return;

            }

            const [schemaString, tableString] = tableStrings[1].includes ('.') ? tableStrings[1].split ('.') : ['public', tableStrings[1]];

            const commentString = contentString.match (
                new RegExp (`comment on table ${tableStrings[1]} is '([^']+)'`, 'i')
            );

            const tableObject = {
                name: tableString,
                comment: commentString ? commentString[1] : '',
                sourceFile: filePath
            };

            if (!databaseObject.schemas[schemaString]) {

                databaseObject.schemas[schemaString] = {tables: []};

            }

            databaseObject.schemas[schemaString].tables.push (tableObject);

        }

    }

    private async mergeTableObjects (databaseObject: any, partialDatabaseObject: any): Promise<void> {

        for (const schemaString in partialDatabaseObject.schemas) {

            if (!databaseObject.schemas[schemaString]) {

                databaseObject.schemas[schemaString] = {
                    tables: []
                };

            }

            databaseObject.schemas[schemaString].tables.push (...partialDatabaseObject.schemas[schemaString].tables);

        }

    }

    private async createTableOutput (paramsObject: JsonObject, databaseObject: any): Promise<void> {

        let markdownString = '# Table List\n';

        for (const schemaName of Object.keys (databaseObject.schemas).sort ()) {

            const schema = databaseObject.schemas[schemaName];

            if (schema.tables.length === 0) {

                continue;

            }

            markdownString += '\n### ' + await CommonsTool.toPascalCase (schemaName) + '\n\n';

        }

        fsExtra.writeFileSync (paramsObject.get ('txt_output'), markdownString);

    }

}