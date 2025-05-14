import fs from 'fs';
import path from 'path';
import ts from 'typescript';

interface ClassInfo {
    name: string;
    filePath: string;
    methods: MethodInfo[];
}

interface MethodInfo {
    name: string;
    isAsync: boolean;
    returnType: string;
    parameters: ParameterInfo[];
}

interface ParameterInfo {
    name: string;
    type: string;
}

export class PrepareEntry2 {
    private readonly tsConfigPath: string;
    private readonly docsPath: string = './docs/ts-classes';

    constructor(tsConfigPath: string = 'tsconfig.json') {
        this.tsConfigPath = tsConfigPath;
    }

    public async generateDocumentation(): Promise<void> {
        try {
            if (!fs.existsSync(this.docsPath)) {
                fs.mkdirSync(this.docsPath, { recursive: true });
            }

            const classInfos = this.processProject();
            await this.generateClassDocumentation(classInfos);

            console.log(`Documentación de TypeScript generada en: ${this.docsPath}`);
        } catch (error) {
            console.error('Error generando documentación:', error);
        }
    }

    private processProject(): ClassInfo[] {
        const configFile = ts.readConfigFile(this.tsConfigPath, ts.sys.readFile);
        const compilerOptions = ts.parseJsonConfigFileContent(
            configFile.config,
            ts.sys,
            path.dirname(this.tsConfigPath)
        );

        const program = ts.createProgram(compilerOptions.fileNames, compilerOptions.options);
        const checker = program.getTypeChecker();
        const classInfos: ClassInfo[] = [];

        for (const sourceFile of program.getSourceFiles()) {
            if (!sourceFile.isDeclarationFile) {
                ts.forEachChild(sourceFile, node => {
                    if (ts.isClassDeclaration(node) && node.name) {
                        const classInfo = this.processClass(node, checker, sourceFile);
                        classInfos.push(classInfo);
                    }
                });
            }
        }

        return classInfos.sort((a, b) => a.name.localeCompare(b.name));
    }

    private processClass(classNode: ts.ClassDeclaration, checker: ts.TypeChecker, sourceFile: ts.SourceFile): ClassInfo {
        const classInfo: ClassInfo = {
            name: classNode.name!.text,
            filePath: path.relative(process.cwd(), sourceFile.fileName),
            methods: []
        };

        classNode.members.forEach(member => {
            if (ts.isMethodDeclaration(member) || ts.isPropertyDeclaration(member)) {
                const methodName = member.name && ts.isIdentifier(member.name) ? member.name.text : 'unnamed';
                const signature = checker.getSignatureFromDeclaration(member as ts.SignatureDeclaration);
                const returnType = signature ? checker.typeToString(signature.getReturnType()) : 'void';

                const methodInfo: MethodInfo = {
                    name: methodName,
                    isAsync: !!member.modifiers?.some(m => m.kind === ts.SyntaxKind.AsyncKeyword),
                    returnType,
                    parameters: []
                };

                if (ts.isMethodDeclaration(member) && member.parameters) {
                    methodInfo.parameters = member.parameters.map(param => {
                        const paramName = ts.isIdentifier(param.name) ? param.name.text : 'unnamed';
                        const paramType = param.type ? checker.typeToString(checker.getTypeFromTypeNode(param.type)) : 'any';
                        return { name: paramName, type: paramType };
                    });
                }

                classInfo.methods.push(methodInfo);
            }
        });

        return classInfo;
    }

    private async generateClassDocumentation(classInfos: ClassInfo[]): Promise<void> {
        // Generar archivo principal con lista de clases
        let markdown = '# Listado de Clases TypeScript\n\n';

        const classList = classInfos.map(cls => [
            `[${cls.name}](${this.getDocsFilePath(cls.name)})`,
            cls.filePath,
            cls.methods.length.toString()
        ]);

        markdown += this.buildMarkdownTable(
            ['Clase', 'Archivo', 'Métodos'],
            classList
        );

        fs.writeFileSync(path.join(this.docsPath, 'classes-list.md'), markdown);

        // Generar archivo individual por clase
        for (const classInfo of classInfos) {
            await this.generateClassFile(classInfo);
        }
    }

    private async generateClassFile(classInfo: ClassInfo): Promise<void> {
        let markdown = `# Clase ${classInfo.name}\n\n`;
        markdown += `**Archivo:** ${classInfo.filePath}\n\n`;

        if (classInfo.methods.length > 0) {
            markdown += '## Métodos\n\n';

            const methodRows = classInfo.methods.map(method => {
                const params = method.parameters.map(p => `${p.name}: ${p.type}`).join(', ');
                const signature = `${method.name}(${params}): ${method.returnType}`;
                return [method.isAsync ? `async ${signature}` : signature];
            });

            markdown += this.buildMarkdownTable(
                ['Firma del método'],
                methodRows
            );
        }

        fs.writeFileSync(this.getDocsFilePath(classInfo.name), markdown);
    }

    private getDocsFilePath(className: string): string {
        return path.join(this.docsPath, `${className.toLowerCase()}.md`);
    }

    private buildMarkdownTable(headers: string[], rows: string[][]): string {
        const columnWidths = headers.map((header, i) => {
            const maxRowLength = Math.max(...rows.map(row => row[i]?.length || 0));
            return Math.max(header.length, maxRowLength);
        });

        let table = '|';
        headers.forEach((header, i) => {
            table += ` ${header.padEnd(columnWidths[i])} |`;
        });
        table += '\n|';
        headers.forEach((_, i) => {
            table += ` ${'-'.repeat(columnWidths[i])} |`;
        });
        table += '\n';

        rows.forEach(row => {
            table += '|';
            row.forEach((cell, i) => {
                table += ` ${(cell || '').padEnd(columnWidths[i])} |`;
            });
            table += '\n';
        });

        return table + '\n';
    }
}

// Uso:
const analyzer = new PrepareEntry2();
analyzer.generateDocumentation ().then ();