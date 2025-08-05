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

    public async postWakeupAction (traceObject: Record<string, any>, paramsObject: Record<string, any>): Promise<Record<string, any>> {

        const logTool = this.logToolFactory ();
        logTool.setTrace (traceObject);
        logTool.INITIALIZE ();

        let resultObject: Record<string, any> = {};

        try {

            paramsObject.txt_schema = 'backend';
            paramsObject.txt_function = 'wakeup_action';

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

    public async postDeleteCacheAction (traceObject: Record<string, any>, paramsObject: Record<string, any>): Promise<Record<string, any>> {

        const logTool = this.logToolFactory ();
        logTool.setTrace (traceObject);
        logTool.INITIALIZE ();

        let resultObject: Record<string, any> = {};

        try {

            const headersObject: Record<string, any> = {};
            headersObject.authorization = 'Bearer ' + paramsObject.txt_token;
            headersObject.content_type = 'application/json';

            const bodyObject: Record<string, any> = {};
            bodyObject.purge_everything = true;

            resultObject = await this.webserviceModule.delete (logTool.getTrace (), paramsObject.txt_host, headersObject, undefined, bodyObject);

            logTool.OK ();

        } catch (exception) {

            resultObject.status = {};
            resultObject.status.boo_exception = true;
            resultObject.status.num_exception = LogConstants.SERVICE.num_exception;
            resultObject.status.txt_exception = LogConstants.SERVICE.txt_exception;

            logTool.ERR (LogConstants.SERVICE);

        }

        logTool.FINALIZE ();

        return resultObject;

    }

    public async postRebuildDocumentalAction (traceObject: Record<string, any>, _paramsObject: Record<string, any>): Promise<Record<string, any>> {

        const logTool = this.logToolFactory ();
        logTool.setTrace (traceObject);
        logTool.INITIALIZE ();

        let resultObject: Record<string, any> = {};

        try {

            await this.mongoDbModule.rebuildTraces ();

            resultObject.status = {};
            resultObject.status.boo_exception = false;
            resultObject.status.num_exception = LogConstants.SUCCESS.num_exception;
            resultObject.status.txt_exception = LogConstants.SUCCESS.txt_exception;

            logTool.OK ();

        } catch (exception) {

            resultObject.status = {};
            resultObject.status.boo_exception = true;
            resultObject.status.num_exception = LogConstants.SERVICE.num_exception;
            resultObject.status.txt_exception = LogConstants.SERVICE.txt_exception;

            logTool.ERR (LogConstants.SERVICE);

        }

        logTool.FINALIZE ();

        return resultObject;

    }

    public async postRebuildRelationalAction (traceObject: Record<string, any>, paramsObject: Record<string, any>): Promise<Record<string, any>> {

        const logTool = this.logToolFactory ();
        logTool.setTrace (traceObject);
        logTool.INITIALIZE ();

        let resultObject: Record<string, any> = {};

        try {

            resultObject = await this.rebuildReadMainFile (logTool.getTrace (), paramsObject);

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

    public async postReloadIndicatorsAction (traceObject: Record<string, any>, paramsObject: Record<string, any>): Promise<Record<string, any>> {

        const logTool = this.logToolFactory ();
        logTool.setTrace (traceObject);
        logTool.INITIALIZE ();

        let resultObject: Record<string, any> = {};

        try {

            await this.reloadDollarIndicators (logTool.getTrace (), paramsObject);
            await this.reloadEuroIndicators (logTool.getTrace (), paramsObject);
            await this.reloadFomentUnitIndicators (logTool.getTrace (), paramsObject);
            await this.reloadMonthlyTaxUnitIndicators (logTool.getTrace (), paramsObject);

            logTool.OK ();

        } catch (exception) {

            if (!resultObject.status) {

                resultObject.status = {};

            }

            resultObject.status.boo_exception = true;
            resultObject.status.num_exception = LogConstants.SERVICE.num_exception;
            resultObject.status.txt_exception = LogConstants.SERVICE.txt_exception;

            logTool.ERR (LogConstants.INDICATOR);

        }

        logTool.FINALIZE ();

        return resultObject;

    }

    private async rebuildReadMainFile (traceObject: Record<string, any>, paramsObject: Record<string, any>): Promise<Record<string, any>> {

        const logTool = this.logToolFactory ();
        logTool.setTrace (traceObject);
        logTool.INITIALIZE ();

        let resultObject: Record<string, any> = {};

        let exceptionBoolean = false;

        const contentBuffer = fsExtra.readFileSync (paramsObject.txt_path + paramsObject.txt_file);

        const contentString = contentBuffer.toString ();

        const linesString = contentString.split (/\r?\n/);

        for (let offsetNumber = 0; offsetNumber < linesString.length; offsetNumber++) {

            const lineString = linesString[offsetNumber].trim ();

            if (lineString.startsWith ('/*') || lineString.startsWith ('--') || lineString === '') {

                continue;

            }

            paramsObject.txt_folder = lineString;

            resultObject = await this.rebuildReadFolderFile (logTool.getTrace (), paramsObject);

            if (resultObject.status.boo_exception == true) {

                exceptionBoolean = true;

            }

        }

        if (!exceptionBoolean) {

            resultObject.status.boo_exception = false;
            resultObject.status.num_exception = LogConstants.SUCCESS.num_exception;
            resultObject.status.txt_exception = LogConstants.SUCCESS.txt_exception;

            logTool.OK ('Main Success', paramsObject.txt_path + paramsObject.txt_file);

        } else {

            resultObject.status.boo_exception = true;
            resultObject.status.num_exception = LogConstants.SERVICE.num_exception;
            resultObject.status.txt_exception = LogConstants.SERVICE.txt_exception;

            logTool.NOK ('Main Failed', paramsObject.txt_path + paramsObject.txt_file);

        }

        logTool.FINALIZE ();

        return resultObject;

    }

    private async rebuildReadFolderFile (traceObject: Record<string, any>, paramsObject: Record<string, any>): Promise<Record<string, any>> {

        const logTool = this.logToolFactory ();
        logTool.setSoftTrace (traceObject);
        logTool.INITIALIZE ();

        paramsObject.txt_folder = paramsObject.txt_folder.split ('/') [0] + '/';

        const contentBuffer = fsExtra.readFileSync (paramsObject.txt_path + paramsObject.txt_folder + paramsObject.txt_file);

        const contentString = contentBuffer.toString ();

        const linesString = contentString.split (/\r?\n/);

        let resultObject: Record<string, any> = {};

        let exceptionBoolean = false;

        for (let offsetNumber = 0; offsetNumber < linesString.length; offsetNumber++) {

            const lineString = linesString[offsetNumber].trim ();

            if (lineString.startsWith ('/*') || lineString.startsWith ('--') || lineString === '') {

                continue;

            }

            paramsObject.txt_script = lineString;

            resultObject = await this.rebuildReadScriptFile (logTool.getTrace (), paramsObject);

            if (resultObject.status.boo_exception == true) {

                exceptionBoolean = true;

            }

        }

        if (!exceptionBoolean) {

            resultObject.status.boo_exception = false;
            resultObject.status.num_exception = LogConstants.SUCCESS.num_exception;
            resultObject.status.txt_exception = LogConstants.SUCCESS.txt_exception;

            logTool.OK ('Folder Success', paramsObject.txt_path + paramsObject.txt_folder.split ('/') [0]);

        } else {

            resultObject.status.boo_exception = true;
            resultObject.status.num_exception = LogConstants.SERVICE.num_exception;
            resultObject.status.txt_exception = LogConstants.SERVICE.txt_exception;

            logTool.NOK ('Folder Failed', paramsObject.txt_path + paramsObject.txt_folder.split ('/') [0]);

        }

        logTool.FINALIZE ();

        return resultObject;

    }

    private async rebuildReadScriptFile (traceObject: Record<string, any>, paramsObject: Record<string, any>): Promise<Record<string, any>> {

        const logTool = this.logToolFactory ();
        logTool.setSoftTrace (traceObject);
        logTool.INITIALIZE ();

        const contentBuffer = fsExtra.readFileSync (paramsObject.txt_path + paramsObject.txt_folder + paramsObject.txt_script);

        const contentString = contentBuffer.toString ();

        let resultObject: Record<string, any> = {};

        try {

            paramsObject.txt_content = contentString;

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

    private async reloadDollarIndicators (traceObject: Record<string, any>, paramsObject: Record<string, any>): Promise<Record<string, any>> {

        const logTool = this.logToolFactory ();
        logTool.setSoftTrace (traceObject);
        logTool.INITIALIZE ();

        const headersObject: Record<string, any> = {};

        const queryObject: Record<string, any> = {};
        delete queryObject.jsn_data;
        queryObject.apikey = paramsObject.txt_token;
        queryObject.formato = 'json';

        const bodyObject: Record<string, any> = {};

        let resultObject: Record<string, any> = {};

        try {

            resultObject = await this.webserviceModule.get (logTool.getTrace (), paramsObject.txt_host_dollar + '/' + new Date ().getFullYear ().toString (), headersObject, queryObject, bodyObject);

            let transientObject: Record<string, any> = JSON.parse (resultObject.outgoing.text);
            transientObject = transientObject.Dolares;
            transientObject = transientObject.map ((item: { Valor: any; Fecha: any; }): { value: any, date: any } => ({
                value: item.Valor,
                date: item.Fecha
            }));

            delete queryObject.apikey;
            delete queryObject.formato;
            queryObject.jsn_data = transientObject;
            queryObject.txt_schema = 'indicators';
            queryObject.txt_function = 'set_dollar_values';

            resultObject = await this.postgresModule.execute (logTool.getTrace (), queryObject);

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

    private async reloadEuroIndicators (traceObject: Record<string, any>, paramsObject: Record<string, any>): Promise<Record<string, any>> {

        const logTool = this.logToolFactory ();
        logTool.setSoftTrace (traceObject);
        logTool.INITIALIZE ();

        const headersObject: Record<string, any> = {};

        const queryObject: Record<string, any> = {};
        delete queryObject.jsn_data;
        queryObject.apikey = paramsObject.txt_token;
        queryObject.formato = 'json';

        const bodyObject: Record<string, any> = {};

        let resultObject: Record<string, any> = {};

        try {

            resultObject = await this.webserviceModule.get (logTool.getTrace (), paramsObject.txt_host_euro + '/' + new Date ().getFullYear ().toString (), headersObject, queryObject, bodyObject);

            let transientObject: Record<string, any> = JSON.parse (resultObject.outgoing.text);
            transientObject = transientObject.Euros;
            transientObject = transientObject.map ((item: { Valor: any; Fecha: any; }): { value: any, date: any } => ({
                value: item.Valor,
                date: item.Fecha
            }));

            delete queryObject.apikey;
            delete queryObject.formato;
            queryObject.jsn_data = transientObject;
            queryObject.txt_schema = 'indicators';
            queryObject.txt_function = 'set_euro_values';

            resultObject = await this.postgresModule.execute (logTool.getTrace (), queryObject);

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

    private async reloadFomentUnitIndicators (traceObject: Record<string, any>, paramsObject: Record<string, any>): Promise<Record<string, any>> {

        const logTool = this.logToolFactory ();
        logTool.setSoftTrace (traceObject);
        logTool.INITIALIZE ();

        const headersObject: Record<string, any> = {};

        const queryObject: Record<string, any> = {};
        delete queryObject.jsn_data;
        queryObject.apikey = paramsObject.txt_token;
        queryObject.formato = 'json';

        const bodyObject: Record<string, any> = {};

        let resultObject: Record<string, any> = {};

        try {

            resultObject = await this.webserviceModule.get (logTool.getTrace (), paramsObject.txt_host_foment_unit + '/' + new Date ().getFullYear ().toString (), headersObject, queryObject, bodyObject);

            let transientObject: Record<string, any> = JSON.parse (resultObject.outgoing.text);
            transientObject = transientObject.UFs;
            transientObject = transientObject.map ((item: { Valor: any; Fecha: any; }): { value: any, date: any } => ({
                value: item.Valor,
                date: item.Fecha
            }));

            delete queryObject.apikey;
            delete queryObject.formato;
            queryObject.jsn_data = transientObject;
            queryObject.txt_schema = 'indicators';
            queryObject.txt_function = 'set_foment_unit_values';

            resultObject = await this.postgresModule.execute (logTool.getTrace (), queryObject);

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

    private async reloadMonthlyTaxUnitIndicators (traceObject: Record<string, any>, paramsObject: Record<string, any>): Promise<Record<string, any>> {

        const logTool = this.logToolFactory ();
        logTool.setSoftTrace (traceObject);
        logTool.INITIALIZE ();

        const headersObject: Record<string, any> = {};

        const queryObject: Record<string, any> = {};
        delete queryObject.jsn_data;
        queryObject.apikey = paramsObject.txt_token;
        queryObject.formato = 'json';

        const bodyObject: Record<string, any> = {};

        let resultObject: Record<string, any> = {};

        try {

            resultObject = await this.webserviceModule.get (logTool.getTrace (), paramsObject.txt_host_monthly_tax_unit + '/' + new Date ().getFullYear ().toString (), headersObject, queryObject, bodyObject);

            let transientObject: Record<string, any> = JSON.parse (resultObject.outgoing.text);
            transientObject = transientObject.UTMs;
            transientObject = transientObject.map ((item: { Valor: any; Fecha: any; }): { value: any, date: any } => ({
                value: item.Valor,
                date: item.Fecha
            }));

            delete queryObject.apikey;
            delete queryObject.formato;
            queryObject.jsn_data = transientObject;
            queryObject.txt_schema = 'indicators';
            queryObject.txt_function = 'set_monthly_tax_unit_values';

            resultObject = await this.postgresModule.execute (logTool.getTrace (), queryObject);

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