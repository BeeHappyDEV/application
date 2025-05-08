import {container, inject, injectable} from 'tsyringe';

import {PostgresModule} from '../middleware/PostgresModule';
import {CommonsTool} from '../toolkit/CommonsTool';
import {ExceptionTool} from '../toolkit/ExceptionTool';
import {LogTool} from '../toolkit/LogTool';
import {JsonObject} from '../object/JsonObject';
import {ResultObject} from '../object/ResultObject';

@injectable ()
export class WhatsAppService {

    constructor (
        @inject (PostgresModule) private postgresModule: PostgresModule
    ) {
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

}