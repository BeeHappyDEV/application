import {inject, injectable} from 'tsyringe';

import path from 'path';

import {ConfigHelper} from '../common/helper/ConfigHelper';
import {FileHelper} from '../common/helper/FileHelper';
import {ClassHelper} from './helper/ClassHelper';
import {FileModel} from '../common/model/FileModel';
import {ClassModel} from './model/ClassModel';
import {TableBuilder} from "../database/builder/TableBuilder";

@injectable ()
export class ApplicationService {

    //@ts-ignore
    private classStructures: ClassModel[] = [];

    constructor (
        @inject (ClassHelper) private classHelper: ClassHelper,
        @inject (ConfigHelper) private configHelper: ConfigHelper,
        @inject (FileHelper) private fileProcessor: FileHelper
    ) {
    }

    public async process (): Promise<void> {

        if (!this.configHelper.databasePath) {

            return;

        }

        const fileStructures = await this.fileProcessor.getFiles (this.configHelper.applicationPath, this.configHelper.applicationExclusions);

        await this.processClasses (fileStructures);

    }

    private async processClasses (fileStructures: FileModel[]): Promise<void> {

        for (const fileStructure of fileStructures) {

            const classModel = await this.classHelper.process (fileStructure);

            if (classModel) {

                classModel.path = fileStructure.pathString;

                this.classHelper.push (classModel);

                const outputString = TableBuilder.process (
                    tableModel
                );

                const pathString = path.join (
                    this.configHelper.tablesOutput,
                    tableModel.schema,
                    tableModel.name + '.md'
                );

                await this.fileProcessor.writeFile (pathString, outputString);

            }

        }

    }

}