import {inject, injectable} from 'tsyringe';

import fsExtra from 'fs-extra';

import {MongoDbModule} from '../middleware/MongoDbModule';
import {PostgresModule} from '../middleware/PostgresModule';
import {WebserviceModule} from '../middleware/WebserviceModule';

import {LogTool} from '../toolkit/LogTool';

import {LogConstants} from '../constants/LogConstants';

@injectable ()
export class BackendService {

    constructor (
        @inject ('LogToolFactory') private logToolFactory: () => LogTool,
        @inject (MongoDbModule) private mongoDbModule: MongoDbModule,
        @inject (PostgresModule) private postgresModule: PostgresModule,
        @inject (WebserviceModule) private webserviceModule: WebserviceModule
    ) {
    }

    public async postWakeupAction (traceRecord: Record<string, any>, paramsRecord: Record<string, any>): Promise<Record<string, any>> {

        const logTool = this.logToolFactory ();
        logTool.setTrace (traceRecord);
        logTool.INITIALIZE ();

        let resultRecord: Record<string, any> = {};

        try {

            paramsRecord.txt_schema = 'backend';
            paramsRecord.txt_function = 'wakeup_action';

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

    public async postDeleteCacheAction (traceRecord: Record<string, any>, paramsRecord: Record<string, any>): Promise<Record<string, any>> {

        const logTool = this.logToolFactory ();
        logTool.setTrace (traceRecord);
        logTool.INITIALIZE ();

        let resultRecord: Record<string, any> = {};

        try {

            const headersRecord: Record<string, any> = {};
            headersRecord.authorization = 'Bearer ' + paramsRecord.txt_token;
            headersRecord.content_type = 'application/json';

            const bodyRecord: Record<string, any> = {};
            bodyRecord.purge_everything = true;

            resultRecord = await this.webserviceModule.delete (logTool.getTrace (), paramsRecord.txt_host, headersRecord, undefined, bodyRecord);

            logTool.OK ();

        } catch (exception) {

            resultRecord.status = {};
            resultRecord.status.boo_exception = true;
            resultRecord.status.num_exception = LogConstants.SERVICE.num_exception;
            resultRecord.status.txt_exception = LogConstants.SERVICE.txt_exception;

            logTool.ERR (LogConstants.SERVICE);

        }

        logTool.FINALIZE ();

        return resultRecord;

    }

    public async postRebuildDocumentalAction (traceRecord: Record<string, any>, _paramsRecord: Record<string, any>): Promise<Record<string, any>> {

        const logTool = this.logToolFactory ();
        logTool.setTrace (traceRecord);
        logTool.INITIALIZE ();

        let resultRecord: Record<string, any> = {};

        try {

            await this.mongoDbModule.rebuildTraces ();

            resultRecord.status = {};
            resultRecord.status.boo_exception = false;
            resultRecord.status.num_exception = LogConstants.SUCCESS.num_exception;
            resultRecord.status.txt_exception = LogConstants.SUCCESS.txt_exception;

            logTool.OK ();

        } catch (exception) {

            resultRecord.status = {};
            resultRecord.status.boo_exception = true;
            resultRecord.status.num_exception = LogConstants.SERVICE.num_exception;
            resultRecord.status.txt_exception = LogConstants.SERVICE.txt_exception;

            logTool.ERR (LogConstants.SERVICE);

        }

        logTool.FINALIZE ();

        return resultRecord;

    }

    public async postRebuildRelationalAction (traceRecord: Record<string, any>, paramsRecord: Record<string, any>): Promise<Record<string, any>> {

        const logTool = this.logToolFactory ();
        logTool.setTrace (traceRecord);
        logTool.INITIALIZE ();

        let resultRecord: Record<string, any> = {};

        try {

            resultRecord = await this.rebuildReadMainFile (logTool.getTrace (), paramsRecord);

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

    public async postReloadIndicatorsAction (traceRecord: Record<string, any>, paramsRecord: Record<string, any>): Promise<Record<string, any>> {

        const logTool = this.logToolFactory ();
        logTool.setTrace (traceRecord);
        logTool.INITIALIZE ();

        let resultRecord: Record<string, any> = {};

        try {

            await this.reloadDollarIndicators (logTool.getTrace (), paramsRecord);
            await this.reloadEuroIndicators (logTool.getTrace (), paramsRecord);
            await this.reloadFomentUnitIndicators (logTool.getTrace (), paramsRecord);
            await this.reloadMonthlyTaxUnitIndicators (logTool.getTrace (), paramsRecord);

            logTool.OK ();

        } catch (exception) {

            if (!resultRecord.status) {

                resultRecord.status = {};

            }

            resultRecord.status.boo_exception = true;
            resultRecord.status.num_exception = LogConstants.SERVICE.num_exception;
            resultRecord.status.txt_exception = LogConstants.SERVICE.txt_exception;

            logTool.ERR (LogConstants.INDICATOR);

        }

        logTool.FINALIZE ();

        return resultRecord;

    }

    private async rebuildReadMainFile (traceRecord: Record<string, any>, paramsRecord: Record<string, any>): Promise<Record<string, any>> {

        const logTool = this.logToolFactory ();
        logTool.setTrace (traceRecord);
        logTool.INITIALIZE ();

        let resultRecord: Record<string, any> = {};

        let exceptionBoolean = false;

        const nonSharedBuffer = fsExtra.readFileSync (paramsRecord.txt_path + paramsRecord.txt_file);

        const contentString = nonSharedBuffer.toString ();

        const linesString = contentString.split (/\r?\n/);

        for (let offsetNumber = 0; offsetNumber < linesString.length; offsetNumber++) {

            const lineString = linesString [offsetNumber].trim ();

            if (lineString.startsWith ('/*') || lineString.startsWith ('--') || lineString === '') {

                continue;

            }

            paramsRecord.txt_folder = lineString;

            resultRecord = await this.rebuildReadFolderFile (logTool.getTrace (), paramsRecord);

            if (resultRecord.status.boo_exception == true) {

                exceptionBoolean = true;

            }

        }

        if (!exceptionBoolean) {

            resultRecord.status.boo_exception = false;
            resultRecord.status.num_exception = LogConstants.SUCCESS.num_exception;
            resultRecord.status.txt_exception = LogConstants.SUCCESS.txt_exception;

            logTool.OK ('Main Success', paramsRecord.txt_path + paramsRecord.txt_file);

        } else {

            resultRecord.status.boo_exception = true;
            resultRecord.status.num_exception = LogConstants.SERVICE.num_exception;
            resultRecord.status.txt_exception = LogConstants.SERVICE.txt_exception;

            logTool.NOK ('Main Failed', paramsRecord.txt_path + paramsRecord.txt_file);

        }

        logTool.FINALIZE ();

        return resultRecord;

    }

    private async rebuildReadFolderFile (traceRecord: Record<string, any>, paramsRecord: Record<string, any>): Promise<Record<string, any>> {

        const logTool = this.logToolFactory ();
        logTool.setSoftTrace (traceRecord);
        logTool.INITIALIZE ();

        paramsRecord.txt_folder = paramsRecord.txt_folder.split ('/') [0] + '/';

        const nonSharedBuffer = fsExtra.readFileSync (paramsRecord.txt_path + paramsRecord.txt_folder + paramsRecord.txt_file);

        const contentString = nonSharedBuffer.toString ();

        const linesString = contentString.split (/\r?\n/);

        let resultRecord: Record<string, any> = {};

        let exceptionBoolean = false;

        for (let offsetNumber = 0; offsetNumber < linesString.length; offsetNumber++) {

            const lineString = linesString [offsetNumber].trim ();

            if (lineString.startsWith ('/*') || lineString.startsWith ('--') || lineString === '') {

                continue;

            }

            paramsRecord.txt_script = lineString;

            resultRecord = await this.rebuildReadScriptFile (logTool.getTrace (), paramsRecord);

            if (resultRecord.status.boo_exception == true) {

                exceptionBoolean = true;

            }

        }

        if (!exceptionBoolean) {

            resultRecord.status.boo_exception = false;
            resultRecord.status.num_exception = LogConstants.SUCCESS.num_exception;
            resultRecord.status.txt_exception = LogConstants.SUCCESS.txt_exception;

            logTool.OK ('Folder Success', paramsRecord.txt_path + paramsRecord.txt_folder.split ('/') [0]);

        } else {

            resultRecord.status.boo_exception = true;
            resultRecord.status.num_exception = LogConstants.SERVICE.num_exception;
            resultRecord.status.txt_exception = LogConstants.SERVICE.txt_exception;

            logTool.NOK ('Folder Failed', paramsRecord.txt_path + paramsRecord.txt_folder.split ('/') [0]);

        }

        logTool.FINALIZE ();

        return resultRecord;

    }

    private async rebuildReadScriptFile (traceRecord: Record<string, any>, paramsRecord: Record<string, any>): Promise<Record<string, any>> {

        const logTool = this.logToolFactory ();
        logTool.setSoftTrace (traceRecord);
        logTool.INITIALIZE ();

        const contentBuffer = fsExtra.readFileSync (paramsRecord.txt_path + paramsRecord.txt_folder + paramsRecord.txt_script);

        const contentString = contentBuffer.toString ();

        let resultRecord: Record<string, any> = {};

        try {

            paramsRecord.txt_content = contentString;

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

    private async reloadDollarIndicators (traceRecord: Record<string, any>, paramsRecord: Record<string, any>): Promise<Record<string, any>> {

        const logTool = this.logToolFactory ();
        logTool.setSoftTrace (traceRecord);
        logTool.INITIALIZE ();

        const headersRecord: Record<string, any> = {};

        const queryRecord: Record<string, any> = {};
        delete queryRecord.jsn_data;
        queryRecord.apikey = paramsRecord.txt_token;
        queryRecord.formato = 'json';

        const bodyRecord: Record<string, any> = {};

        let resultRecord: Record<string, any> = {};

        try {

            resultRecord = await this.webserviceModule.get (logTool.getTrace (), paramsRecord.txt_host_dollar + '/' + new Date ().getFullYear ().toString (), headersRecord, queryRecord, bodyRecord);

            let transientRecord: Record<string, any> = JSON.parse (resultRecord.outgoing.text);
            transientRecord = transientRecord.Dolares;
            transientRecord = transientRecord.map ((item: { Valor: any; Fecha: any; }): { value: any, date: any } => ({
                value: item.Valor,
                date: item.Fecha
            }));

            delete queryRecord.apikey;
            delete queryRecord.formato;
            queryRecord.jsn_data = transientRecord;
            queryRecord.txt_schema = 'indicators';
            queryRecord.txt_function = 'setDollarValues';

            resultRecord = await this.postgresModule.execute (logTool.getTrace (), queryRecord);

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

    private async reloadEuroIndicators (traceRecord: Record<string, any>, paramsRecord: Record<string, any>): Promise<Record<string, any>> {

        const logTool = this.logToolFactory ();
        logTool.setSoftTrace (traceRecord);
        logTool.INITIALIZE ();

        const headersRecord: Record<string, any> = {};

        const queryRecord: Record<string, any> = {};
        delete queryRecord.jsn_data;
        queryRecord.apikey = paramsRecord.txt_token;
        queryRecord.formato = 'json';

        const bodyRecord: Record<string, any> = {};

        let resultRecord: Record<string, any> = {};

        try {

            resultRecord = await this.webserviceModule.get (logTool.getTrace (), paramsRecord.txt_host_euro + '/' + new Date ().getFullYear ().toString (), headersRecord, queryRecord, bodyRecord);

            let transientRecord: Record<string, any> = JSON.parse (resultRecord.outgoing.text);
            transientRecord = transientRecord.Euros;
            transientRecord = transientRecord.map ((item: { Valor: any; Fecha: any; }): { value: any, date: any } => ({
                value: item.Valor,
                date: item.Fecha
            }));

            delete queryRecord.apikey;
            delete queryRecord.formato;
            queryRecord.jsn_data = transientRecord;
            queryRecord.txt_schema = 'indicators';
            queryRecord.txt_function = 'setEuroValues';

            resultRecord = await this.postgresModule.execute (logTool.getTrace (), queryRecord);

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

    private async reloadFomentUnitIndicators (traceRecord: Record<string, any>, paramsRecord: Record<string, any>): Promise<Record<string, any>> {

        const logTool = this.logToolFactory ();
        logTool.setSoftTrace (traceRecord);
        logTool.INITIALIZE ();

        const headersRecord: Record<string, any> = {};

        const queryRecord: Record<string, any> = {};
        delete queryRecord.jsn_data;
        queryRecord.apikey = paramsRecord.txt_token;
        queryRecord.formato = 'json';

        const bodyRecord: Record<string, any> = {};

        let resultRecord: Record<string, any> = {};

        try {

            resultRecord = await this.webserviceModule.get (logTool.getTrace (), paramsRecord.txt_host_foment_unit + '/' + new Date ().getFullYear ().toString (), headersRecord, queryRecord, bodyRecord);

            let transientRecord: Record<string, any> = JSON.parse (resultRecord.outgoing.text);
            transientRecord = transientRecord.UFs;
            transientRecord = transientRecord.map ((item: { Valor: any; Fecha: any; }): { value: any, date: any } => ({
                value: item.Valor,
                date: item.Fecha
            }));

            delete queryRecord.apikey;
            delete queryRecord.formato;
            queryRecord.jsn_data = transientRecord;
            queryRecord.txt_schema = 'indicators';
            queryRecord.txt_function = 'setFomentUnitValues';

            resultRecord = await this.postgresModule.execute (logTool.getTrace (), queryRecord);

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

    private async reloadMonthlyTaxUnitIndicators (traceRecord: Record<string, any>, paramsRecord: Record<string, any>): Promise<Record<string, any>> {

        const logTool = this.logToolFactory ();
        logTool.setSoftTrace (traceRecord);
        logTool.INITIALIZE ();

        const headersRecord: Record<string, any> = {};

        const queryRecord: Record<string, any> = {};
        delete queryRecord.jsn_data;
        queryRecord.apikey = paramsRecord.txt_token;
        queryRecord.formato = 'json';

        const bodyRecord: Record<string, any> = {};

        let resultRecord: Record<string, any> = {};

        try {

            resultRecord = await this.webserviceModule.get (logTool.getTrace (), paramsRecord.txt_host_monthly_tax_unit + '/' + new Date ().getFullYear ().toString (), headersRecord, queryRecord, bodyRecord);

            let transientRecord: Record<string, any> = JSON.parse (resultRecord.outgoing.text);
            transientRecord = transientRecord.UTMs;
            transientRecord = transientRecord.map ((item: { Valor: any; Fecha: any; }): { value: any, date: any } => ({
                value: item.Valor,
                date: item.Fecha
            }));

            delete queryRecord.apikey;
            delete queryRecord.formato;
            queryRecord.jsn_data = transientRecord;
            queryRecord.txt_schema = 'indicators';
            queryRecord.txt_function = 'setMonthlyTaxUnitValues';

            resultRecord = await this.postgresModule.execute (logTool.getTrace (), queryRecord);

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