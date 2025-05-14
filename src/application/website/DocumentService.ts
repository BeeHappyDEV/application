import {container, injectable} from 'tsyringe';

import fsExtra from 'fs-extra';

import {CommonsTool} from '../toolkit/CommonsTool';
import {ExceptionTool} from '../toolkit/ExceptionTool';
import {LogTool} from '../toolkit/LogTool';
import {JsonObject} from '../object/JsonObject';
import {ResultObject} from '../object/ResultObject';
import {BuilderTool} from "../toolkit/BuilderTool";
import path from "path";

@injectable ()
export class DocumentService {

    public async getGenerateAction (paramsObject: JsonObject, traceObject: JsonObject): Promise<ResultObject> {

        const stackStrings = await CommonsTool.getStackStrings ();

        const logTool = container.resolve (LogTool);
        logTool.initialize (stackStrings, traceObject);

        const resultObject = container.resolve (ResultObject);

        await this.generateMainDocumentation (paramsObject, traceObject);
        await this.generateDatabaseDocumentation (paramsObject, traceObject);

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    private async generateMainDocumentation (paramsObject: JsonObject, traceObject: JsonObject): Promise<ResultObject> {

        const stackStrings = await CommonsTool.getStackStrings ();

        const logTool = container.resolve (LogTool);
        logTool.initialize (stackStrings, traceObject);

        const packageString = './package.json';

        const packageJson = await fsExtra.readJson (packageString);

        paramsObject.set ('txt_package', packageString);
        paramsObject.set ('jsn_package', packageJson);
        paramsObject.set ('txt_location', 'src/documentation/environment/environment_configuration.md');

        const resultObject = container.resolve (ResultObject);

        try {

            await this.updateApplicationVersion (paramsObject, logTool.trace ());
            await this.generateEnvironmentConfiguration (paramsObject, logTool.trace ());

            resultObject.setResult (ExceptionTool.SUCCESSFUL ());

        } catch (exception) {

            resultObject.setResult (ExceptionTool.APPLICATION_EXCEPTION (stackStrings));

            logTool.exception ();

        }

        paramsObject.del ('txt_package');
        paramsObject.del ('jsn_package');
        paramsObject.del ('txt_location');

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    private async updateApplicationVersion (paramsObject: JsonObject, traceObject: JsonObject): Promise<ResultObject> {

        const stackStrings = await CommonsTool.getStackStrings ();

        const logTool = container.resolve (LogTool);
        logTool.initialize (stackStrings, traceObject);

        let resultObject = container.resolve (ResultObject);

        const date = new Date ();

        const dateString = [date.getFullYear (), String (date.getMonth () + 1).padStart (2, '0'), String (date.getDate ()).padStart (2, '0')].join ('.');

        const versionString = paramsObject.get ('txt_version') + '/' + dateString;

        const packageObject = paramsObject.get ('jsn_package');

        packageObject.version = versionString;

        await fsExtra.writeJson (paramsObject.get ('txt_package'), packageObject, {spaces: 2});

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    private async generateEnvironmentConfiguration (paramsObject: JsonObject, traceObject: JsonObject): Promise<void> {

        const stackStrings = await CommonsTool.getStackStrings ();

        const logTool = container.resolve (LogTool);
        logTool.initialize (stackStrings, traceObject);

        const packageObject = paramsObject.get ('jsn_package');

        let markdownString = '# Environment Configuration\n\n';

        markdownString += '### Scripts Configuration\n\n'
        markdownString += await BuilderTool.buildTable (['***Script***', '***Description***'], Object.entries (packageObject.scripts));
        markdownString += '\n<br/>\n\n';

        markdownString += '### Runtime Dependencies List\n\n'
        markdownString += await BuilderTool.buildTable (['***Dependency***', '***Version***'], Object.entries (packageObject.dependencies));
        markdownString += '\n<br/>\n\n';

        markdownString += '### Development Dependencies List\n\n'
        markdownString += await BuilderTool.buildTable (['***Name***', '***Abbreviation***'], Object.entries (packageObject.devDependencies));

        await fsExtra.writeFile (paramsObject.get ('txt_location'), markdownString);

        logTool.finalize ();

    }

    /**
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     */

    private async generateDatabaseDocumentation (paramsObject: JsonObject, traceObject: JsonObject): Promise<void> {

        const stackStrings = await CommonsTool.getStackStrings ();

        const logTool = container.resolve (LogTool);
        logTool.initialize (stackStrings, traceObject);

        paramsObject.set ('txt_directory', 'src/database');

        const databaseObjects = await this.processDatabaseDirectory (paramsObject.get ('txt_directory'));

        await this.generateTablesList (databaseObjects);
        /*await this.generateFunctionsList (databaseObjects);
        await this.generateSummaryReport (databaseObjects);*/

        logTool.finalize ();

    }

    private async processDatabaseDirectory (directoryString: string): Promise<any> {

        const databaseObject = {
            schemas: {},
            summary: {
                totalTables: 0,
                totalFunctions: 0,
                schemas: []
            }
        };

        const itemStrings = fsExtra.readdirSync (directoryString);

        for (const itemString of itemStrings) {

            const pathString = path.join (directoryString, itemString);

            const stats = fsExtra.statSync (pathString);

            if (stats.isDirectory ()) {

                console.log(pathString);

                const partialDatabaseObject = this.processDatabaseDirectory (pathString);

                await this.mergeDatabaseObjects (databaseObject, partialDatabaseObject);

            } else if (itemString.endsWith ('.sql')) {

                const contentString = fsExtra.readFileSync (pathString, 'utf-8');

                await this.processDatabaseFile (contentString, databaseObject, path.relative (directoryString, pathString));

            }

        }

        await this.updateSummary (databaseObject);

        return databaseObject;

    }

    private async mergeDatabaseObjects (databaseObject: any, partialDatabaseObject: any): Promise<void> {

        for (const schemaString in partialDatabaseObject.schemas) {

            if (!databaseObject.schemas[schemaString]) {

                databaseObject.schemas[schemaString] = {
                    tables: [],
                    functions: []
                };

            }

            databaseObject.schemas[schemaString].tables.push (...partialDatabaseObject.schemas[schemaString].tables);
            databaseObject.schemas[schemaString].functions.push (...partialDatabaseObject.schemas[schemaString].functions);

        }

    }

    private async updateSummary (databaseObject: any): Promise<void> {

        databaseObject.summary.totalTables = 0;
        databaseObject.summary.totalFunctions = 0;
        databaseObject.summary.schemas = [];

        for (const schemaString in databaseObject.schemas) {
//TODO
            const schema = databaseObject.schemas[schemaString];
            const tableCount = schema.tables.length;
            const functionCount = schema.functions.length;

            databaseObject.summary.totalTables += tableCount;
            databaseObject.summary.totalFunctions += functionCount;
            databaseObject.summary.schemas.push ({
                name: schemaString,
                tableCount,
                functionCount
            });
        }

        databaseObject.summary.schemas.sort ((a: { name: string; }, b: {
            name: any;
        }) => a.name.localeCompare (b.name));

    }

    private async processDatabaseFile (contentString: string, databaseObject: any, filePath: string): Promise<void> {

        const lineStrings = contentString.split ('\n');

        for (const lineString of lineStrings) {

            await this.processTable (lineString, contentString, databaseObject, filePath);
            //await this.processFunction (lineString, databaseObject, filePath);

        }

    }

    private async processTable (lineString: string, contentString: string, databaseObject: any, filePath: string): Promise<void> {

        const tableStrings = lineString.match (/drop table (?:if exists )?([\w.]+)/i);

        if (!tableStrings) {

            return;

        }

        const fullTableName = tableStrings[1];

        const [schemaString, tableString] = fullTableName.includes ('.') ? fullTableName.split ('.') : ['public', fullTableName];

        const commentMatch = contentString.match (
            new RegExp (`comment on table ${fullTableName} is '([^']+)'`, 'i')
        );

        const tableInfo = {
            name: tableString,
            fullName: fullTableName,
            comment: commentMatch ? commentMatch[1] : '',
            definition: lineString.trim (),
            sourceFile: filePath
        };

        if (!databaseObject.schemas[schemaString]) {

            databaseObject.schemas[schemaString] = {tables: [], functions: []};

        }

        databaseObject.schemas[schemaString].tables.push (tableInfo);

    }

    private async generateTablesList (databaseObject: any): Promise<void> {

        let markdownString = '# Table List\n\n';

        for (const schemaName of Object.keys (databaseObject.schemas).sort ()) {

            const schema = databaseObject.schemas[schemaName];

            if (schema.tables.length === 0) {

                continue;

            }

            markdownString += '### ' + await CommonsTool.toPascalCase (schemaName) + '\n\n';

            const tableArray = [...schema.tables].sort ((a, b) => a.name.localeCompare (b.name));

            markdownString += await BuilderTool.buildTable (['***Name***', '***Abreviation***', '***File***'], tableArray.map (t => [t.name, t.comment, t.sourceFile]));
            markdownString += '\n';

        }

        fsExtra.writeFileSync ('./tables.md', markdownString);

    }

}