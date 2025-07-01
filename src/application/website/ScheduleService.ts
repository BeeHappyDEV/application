import {inject, injectable} from 'tsyringe';

import {WebserviceModule} from '../middleware/WebserviceModule';

import {CommonsTool} from '../toolkit/CommonsTool';
import {ExceptionTool} from '../toolkit/ExceptionTool';
import {LogTool} from '../toolkit/LogTool';

import {JsonObject} from '../object/JsonObject';
import {ResultObject} from '../object/ResultObject';

@injectable ()
export class ScheduleService {

    constructor (
        @inject (WebserviceModule) private webserviceModule: WebserviceModule,
        @inject (LogTool) private logTool: LogTool
    ) {
    }

    public async cronScheduleAction (paramsObject: JsonObject, traceObject: JsonObject): Promise<ResultObject> {

        const stackStringArray = CommonsTool.getStackStringArray ();

        this.logTool.initialize (stackStringArray, traceObject);

        let headersObject = new JsonObject ();

        const queryObject = new JsonObject ();
        queryObject.set ('depth', '3');
        queryObject.set ('thread', this.logTool.trace ().get ('thread'));

        const bodyObject = new JsonObject ();

        let resultObject = new ResultObject ();

        try {

            resultObject = await this.webserviceModule.post (await paramsObject.get ('txt_host'), headersObject, queryObject, bodyObject, this.logTool.trace ());

        } catch (exception) {

            resultObject.setResult (ExceptionTool.APPLICATION_EXCEPTION (stackStringArray));

            this.logTool.exception ();

        }

        this.logTool.response (resultObject);
        this.logTool.finalize ();

        return resultObject;

    }

}