import {container, inject, injectable} from 'tsyringe';

import {PostgresModule} from '../middleware/PostgresModule';
import {ExceptionTool} from '../toolkit/ExceptionTool';
import {LogTool} from '../toolkit/LogTool';
import {CommonsTool} from '../toolkit/CommonsTool';
import {PropertiesTool} from '../toolkit/PropertiesTool';
import {JsonObject} from '../object/JsonObject';
import {ResultObject} from '../object/ResultObject';

@injectable ()
export class FrontendService {

    constructor (
        @inject (PostgresModule) private postgresModule: PostgresModule,
        @inject (PropertiesTool) private propertiesTool: PropertiesTool
    ) {
        this.propertiesTool.initialize ().then ();
    }

    public async getPageAction (paramsObject: JsonObject, traceObject: JsonObject): Promise<ResultObject> {

        const stackStrings = await CommonsTool.getStackStrings ();

        const logTool = container.resolve (LogTool);
        logTool.initialize (stackStrings, traceObject);

        let resultObject = new ResultObject ();

        try {

            paramsObject.set ('txt_function', 'frontend_page_action');

            resultObject = await this.postgresModule.execute (paramsObject, logTool.trace ());

        } catch (exception) {

            resultObject.setResult (ExceptionTool.APPLICATION_EXCEPTION (stackStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    public async getLinkAction (paramsObject: JsonObject, traceObject: JsonObject): Promise<ResultObject> {

        const stackStrings = await CommonsTool.getStackStrings ();

        const logTool = container.resolve (LogTool);
        logTool.initialize (stackStrings, traceObject);

        let resultObject = new ResultObject ();

        try {

            paramsObject.set ('txt_function', 'frontend_link_action');

            resultObject = await this.postgresModule.execute (paramsObject, logTool.trace ());

        } catch (exception) {

            resultObject.setResult (ExceptionTool.APPLICATION_EXCEPTION (stackStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    public async getFileAction (paramsObject: JsonObject, traceObject: JsonObject): Promise<ResultObject> {

        const stackStrings = await CommonsTool.getStackStrings ();

        const logTool = container.resolve (LogTool);
        logTool.initialize (stackStrings, traceObject);

        let resultObject = new ResultObject ();

        try {

            paramsObject.set ('txt_function', 'frontend_file_action');

            resultObject = await this.postgresModule.execute (paramsObject, logTool.trace ());

        } catch (exception) {

            resultObject.setResult (ExceptionTool.APPLICATION_EXCEPTION (stackStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

}