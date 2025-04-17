import {inject, injectable} from 'tsyringe';

import {PostgresModule} from '@middleware/PostgresModule';
import {ExceptionTool} from '@toolkit/ExceptionTool';
import {LogTool} from '@toolkit/LogTool';
import {ResultObject} from '@object/ResultObject';
import {ReflectionTool} from '@toolkit/ReflectionTool';
import {PropertiesTool} from '@toolkit/PropertiesTool';
import {JsonObject} from '@object/JsonObject';

@injectable ()
export class FrontendService {

    constructor (
        @inject (PostgresModule) public readonly postgresTool: PostgresModule,
        @inject (PropertiesTool) public readonly propertiesTool: PropertiesTool,
        @inject (ReflectionTool) private readonly reflectionTool: ReflectionTool
    ) {
    }

    public async getPageAction (paramsObject: JsonObject, traceObject: JsonObject): Promise<ResultObject> {

        const reflectionStrings = await this.reflectionTool.getStackStrings ();

        const logTool = new LogTool ();
        logTool.initialize (traceObject, reflectionStrings);

        let resultObject = new ResultObject ();

        try {

            paramsObject.set ('txt_function', 'frontend_page_action');

            resultObject = await this.postgresTool.execute (paramsObject, logTool.trace ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    public async getLinkAction (paramsObject: JsonObject, traceObject: JsonObject): Promise<ResultObject> {

        const reflectionStrings = await this.reflectionTool.getStackStrings ();

        const logTool = new LogTool ();
        logTool.initialize (traceObject, reflectionStrings);

        let resultObject = new ResultObject ();

        try {

            paramsObject.set ('txt_function', 'frontend_link_action');

            resultObject = await this.postgresTool.execute (paramsObject, logTool.trace ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    public async getFileAction (paramsObject: JsonObject, traceObject: JsonObject): Promise<ResultObject> {

        const reflectionStrings = await this.reflectionTool.getStackStrings ();

        const logTool = new LogTool ();
        logTool.initialize (traceObject, reflectionStrings);

        let resultObject = new ResultObject ();

        try {

            paramsObject.set ('txt_function', 'frontend_file_action');

            resultObject = await this.postgresTool.execute (paramsObject, logTool.trace ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

}