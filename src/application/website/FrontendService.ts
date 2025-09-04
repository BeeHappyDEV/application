import {inject, injectable} from 'tsyringe';

import {PostgresModule} from '../middleware/PostgresModule';

import {LogTool} from '../toolkit/LogTool';

import {LogConstants} from '../constants/LogConstants';

@injectable ()
export class FrontendService {

    constructor (
        @inject ('LogToolFactory') private logToolFactory: () => LogTool,
        @inject (PostgresModule) private postgresModule: PostgresModule
    ) {
    }

    public async getPageAction (traceRecord: Record<string, any>, paramsRecord: Record<string, any>): Promise<Record<string, any>> {

        const logTool = this.logToolFactory ();
        logTool.setTrace (traceRecord);
        logTool.INITIALIZE ();

        let resultRecord: Record<string, any> = {};

        try {

            paramsRecord.txt_schema = 'frontend';
            paramsRecord.txt_function = 'page_action';

            resultRecord = await this.postgresModule.execute (logTool.getTrace (), paramsRecord);

        } catch (exception) {

            if (!resultRecord.status) {

                resultRecord.status = {};

            }

            resultRecord.status.boo_exception = true;
            resultRecord.status.num_exception = LogConstants.SERVICE.num_exception;
            resultRecord.status.txt_exception = LogConstants.SERVICE.txt_exception;

            logTool.ERR (LogConstants.SERVICE);
            logTool.FINALIZE ();

            return resultRecord;

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

    public async getLinkAction (traceRecord: Record<string, any>, paramsRecord: Record<string, any>): Promise<Record<string, any>> {

        const logTool = this.logToolFactory ();
        logTool.setTrace (traceRecord);
        logTool.INITIALIZE ();

        let resultRecord: Record<string, any> = {};

        try {

            paramsRecord.txt_schema = 'frontend';
            paramsRecord.txt_function = 'link_action';

            resultRecord = await this.postgresModule.execute (logTool.getTrace (), paramsRecord);

        } catch (exception) {

            if (!resultRecord.status) {

                resultRecord.status = {};

            }

            resultRecord.status.boo_exception = true;
            resultRecord.status.num_exception = LogConstants.SERVICE.num_exception;
            resultRecord.status.txt_exception = LogConstants.SERVICE.txt_exception;

            logTool.ERR (LogConstants.SERVICE);
            logTool.FINALIZE ();

            return resultRecord;

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

    public async getFileAction (traceRecord: Record<string, any>, paramsRecord: Record<string, any>): Promise<Record<string, any>> {

        const logTool = this.logToolFactory ();
        logTool.setTrace (traceRecord);
        logTool.INITIALIZE ();

        let resultRecord: Record<string, any> = {};

        try {

            paramsRecord.txt_schema = 'frontend';
            paramsRecord.txt_function = 'file_action';

            resultRecord = await this.postgresModule.execute (logTool.getTrace (), paramsRecord);

        } catch (exception) {

            if (!resultRecord.status) {

                resultRecord.status = {};

            }

            resultRecord.status.boo_exception = true;
            resultRecord.status.num_exception = LogConstants.SERVICE.num_exception;
            resultRecord.status.txt_exception = LogConstants.SERVICE.txt_exception;

            logTool.ERR (LogConstants.SERVICE);
            logTool.FINALIZE ();

            return resultRecord;

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