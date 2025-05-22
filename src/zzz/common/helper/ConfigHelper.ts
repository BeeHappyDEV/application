import {injectable} from 'tsyringe';

import fs from 'fs';
import path from 'path';

interface DocumentationConfig {
    application: {
        path: string;
        exclusions: string[];
        domainsToTrack: string[];
    };
    database: {
        path: string;
        exclusions: string[];
    };
    output: {
        path: string;
        application: {
            classes: string;
        };
        database: {
            tables: string;
            functions: string;
        };
    };
}

injectable ()
export class ConfigHelper {
    private config: DocumentationConfig;

    constructor () {

        const configPath = 'src/zzz/config.json';

        this.config = JSON.parse (fs.readFileSync (configPath, 'utf-8'));

    }

    public get applicationPath (): string {

        return this.config.application.path;

    }

    public get applicationExclusions (): string[] {

        return this.config.application.exclusions || [];

    }

    public get databasePath (): string {

        return this.config.database.path;

    }

    public get databaseExclusions (): string[] {

        return this.config.database.exclusions || [];

    }

    public get classesOutput (): string {

        return path.join (this.outputPath, this.config.output.application.classes);

    }

    public get functionsOutput (): string {

        return path.join (this.outputPath, this.config.output.database.functions);

    }

    public get tablesOutput (): string {

        return path.join (this.outputPath, this.config.output.database.tables);

    }

    public get outputPath (): string {

        return this.config.output.path;

    }

}