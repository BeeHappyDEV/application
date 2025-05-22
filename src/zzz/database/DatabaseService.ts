import {inject, injectable} from 'tsyringe';

import path from 'path';

import {ConfigHelper} from '../common/helper/ConfigHelper';
import {FileHelper} from '../common/helper/FileHelper';
import {FunctionHelper} from './helper/FunctionHelper';
import {TableHelper} from './helper/TableHelper';
import {FunctionBuilder} from './builder/FunctionBuilder';
import {TableBuilder} from './builder/TableBuilder';
import {FileModel} from '../common/model/FileModel';
import {FunctionModel} from './model/FunctionModel';
import {TableModel} from './model/TableModel';

@injectable ()
export class DatabaseService {

    private functionModels: FunctionModel[] = [];
    private tableModels: TableModel[] = [];

    constructor (
        @inject (ConfigHelper) private configHelper: ConfigHelper,
        @inject (FileHelper) private fileProcessor: FileHelper,
        @inject (FunctionHelper) private functionHelper: FunctionHelper,
        @inject (TableHelper) private tableHelper: TableHelper
    ) {
    }

    public async process (): Promise<void> {

        if (!this.configHelper.databasePath) {

            return;

        }

        const fileModels = await this.fileProcessor.getFiles (this.configHelper.databasePath, this.configHelper.databaseExclusions);

        await this.processFunctions (fileModels);
        await this.processTables (fileModels);

    }

    private async processFunctions (fileModels: FileModel[]): Promise<void> {

        for (const fileModel of fileModels) {

            const functionModel = await this.functionHelper.process (fileModel);

            if (functionModel) {

                functionModel.pathString = fileModel.pathString;

                this.functionModels.push (functionModel);

                const outputString = FunctionBuilder.process (
                    functionModel
                );

                const pathString = path.join (
                    this.configHelper.functionsOutput,
                    functionModel.schemaString,
                    functionModel.functionString + '.md'
                );

                await this.fileProcessor.writeFile (pathString, outputString);

            }

        }

    }

    private async processTables (fileStructures: FileModel[]): Promise<void> {

        for (const fileStructure of fileStructures) {

            const tableModel = await this.tableHelper.process (fileStructure);

            if (tableModel) {

                tableModel.pathString = fileStructure.pathString;

                this.tableModels.push (tableModel);

                const outputString = TableBuilder.process (
                    tableModel
                );

                const pathString = path.join (
                    this.configHelper.tablesOutput,
                    tableModel.schemaString,
                    tableModel.tableString + '.md'
                );

                await this.fileProcessor.writeFile (pathString, outputString);

            }

        }

    }

}