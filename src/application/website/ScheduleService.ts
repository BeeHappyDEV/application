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

    public async cronScheduleAction (traceRecord: Record<string, any>, paramsRecord: Record<string, any>): Promise<Record<string, any>> {

        const logTool = this.logToolFactory ();
        logTool.setTrace (traceRecord);
        logTool.INITIALIZE ();

        const headersRecord: Record<string, any> = {};

        let queryRecord: Record<string, any> = {};

        const bodyRecord: Record<string, any> = {};
        bodyRecord.transaction = logTool.getTrace ().transaction;
        bodyRecord.depth = logTool.getTrace ().depth + 2;

        let resultRecord: Record<string, any> = {};

        try {

            resultRecord = await this.webserviceModule.post (logTool.getTrace (), await paramsRecord.txt_host, headersRecord, queryRecord, bodyRecord);

        } catch (exception) {

            logTool.ERR (LogConstants.WEBSERVICE);

        }

        if (resultRecord.status.num_exception === 0) {

            resultRecord.status.boo_exception = false;
            resultRecord.status.num_exception = LogConstants.SUCCESS.num_exception;
            resultRecord.status.txt_exception = LogConstants.SUCCESS.txt_exception;

            logTool.OK ();

        } else {

            logTool.NOK (resultRecord.txt_exception);

        }

        logTool.FINALIZE ();

        return resultRecord;

    }

}