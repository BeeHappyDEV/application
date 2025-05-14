import 'reflect-metadata';
import {container, injectable} from 'tsyringe';
import fsExtra from 'fs-extra';
import path from 'path';
import {CommonsTool} from "./toolkit/CommonsTool";
import {BuilderTool} from "./toolkit/BuilderTool";

interface DatabaseObject {
    name: string;
    fullName: string;
    definition: string;
    sourceFile: string;
}

interface Table extends DatabaseObject {
    comment: string;
}

interface Function extends DatabaseObject {
    // Puedes añadir propiedades específicas de funciones aquí
}

interface Schema {
    tables: Table[];
    functions: Function[];
}

interface SchemaSummary {
    name: string;
    tableCount: number;
    functionCount: number;
}

interface DatabaseObjects {
    schemas: Record<string, Schema>;
    summary: {
        totalTables: number;
        totalFunctions: number;
        schemas: SchemaSummary[];
    };
}

@injectable ()
export class PrepareEntry {

    private readonly sqlRootPath: string = 'src/database';
    private readonly tablesListPath: string = 'src/documentation/database/table_list.md';
    private readonly functionsListPath: string = 'src/documentation/database/function_list.md';
    private readonly summaryPath: string = 'src/documentation/database/schema_summary.md';

    public async generateDatabaseDocumentation (): Promise<void> {

        const databaseObjects = this.processDatabaseDirectory (this.sqlRootPath);
        await this.generateTablesList (databaseObjects);
        await this.generateFunctionsList (databaseObjects);
        await this.generateSummaryReport (databaseObjects);

    }

    private processDatabaseDirectory (pathString: string): DatabaseObjects {

        const consolidatedDatabaseObjects = {
            schemas: {},
            summary: {
                totalTables: 0,
                totalFunctions: 0,
                schemas: []
            }
        };

        const itemStrings = fsExtra.readdirSync (pathString);

        for (const itemString of itemStrings) {

            const fullPath = path.join (pathString, itemString);

            const stats = fsExtra.statSync (fullPath);

            if (stats.isDirectory ()) {

                const partialDatabaseObjects = this.processDatabaseDirectory (fullPath);

                this.mergeDatabaseObjects (consolidatedDatabaseObjects, partialDatabaseObjects);

            } else if (itemString.endsWith ('.sql')) {

                const content = fsExtra.readFileSync (fullPath, 'utf-8');

                this.processFile (content, consolidatedDatabaseObjects, path.relative (this.sqlRootPath, fullPath));

            }

        }

        this.updateSummary (consolidatedDatabaseObjects);

        return consolidatedDatabaseObjects;

    }

    private mergeDatabaseObjects (consolidatedDatabaseObjects: any, partialDatabaseObjects: any): void {

        for (const schemaRecord in partialDatabaseObjects.schemas) {

            if (!consolidatedDatabaseObjects.schemas[schemaRecord]) {

                consolidatedDatabaseObjects.schemas[schemaRecord] = {
                    tables: [],
                    functions: []
                };

            }

            consolidatedDatabaseObjects.schemas[schemaRecord].tables.push (...partialDatabaseObjects.schemas[schemaRecord].tables);
            consolidatedDatabaseObjects.schemas[schemaRecord].functions.push (...partialDatabaseObjects.schemas[schemaRecord].functions);

        }

    }

    private updateSummary (dbObjects: DatabaseObjects): void {
        dbObjects.summary.totalTables = 0;
        dbObjects.summary.totalFunctions = 0;
        dbObjects.summary.schemas = [];

        for (const schemaName in dbObjects.schemas) {
            const schema = dbObjects.schemas[schemaName];
            const tableCount = schema.tables.length;
            const functionCount = schema.functions.length;

            dbObjects.summary.totalTables += tableCount;
            dbObjects.summary.totalFunctions += functionCount;
            dbObjects.summary.schemas.push ({
                name: schemaName,
                tableCount,
                functionCount
            });
        }

        dbObjects.summary.schemas.sort ((a, b) => a.name.localeCompare (b.name));
    }

    private processFile (content: string, dbObjects: DatabaseObjects, filePath: string): void {
        const lines = content.split ('\n');

        for (const line of lines) {
            this.processTable (line, content, dbObjects, filePath);
            this.processFunction (line, dbObjects, filePath);
        }
    }

