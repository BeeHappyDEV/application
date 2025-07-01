import {inject, injectable} from 'tsyringe';

import {PostgresModule} from '../middleware/PostgresModule';

import {CommonsTool} from '../toolkit/CommonsTool';
import {ExceptionTool} from '../toolkit/ExceptionTool';
import {LogTool} from '../toolkit/LogTool';

import {JsonObject} from '../object/JsonObject';
import {ResultObject} from '../object/ResultObject';

@injectable ()
export class FrontendService {

    constructor (
        @inject (PostgresModule) private postgresModule: PostgresModule,
        @inject (LogTool) private logTool: LogTool
    ) {
    }

    public async getPageAction (paramsObject: JsonObject, traceObject: JsonObject): Promise<ResultObject> {

        const stackStringArray = CommonsTool.getStackStringArray ();

        this.logTool.initialize (stackStringArray, traceObject);

        let resultObject = new ResultObject ();

        try {

            paramsObject.set ('txt_schema', 'frontend');
            paramsObject.set ('txt_function', 'page_action');

            resultObject = await this.postgresModule.execute (paramsObject, this.logTool.trace ());

        } catch (exception) {

            resultObject.setResult (ExceptionTool.APPLICATION_EXCEPTION (stackStringArray));

            this.logTool.exception ();

        }

        this.logTool.response (resultObject);
        this.logTool.finalize ();

        return resultObject;

    }

    public async getLinkAction (paramsObject: JsonObject, traceObject: JsonObject): Promise<ResultObject> {

        const stackStringArray = CommonsTool.getStackStringArray ();

        this.logTool.initialize (stackStringArray, traceObject);

        let resultObject = new ResultObject ();

        try {

            paramsObject.set ('txt_schema', 'frontend');
            paramsObject.set ('txt_function', 'link_action');

            resultObject = await this.postgresModule.execute (paramsObject, this.logTool.trace ());

        } catch (exception) {

            resultObject.setResult (ExceptionTool.APPLICATION_EXCEPTION (stackStringArray));

            this.logTool.exception ();

        }

        this.logTool.response (resultObject);
        this.logTool.finalize ();

        return resultObject;

    }

    public async getFileAction (paramsObject: JsonObject, traceObject: JsonObject): Promise<ResultObject> {

        const stackStringArray = CommonsTool.getStackStringArray ();

        this.logTool.initialize (stackStringArray, traceObject);

        let resultObject = new ResultObject ();

        try {

            paramsObject.set ('txt_schema', 'frontend');
            paramsObject.set ('txt_function', 'file_action');

            resultObject = await this.postgresModule.execute (paramsObject, this.logTool.trace ());

        } catch (exception) {

            resultObject.setResult (ExceptionTool.APPLICATION_EXCEPTION (stackStringArray));

            this.logTool.exception ();

        }

        this.logTool.response (resultObject);
        this.logTool.finalize ();

        return resultObject;

    }

}