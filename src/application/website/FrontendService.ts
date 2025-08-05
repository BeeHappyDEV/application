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

    public async getPageAction (traceObject: Record<string, any>, paramsObject: Record<string, any>): Promise<Record<string, any>> {

        const logTool = this.logToolFactory ();
        logTool.setTrace (traceObject);
        logTool.INITIALIZE ();

        let resultObject: Record<string, any> = {};

        try {

            paramsObject.txt_schema = 'frontend';
            paramsObject.txt_function = 'page_action';

            resultObject = await this.postgresModule.execute (logTool.getTrace (), paramsObject);

        } catch (exception) {

            if (!resultObject.status) {

                resultObject.status = {};

            }

            resultObject.status.boo_exception = true;
            resultObject.status.num_exception = LogConstants.SERVICE.num_exception;
            resultObject.status.txt_exception = LogConstants.SERVICE.txt_exception;

            logTool.ERR (LogConstants.SERVICE);
            logTool.FINALIZE ();

            return resultObject;

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

    public async getLinkAction (traceObject: Record<string, any>, paramsObject: Record<string, any>): Promise<Record<string, any>> {

        const logTool = this.logToolFactory ();
        logTool.setTrace (traceObject);
        logTool.INITIALIZE ();

        let resultObject: Record<string, any> = {};

        try {

            paramsObject.txt_schema = 'frontend';
            paramsObject.txt_function = 'link_action';

            resultObject = await this.postgresModule.execute (logTool.getTrace (), paramsObject);

        } catch (exception) {

            if (!resultObject.status) {

                resultObject.status = {};

            }

            resultObject.status.boo_exception = true;
            resultObject.status.num_exception = LogConstants.SERVICE.num_exception;
            resultObject.status.txt_exception = LogConstants.SERVICE.txt_exception;

            logTool.ERR (LogConstants.SERVICE);
            logTool.FINALIZE ();

            return resultObject;

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

    public async getFileAction (traceObject: Record<string, any>, paramsObject: Record<string, any>): Promise<Record<string, any>> {

        const logTool = this.logToolFactory ();
        logTool.setTrace (traceObject);
        logTool.INITIALIZE ();

        let resultObject: Record<string, any> = {};

        try {

            paramsObject.txt_schema = 'frontend';
            paramsObject.txt_function = 'file_action';

            resultObject = await this.postgresModule.execute (logTool.getTrace (), paramsObject);

        } catch (exception) {

            if (!resultObject.status) {

                resultObject.status = {};

            }

            resultObject.status.boo_exception = true;
            resultObject.status.num_exception = LogConstants.SERVICE.num_exception;
            resultObject.status.txt_exception = LogConstants.SERVICE.txt_exception;

            logTool.ERR (LogConstants.SERVICE);
            logTool.FINALIZE ();

            return resultObject;

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