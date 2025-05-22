import 'reflect-metadata';

import { Project, ClassDeclaration } from 'ts-morph';
import fsExtra from 'fs-extra';
import path from 'path';
import { container, injectable } from 'tsyringe';
import { JsonObject } from "../src/application/object/JsonObject";

@injectable()
export class TypeScriptClassParser {
    private project: Project;

    constructor() {
        this.project = new Project({
            tsConfigFilePath: "tsconfig.json", // Asegúrate de que apunte a tu tsconfig.json
        });
    }

    public async analyzeProject(paramsObject: JsonObject): Promise<void> {
        const outputPath = paramsObject.get('txt_output') || 'ts-classes.md';
        const classesData = await this.extractClassesData(paramsObject.get('txt_directory'));
        await this.generateMarkdownOutput(outputPath, classesData);
    }

    private async extractClassesData(directory: string): Promise<any[]> {
        const classesData: any[] = [];
        const files = this.getTypeScriptFiles(directory);

        for (const file of files) {
            const sourceFile = this.project.addSourceFileAtPath(file);
            const classes = sourceFile.getClasses();

            for (const cls of classes) {
                const classInfo = {
                    name: cls.getName(),
                    directory: path.dirname(file),
                    methods: this.extractMethods(cls),
                    injections: this.extractInjections(cls),
                };
                classesData.push(classInfo);
            }
        }

        return classesData;
    }

    private getTypeScriptFiles(directory: string): string[] {
        return fsExtra.readdirSync(directory)
            .flatMap(file => {
                const fullPath = path.join(directory, file);
                if (fsExtra.statSync(fullPath).isDirectory()) {
                    return this.getTypeScriptFiles(fullPath);
                } else if (file.endsWith('.ts') && !file.endsWith('.d.ts')) {
                    return [fullPath];
                }
                return [];
            });
    }

    private extractMethods(cls: ClassDeclaration): Array<{
        name: string;
        isPublic: boolean;
        params: string;
    }> {
        return cls.getMethods().map(method => {
            const params = method.getParameters().map(p => p.getName()).join(', ');
            const modifiers = method.getModifiers().map(m => m.getText());
            const isPublic = !modifiers.includes('private');
            return {
                name: method.getName(),
                isPublic,
                params,
            };
        });
    }

    private extractInjections(cls: ClassDeclaration): string[] {
        const injections: string[] = [];

        // 1. Analizar el constructor
        const constructor = cls.getConstructors()[0];
        if (constructor) {
            for (const param of constructor.getParameters()) {
                const paramType = param.getType();
                const typeText = paramType.getText();

                // Obtener el nombre de la clase (última parte del tipo, ej: "LoggerService" de "import.LoggerService")
                const className = typeText.split('.').pop() || typeText;

                // Filtrar solo tipos no primitivos (opcional)
                const isPrimitive = ['string', 'number', 'boolean', 'any'].includes(typeText.toLowerCase());
                if (!isPrimitive) {
                    injections.push(className);
                }
            }
        }

        return injections;
    }

    private async generateMarkdownOutput(outputPath: string, classesData: any[]): Promise<void> {
        // 1. Define el orden prioritario de las carpetas (personaliza según tus necesidades)
        const folderPriority = [
            "website",
            "middleware",
            "toolkit",
            "services",
            "controllers",
            "utils"
        ];

        // 2. Agrupa las clases por carpeta
        const groupedClasses: Record<string, any[]> = {};

        classesData.forEach(classData => {
            const folderName = classData.directory.split('/').pop(); // Extrae el nombre de la carpeta padre
            if (!groupedClasses[folderName]) {
                groupedClasses[folderName] = [];
            }
            groupedClasses[folderName].push(classData);
        });

        // 3. Ordena los grupos según `folderPriority` y luego alfabéticamente
        let markdown = '# TypeScript Classes Documentation\n\n';

        // 3.1. Procesa primero las carpetas prioritarias (en el orden definido)
        folderPriority.forEach(folder => {
            if (groupedClasses[folder]) {
                markdown += `## 📂 ${folder.toUpperCase()}\n\n`;
                groupedClasses[folder]
                    .sort((a, b) => a.name.localeCompare(b.name)) // Orden alfabético
                    .forEach(classData => {
                        markdown += this.formatClassData(classData);
                    });
                delete groupedClasses[folder]; // Elimina para no reprocesar
            }
        });

        // 3.2. Procesa el resto de carpetas (no prioritarias) en orden alfabético
        Object.keys(groupedClasses)
            .sort()
            .forEach(folder => {
                markdown += `## 📂 ${folder.toUpperCase()}\n\n`;
                groupedClasses[folder]
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .forEach(classData => {
                        markdown += this.formatClassData(classData);
                    });
            });

        // 4. Guarda el archivo
        await fsExtra.ensureDir(path.dirname(outputPath));
        fsExtra.writeFileSync(outputPath, markdown);
    }

    private formatClassData(classData: any): string {
        return `### ${classData.name}\n` +
            `- **Directory**: \`${classData.directory}\`\n` +
            `- **Methods**:\n${classData.methods.map((m: { isPublic: any; name: any; params: any; }) =>
                `  - ${m.isPublic ? '🔓' : '🔒'} \`${m.name}(${m.params})\` ${m.isPublic ? '' : '(private)'}`
            ).join('\n')}\n` +
            `- **Dependencies**: ${classData.injections.join(', ') || 'None'}\n\n`;
    }

}

const aaa =new JsonObject();
aaa.set('txt_directory', 'src')
aaa.set('txt_output', 'docs/classes.md');

const parser = container.resolve(TypeScriptClassParser);
parser.analyzeProject(aaa).then();