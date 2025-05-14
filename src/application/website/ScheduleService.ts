import {container, inject, injectable} from 'tsyringe';

import {WebserviceModule} from '../middleware/WebserviceModule';
import {CommonsTool} from '../toolkit/CommonsTool';
import {ExceptionTool} from '../toolkit/ExceptionTool';
import {LogTool} from '../toolkit/LogTool';
import {JsonObject} from '../object/JsonObject';
import {ResultObject} from '../object/ResultObject';

@injectable ()
export class ScheduleService {

    constructor (
        @inject (WebserviceModule) private webserviceModule: WebserviceModule
    ) {
    }

    public async cronScheduleAction (paramsObject: JsonObject, traceObject: JsonObject): Promise<ResultObject> {

        const stackStrings = await CommonsTool.getStackStrings ();

        const logTool = container.resolve (LogTool);
        logTool.initialize (stackStrings, traceObject);

        let headersObject = container.resolve (JsonObject);

        const queryObject = container.resolve (JsonObject);
        queryObject.set ('depth', '3');
        queryObject.set ('thread', logTool.trace ().get ('thread'));

        const bodyObject = container.resolve (JsonObject);

        let resultObject = container.resolve (ResultObject);

        try {

            resultObject = await this.webserviceModule.post (await paramsObject.get ('txt_host'), headersObject, queryObject, bodyObject, logTool.trace ());

        } catch (exception) {

            resultObject.setResult (ExceptionTool.APPLICATION_EXCEPTION (stackStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

}