    private processTable (line: string, content: string, dbObjects: DatabaseObjects, filePath: string): void {
        const tableMatch = line.match (/drop table (?:if exists )?([\w.]+)/i);
        if (!tableMatch) return;

        const fullTableName = tableMatch[1];
        const [schema, tableName] = fullTableName.includes ('.') ?
            fullTableName.split ('.') :
            ['public', fullTableName];

        const commentMatch = content.match (
            new RegExp (`comment on table ${fullTableName} is '([^']+)'`, 'i')
        );

        const tableInfo: Table = {
            name: tableName,
            fullName: fullTableName,
            comment: commentMatch ? commentMatch[1] : '',
            definition: line.trim (),
            sourceFile: filePath
        };

        if (!dbObjects.schemas[schema]) {
            dbObjects.schemas[schema] = {tables: [], functions: []};
        }

        dbObjects.schemas[schema].tables.push (tableInfo);
    }

    private processFunction (line: string, dbObjects: DatabaseObjects, filePath: string): void {
        const functionMatch = line.match (/drop function (?:if exists )?([\w.]+)/i);
        if (!functionMatch) return;

        const fullFunctionName = functionMatch[1];
        const [schema, functionName] = fullFunctionName.includes ('.') ?
            fullFunctionName.split ('.') :
            ['public', fullFunctionName];

        const functionInfo: Function = {
            name: functionName,
            fullName: fullFunctionName,
            definition: line.trim (),
            sourceFile: filePath
        };

        if (!dbObjects.schemas[schema]) {
            dbObjects.schemas[schema] = {tables: [], functions: []};
        }

        dbObjects.schemas[schema].functions.push (functionInfo);

    }

    private async generateSummaryReport (dbObjects: DatabaseObjects): Promise<void> {

        let markdownString = '# Schema List\n\n';

        const dataStrings = await Promise.all (
            dbObjects.summary.schemas.map (async schema => [
                schema.name,
                await CommonsTool.toBlank (schema.tableCount),
                await CommonsTool.toBlank (schema.functionCount),
                await CommonsTool.toBlank (schema.tableCount + schema.functionCount)
            ])
        );

        const tablesNumber = dbObjects.summary.schemas.reduce ((sum, schema) => sum + schema.tableCount, 0);
        const functionsNumber = dbObjects.summary.schemas.reduce ((sum, schema) => sum + schema.functionCount, 0);
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

        fsExtra.writeFileSync (this.summaryPath, markdownString);

    }

    private async generateTablesList (dbObjects: DatabaseObjects): Promise<void> {

        let markdownString = '# Table List\n\n';

        for (const schemaName of Object.keys (dbObjects.schemas).sort ()) {

            const schema = dbObjects.schemas[schemaName];

            if (schema.tables.length === 0) {

                continue;

            }

            markdownString += '### ' + await CommonsTool.toPascalCase (schemaName) + '\n\n';

            const tableArray = [...schema.tables].sort ((a, b) => a.name.localeCompare (b.name));

            markdownString += await BuilderTool.buildTable (['***Name***', '***Abreviation***', '***File***'], tableArray.map (t => [t.name, t.comment, t.sourceFile]));
            markdownString += '\n';

        }

        fsExtra.writeFileSync (this.tablesListPath, markdownString);

    }

    private async generateFunctionsList (dbObjects: DatabaseObjects): Promise<void> {

        let markdownString = '# Function List\n\n';

        for (const schemaName of Object.keys (dbObjects.schemas).sort ()) {

            const schema = dbObjects.schemas[schemaName];

            if (schema.functions.length === 0) {

                continue;

            }

            markdownString += '### ' + await CommonsTool.toPascalCase (schemaName) + '\n\n';

            const sortedFunctions = [...schema.functions].sort ((a, b) => a.name.localeCompare (b.name));

            markdownString += await BuilderTool.buildTable (['***Name***', '***File***'], sortedFunctions.map (f => [f.name, f.sourceFile]));
            markdownString += '\n';

        }

        fsExtra.writeFileSync (this.functionsListPath, markdownString);

    }

}

const prepareEntry = container.resolve (PrepareEntry);
prepareEntry.generateDatabaseDocumentation ().then ();