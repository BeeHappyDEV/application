import 'reflect-metadata';
import {container, injectable} from 'tsyringe';
import fsExtra from 'fs-extra';
import path from 'path';
import {CommonsTool} from "./toolkit/CommonsTool";

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
    private readonly docsPath: string = './src/documentation/database';
    private readonly tablesListPath: string = './src/documentation/database/tables-list.md';
    private readonly functionsListPath: string = './src/documentation/database/functions-list.md';
    private readonly summaryPath: string = './src/documentation/database/schema-summary.md';

    public async generateDocumentation (): Promise<void> {

        try {
            if (!fsExtra.existsSync (this.docsPath)) {
                fsExtra.mkdirSync (this.docsPath, {recursive: true});
            }

            const databaseObjects = this.processDirectory (this.sqlRootPath);
            await this.generateTablesList (databaseObjects);
            await this.generateFunctionsList (databaseObjects);
            await this.generateSummaryReport (databaseObjects);

            console.log (`Documentación generada en: ${this.docsPath}`);
        } catch (error) {
            console.error ('Error generando documentación:', error);
        }
    }

    private processDirectory (pathString: string): DatabaseObjects {
        const result: DatabaseObjects = {
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

                const subResult = this.processDirectory (fullPath);

                this.mergeDatabaseObjects (result, subResult);

            } else if (itemString.endsWith ('.sql')) {

                const content = fsExtra.readFileSync (fullPath, 'utf-8');

                this.processFile (content, result, path.relative (this.sqlRootPath, fullPath));

            }

        }

        this.updateSummary (result);

        return result;

    }

    private mergeDatabaseObjects (target: DatabaseObjects, source: DatabaseObjects): void {
        for (const schemaName in source.schemas) {
            if (!target.schemas[schemaName]) {
                target.schemas[schemaName] = {
                    tables: [],
                    functions: []
                };
            }

            target.schemas[schemaName].tables.push (...source.schemas[schemaName].tables);
            target.schemas[schemaName].functions.push (...source.schemas[schemaName].functions);
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

        markdownString += await this.buildTable (
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

            markdownString += await this.buildTable (['***Name***', '***Abreviation***', '***File***'], tableArray.map (t => [t.name, t.comment, t.sourceFile]));
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

            markdownString += await this.buildTable (['***Name***', '***File***'], sortedFunctions.map (f => [f.name, f.sourceFile]));
            markdownString += '\n';

        }

        fsExtra.writeFileSync (this.functionsListPath, markdownString);

    }

    private async buildTable (headerStrings: string[], dataStrings: string[][]): Promise<string> {

        const widthNumbers = await this.calculateColumnWidths (headerStrings, dataStrings);

        let tableString = await this.buildHeaderRow (headerStrings, widthNumbers);
        tableString += await this.buildSeparatorRow (headerStrings, widthNumbers);
        tableString += await this.buildDataRows (dataStrings, widthNumbers);

        return tableString;

    }

    private async calculateColumnWidths (headerStrings: string[], dataStrings: string[][]): Promise<number[]> {

        return headerStrings.map ((headerString, offsetNumber) => {

            const lengthNumber = Math.max (...dataStrings.map (rowString => rowString[offsetNumber]?.length || 0));

            return Math.max (headerString.length, lengthNumber);

        });

    }

    private async buildHeaderRow (headerStrings: string[], widthNumbers: number[]): Promise<string> {

        let rowString = '|';

        for (let offsetNumber = 0; offsetNumber < headerStrings.length; offsetNumber++) {

            rowString += ' ' + headerStrings[offsetNumber].padEnd (widthNumbers[offsetNumber]) + ' |';

        }

        return rowString + '\n';

    }

    private async buildSeparatorRow (headerStrings: string[], widthNumbers: number[]): Promise<string> {

        let rowString = '|';

        for (let offsetNumber = 0; offsetNumber < headerStrings.length; offsetNumber++) {

            rowString += '-' + '-'.repeat (widthNumbers[offsetNumber]) + '-|';

        }

        return rowString + '\n';

    }

    private async buildDataRows (dataStrings: string[][], widthNumbers: number[]): Promise<string> {

        let rowString = '';

        for (const row of dataStrings) {

            rowString += '|';

            for (let offsetNumber = 0; offsetNumber < row.length; offsetNumber++) {

                rowString += ' ' + row[offsetNumber].padEnd (widthNumbers[offsetNumber]) + ' |';

            }

            rowString += '\n';

        }

        return rowString;

    }

}

const prepareEntry = container.resolve (PrepareEntry);
prepareEntry.generateDocumentation ().then ();