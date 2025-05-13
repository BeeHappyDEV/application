import 'reflect-metadata';

import {container, injectable} from 'tsyringe';

import fsExtra from 'fs-extra';
import path from 'path';

interface TableInfo {
    name: string;
    comment: string;
    definition: string;
}

interface FunctionInfo {
    name: string;
    definition: string;
}

@injectable ()
export class PrepareEntry {

    private readonly sqlFolderPath: string = 'src/database';
    private readonly outputPath: string = './docs/database-reference.md';


    public async generateDocumentation(): Promise<void> {
        try {
            // Crear directorio de docs si no existe
            if (!fsExtra.existsSync(path.dirname(this.outputPath))) {
                fsExtra.mkdirSync(path.dirname(this.outputPath), { recursive: true });
            }

            // Leer archivos SQL
            const files = fsExtra.readdirSync(this.sqlFolderPath);
            const tables: TableInfo[] = [];
            const functions: FunctionInfo[] = [];

            for (const file of files) {
                if (file.endsWith('.sql')) {
                    const content = fsExtra.readFileSync(path.join(this.sqlFolderPath, file), 'utf-8');
                    this.parseSqlFile(content, tables, functions);
                }
            }

            // Generar contenido Markdown
            const markdownContent = this.generateMarkdown(tables, functions);
            fsExtra.writeFileSync(this.outputPath, markdownContent);

            console.log(`Documentación generada en: ${this.outputPath}`);
        } catch (error) {
            console.error('Error generando documentación:', error);
        }
    }

    private parseSqlFile(content: string, tables: TableInfo[], functions: FunctionInfo[]): void {
        const lines = content.split('\n');

        for (const line of lines) {
            // Extraer tablas
            const tableMatch = line.match(/drop table if exists (\w+)/i);
            if (tableMatch) {
                const tableName = tableMatch[1];
                const commentMatch = content.match(new RegExp(`comment on table ${tableName} is '([^']+)'`, 'i'));
                tables.push({
                    name: tableName,
                    comment: commentMatch ? commentMatch[1] : 'Sin comentario',
                    definition: line
                });
            }

            // Extraer funciones
            const functionMatch = line.match(/drop function if exists (\w+)/i);
            if (functionMatch) {
                functions.push({
                    name: functionMatch[1],
                    definition: line
                });
            }
        }
    }

    private generateMarkdown(tables: TableInfo[], functions: FunctionInfo[]): string {
        let content = '# Referencia de Base de Datos\n\n';

        // Tabla de tablas
        content += '## Tablas\n\n';
        content += this.createTable(
            ['Nombre', 'Descripción'],
            tables.map(t => [t.name, t.comment])
        );

        // Tabla de funciones (en otra página)
        const functionsPath = './docs/database-functions.md';
        const functionsContent = '## Funciones\n\n' + this.createTable(
            ['Nombre', 'Definición'],
            functions.map(f => [f.name, f.definition.split('\n')[0]]) // Primera línea de definición
        );
        fsExtra.writeFileSync(functionsPath, functionsContent);

        content += `\n\n[Ver listado de funciones](${path.basename(functionsPath)})`;

        return content;
    }

    private createTable(headers: string[], rows: string[][]): string {
        if (rows.length === 0) {
            return 'No hay elementos en esta categoría.\n';
        }

        // Calcular anchos de columnas
        const colWidths = headers.map((h, i) =>
            Math.max(h.length, ...rows.map(row => row[i]?.length || 0))
        );

        // Crear tabla
        let table = `| ${headers.map((h, i) => h.padEnd(colWidths[i])).join(' | ')} |\n`;
        table += `|${headers.map((_, i) => '-'.repeat(colWidths[i] + 2)).join('|')}|\n`;

        for (const row of rows) {
            table += `| ${row.map((cell, i) => cell.padEnd(colWidths[i])).join(' | ')} |\n`;
        }

        return table;
    }





    private readonly versionString: string = '4.1';

    public async initialize (): Promise<void> {

        const packagePath = './package.json';

        const packageJson = await fsExtra.readJson (packagePath);

        await this.updateApplicationVersion (packagePath, packageJson);

        await this.updateDevelopmentLifecycle (packageJson, 'src/documentation/environment/development_lifecycle.md');

    }

    private async updateApplicationVersion (packagePath: any, packageJson: any) {

        const date = new Date ();

        const dateString = [date.getFullYear (), String (date.getMonth () + 1).padStart (2, '0'), String (date.getDate ()).padStart (2, '0')].join ('.');

        const versionString = this.versionString + '/' + dateString;

        packageJson.version = versionString;

        await fsExtra.writeJson (packagePath, packageJson, {spaces: 2});

        console.log ('Application Version: ' + versionString);

    }

    private async updateDevelopmentLifecycle (packageJson: any, outputPath: string): Promise<void> {

        let markdownContent = '# Development Lifecycle\n\n';

        markdownContent += '### Scripts Configuration\n\n'
        markdownContent += this.createFormattedTable (Object.entries (packageJson.scripts), ['***Script***', '***Description***']);
        markdownContent += '\n<br/>\n\n';

        markdownContent += '### Runtime Dependencies List\n\n'
        markdownContent += this.createFormattedTable (Object.entries (packageJson.dependencies), ['***Dependency***', '***Version***']);
        markdownContent += '\n<br/>\n\n';

        markdownContent += '### Development Dependencies List\n\n'
        markdownContent += this.createFormattedTable (Object.entries (packageJson.devDependencies), ['***Dependency***', '***Version***']);
        markdownContent += '\n';

        await fsExtra.writeFile (outputPath, markdownContent);
    }

    private createFormattedTable (entries: [string, string][], headers: [string, string]): string {

        let width1Number = Math.max (headers[0].length, 0);
        let width2Number = Math.max (headers[1].length, 0);

        entries.forEach (([key, value]) => {
            width1Number = Math.max (width1Number, key.length);
            width2Number = Math.max (width2Number, value.length);
        });

        // Crear tabla
        let table = `| ${headers[0].padEnd (width1Number)} | ${headers[1].padEnd (width2Number)} |\n`;
        table += `|${'-'.repeat (width1Number + 2)}|${'-'.repeat (width2Number + 2)}|\n`;

        entries.forEach (([key, value]) => {
            table += `| ${key.padEnd (width1Number)} | ${value.padEnd (width2Number)} |\n`;
        });

        return table;

    }

}

const prepareEntry = container.resolve (PrepareEntry);
prepareEntry.generateDocumentation ().then ();