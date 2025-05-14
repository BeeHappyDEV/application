import {container, inject, injectable} from 'tsyringe';

import {EnvironmentHelper} from './EnvironmentHelper';
import {FunctionHelper} from './FunctionHelper';
import {SchemaHelper} from './SchemaHelper';
import {TableHelper} from './TableHelper';
import {CommonsTool} from '../toolkit/CommonsTool';
import {LogTool} from '../toolkit/LogTool';
import {JsonObject} from '../object/JsonObject';
import {ResultObject} from '../object/ResultObject';

@injectable ()
export class DocumentService {

    constructor (
        @inject (EnvironmentHelper) private environmentHelper: EnvironmentHelper,
        @inject (FunctionHelper) private functionHelper: FunctionHelper,
        @inject (SchemaHelper) private schemaHelper: SchemaHelper,
        @inject (TableHelper) private tableHelper: TableHelper
    ) {
    }

    public async getGenerateAction (paramsObject: JsonObject, traceObject: JsonObject): Promise<ResultObject> {

        const stackStrings = await CommonsTool.getStackStrings ();

        const logTool = container.resolve (LogTool);
        logTool.initialize (stackStrings, traceObject);

        let resultObject = container.resolve (ResultObject);

        await this.environmentHelper.generateDocumentation (paramsObject);
        await this.functionHelper.generateDocumentation (paramsObject);
        await this.tableHelper.generateDocumentation (paramsObject);
        await this.schemaHelper.generateDocumentation (paramsObject);

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

}