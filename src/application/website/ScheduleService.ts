import {inject, injectable} from 'tsyringe';

import {WebserviceModule} from '../middleware/WebserviceModule';

import {LogTool} from '../toolkit/LogTool';

import {LogConstants} from '../constants/LogConstants';

@injectable ()
export class ScheduleService {

    constructor (
        @inject ('LogToolFactory') private logToolFactory: () => LogTool,
        @inject (WebserviceModule) private webserviceModule: WebserviceModule
    ) {
    }

    public async cronScheduleAction (traceObject:  Record<string, any>, paramsObject:  Record<string, any>): Promise<Record<string, any>> {

        const logTool = this.logToolFactory ();
        logTool.setTrace (traceObject);
        logTool.INITIALIZE ();

        const headersObject: Record<string, any> = {};

        let queryObject: Record<string, any> = {};

        const bodyObject: Record<string, any> = {};
        bodyObject.transaction = logTool.getTrace ().transaction;
        bodyObject.depth = logTool.getTrace ().depth + 2;

        let resultObject: Record<string, any> = {};

        try {

            resultObject = await this.webserviceModule.post (logTool.getTrace (), await paramsObject.txt_host, headersObject, queryObject, bodyObject);

        } catch (exception) {

            logTool.ERR (LogConstants.WEBSERVICE);

        }

        if (resultObject.status.num_exception === 0) {

            resultObject.status.boo_exception = false;
            resultObject.status.num_exception = LogConstants.SUCCESS.num_exception;
            resultObject.status.txt_exception = LogConstants.SUCCESS.txt_exception;

            logTool.OK ();

        } else {

            logTool.NOK (resultObject.txt_exception);

        }

        logTool.FINALIZE ();

        return resultObject;

    }

}