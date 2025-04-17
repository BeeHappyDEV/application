import {inject, singleton} from 'tsyringe';

import {JsonObject} from '@object/JsonObject';
import {ReflectionTool} from '@toolkit/ReflectionTool';
import {ResultObject} from '@object/ResultObject';
import {WebserviceModule} from '@middleware/WebserviceModule';
import {LogTool} from '@toolkit/LogTool';
import {ExceptionTool} from '@toolkit/ExceptionTool';

@singleton ()
export class Auth0Module {

    constructor (
        @inject (ReflectionTool) private readonly reflectionTool: ReflectionTool,
        @inject (WebserviceModule) private readonly webserviceModule: WebserviceModule
    ) {
    }

    // @ts-ignore
    public async test (paramsObject: JsonObject, traceObject: JsonObject): Promise<ResultObject> {

        const reflectionStrings = await this.reflectionTool.getStackStrings ();

        const logTool = new LogTool ();
        logTool.initialize (traceObject, reflectionStrings);

        const queryObject = new JsonObject ();
        queryObject.set ('depth', '3');
        queryObject.set ('thread', logTool.trace ().get ('thread'));

        let resultObject = new ResultObject ();

        try {

            resultObject = await this.webserviceModule.post (paramsObject.get ('txt_webservice'), null, queryObject, null, logTool.trace ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

}