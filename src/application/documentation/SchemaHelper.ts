import {container, injectable} from 'tsyringe';

import fsExtra from 'fs-extra';
import path from 'path';

import {CommonsTool} from '../toolkit/CommonsTool';
import {BuilderTool} from '../toolkit/BuilderTool';
import {JsonObject} from '../object/JsonObject';

@injectable ()
export class SchemaHelper {

    public async generateDocumentation (paramsObject: JsonObject): Promise<void> {

        paramsObject.set ('txt_directory', 'src/database');
        paramsObject.set ('txt_extension', '.sql');
        paramsObject.set ('txt_output', 'src/documentation/database/schema_list.md');

        const databaseObjects = await this.processSchemaDirectory (paramsObject);

        await this.createSchemaOutput (paramsObject, databaseObjects);

    }

    private async processSchemaDirectory (paramsObject: JsonObject): Promise<any> {

        const databaseObject = {
            schemas: {},
            summary: {
                totalFunctions: 0,
                totalTables: 0,
                schemas: []
            }
        };

        const itemStrings = fsExtra.readdirSync (paramsObject.get ('txt_directory'));

        for (const itemString of itemStrings) {

            const directoryString = path.join (paramsObject.get ('txt_directory'), itemString);

            const newParamsObject = container.resolve (JsonObject);

            newParamsObject.set ('txt_directory', directoryString);
            newParamsObject.set ('txt_extension', paramsObject.get ('txt_extension'));

            const stats = fsExtra.statSync (directoryString);

            if (stats.isDirectory ()) {

                const partialDatabaseObject = await this.processSchemaDirectory (newParamsObject);

                await this.mergeSchemaObjects (databaseObject, partialDatabaseObject);

            } else if (itemString.endsWith (paramsObject.get ('txt_extension'))) {

                const contentString = fsExtra.readFileSync (directoryString, 'utf-8');

                await this.processFunctionSchemaFile (contentString, databaseObject, path.relative (paramsObject.get ('txt_directory'), directoryString));
                await this.processTableSchemaFile (contentString, databaseObject, path.relative (paramsObject.get ('txt_directory'), directoryString));

            }

        }

        await this.updateSummary (databaseObject);

        return databaseObject;

    }

    private async processFunctionSchemaFile (contentString: string, databaseObject: any, filePath: string): Promise<void> {

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

                databaseObject.schemas[schemaString] = {functions: [], tables: []};

            }

            databaseObject.schemas[schemaString].functions.push (functionObject);

        }

    }

    private async processTableSchemaFile (contentString: string, databaseObject: any, filePath: string): Promise<void> {

        const lineStrings = contentString.split ('\n');

        for (const lineString of lineStrings) {

            const tableStrings = lineString.match (/drop table (?:if exists )?([\w.]+)/i);

            if (!tableStrings) {

                return;

            }

            const [schemaString, tableString] = tableStrings[1].includes ('.') ? tableStrings[1].split ('.') : ['public', tableStrings[1]];

            const tableObject = {
                name: tableString,
                sourceFile: filePath
            };

            if (!databaseObject.schemas[schemaString]) {

                databaseObject.schemas[schemaString] = {functions: [], tables: []};

            }

            databaseObject.schemas[schemaString].tables.push (tableObject);

        }

    }

    private async mergeSchemaObjects (databaseObject: any, partialDatabaseObject: any): Promise<void> {

        for (const schemaString in partialDatabaseObject.schemas) {

            if (!databaseObject.schemas[schemaString]) {

                databaseObject.schemas[schemaString] = {
                    functions: [],
                    tables: []
                };

            }

            databaseObject.schemas[schemaString].functions.push (...partialDatabaseObject.schemas[schemaString].functions);
            databaseObject.schemas[schemaString].tables.push (...partialDatabaseObject.schemas[schemaString].tables);

        }

    }

    private async updateSummary (databaseObject: any): Promise<void> {

        databaseObject.summary.totalTables = 0;
        databaseObject.summary.totalFunctions = 0;
        databaseObject.summary.schemas = [];

        for (const schemaName in databaseObject.schemas) {
            const schemaAny = databaseObject.schemas[schemaName];
            const tableCount = schemaAny.tables.length;
            const functionCount = schemaAny.functions.length;

            databaseObject.summary.totalTables += tableCount;
            databaseObject.summary.totalFunctions += functionCount;
            databaseObject.summary.schemas.push ({
                name: schemaName,
                tableCount,
                functionCount
            });
        }

        databaseObject.summary.schemas.sort ((a: { name: string; }, b: {
            name: any;
        }) => a.name.localeCompare (b.name));

    }

    private async createSchemaOutput (paramsObject: JsonObject, databaseObject: any): Promise<void> {

        let markdownString = '# Schema List\n\n';

        const dataStrings = await Promise.all (
            databaseObject.summary.schemas.map (async (schema: {
                name: any;
                tableCount: number;
                functionCount: number;
            }) => [
                schema.name,
                await CommonsTool.toBlank (schema.tableCount),
                await CommonsTool.toBlank (schema.functionCount),
                await CommonsTool.toBlank (schema.tableCount + schema.functionCount)
            ])
        );

        const tablesNumber = databaseObject.summary.schemas.reduce ((sum: any, schema: {
            tableCount: any;
        }) => sum + schema.tableCount, 0);
        const functionsNumber = databaseObject.summary.schemas.reduce ((sum: any, schema: {
            functionCount: any;
        }) => sum + schema.functionCount, 0);
        const totalNumber = tablesNumber + functionsNumber;

        dataStrings.push ([
            '**Total**',
            '**' + await CommonsTool.toBlank (tablesNumber) + '**',
            '**' + await CommonsTool.toBlank (functionsNumber) + '**',
            '**' + await CommonsTool.toBlank (totalNumber) + '**'
        ]);

        markdownString += await BuilderTool.buildTable (
            ['***Scheme***', '***Tables***', '***Functions***', '***Total***'],
            dataStrings
        );

        fsExtra.writeFileSync (paramsObject.get ('txt_output'), markdownString);

    }

}