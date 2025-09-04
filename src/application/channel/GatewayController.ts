import {inject, injectable} from 'tsyringe';

import {NaturalModule} from '../middleware/NaturalModule';
import {PostgresModule} from '../middleware/PostgresModule';

import {LogTool} from '../toolkit/LogTool';
import {RegistryTool} from '../toolkit/RegistryTool';

import {ApplicationConstants} from '../constants/ApplicationConstants';
import {LogConstants} from '../constants/LogConstants';

@injectable ()
export class GatewayController {

    constructor (
        @inject ('LogToolFactory') private logToolFactory: () => LogTool,
        @inject (NaturalModule) private naturalModule: NaturalModule,
        @inject (PostgresModule) private postgresModule: PostgresModule
    ) {
    }

    public async processMessage (traceRecord: Record<string, any>, requestRecord: Record<string, any>): Promise<Record<string, any>> {

        const logTool = this.logToolFactory ();

        let intentRecord = await this.naturalModule.getIntent (requestRecord.txt_incoming);

        let resultRecord: Record<string, any> = {};
        resultRecord.intent = intentRecord

        for (let actionRecord of intentRecord.actions) {

            switch (actionRecord.type) {

                case ApplicationConstants.ACTION_FUNCTION:

                    resultRecord = await this.executeFunction (traceRecord, actionRecord, resultRecord);

                    break;

                case ApplicationConstants.ACTION_METHOD:

                    resultRecord = await this.executeMethod (traceRecord, actionRecord, resultRecord);

                    break;

                case ApplicationConstants.ACTION_RESPONSE:

                    actionRecord = intentRecord;

                    resultRecord = await this.executeResponse (traceRecord, actionRecord, resultRecord);

                    break;

            }

        }

        logTool.OK ();

        return resultRecord;

    }

    private async executeFunction (traceRecord: Record<string, any>, actionRecord: Record<string, any>, resultRecord: Record<string, any>): Promise<Record<string, any>> {

        const logTool = this.logToolFactory ();
        logTool.setTrace (traceRecord);
        logTool.INITIALIZE ();

        const paramsRecord: Record<string, any> = {};

        try {

            paramsRecord.txt_schema = actionRecord.schema;
            paramsRecord.txt_function = actionRecord.function;

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

    private async executeMethod (traceRecord: Record<string, any>, actionRecord: Record<string, any>, resultRecord: Record<string, any>): Promise<Record<string, any>> {

        const logTool = this.logToolFactory ();
        logTool.setTrace (traceRecord);
        logTool.INITIALIZE ();

        try {

            const instanceObject = await RegistryTool.getClass (actionRecord.class);

            const methodObject = (instanceObject as any) [actionRecord.method];

            const parametersObject: never [] = [];

            resultRecord = methodObject.apply (instanceObject, parametersObject);

            logTool.OK ();

        } catch (exception) {

            logTool.ERR (LogConstants.SERVICE);

        }

        logTool.FINALIZE ();

        return resultRecord;

    }

    private async executeResponse (traceRecord: Record<string, any>, actionRecord: Record<string, any>, resultRecord: Record<string, any>): Promise<Record<string, any>> {

        const logTool = this.logToolFactory ();
        logTool.setTrace (traceRecord);
        logTool.INITIALIZE ();

        const randomNumber = Math.floor (Math.random () * actionRecord.responses.length);

        resultRecord = actionRecord.responses [randomNumber].message;

        logTool.FINALIZE ();

        return resultRecord;

    }

}