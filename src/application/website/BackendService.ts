import {inject, injectable} from 'tsyringe';

import fsExtra from 'fs-extra';

import {MongoDbModule} from 'src/application/middleware/MongoDbModule';
import {PostgresModule} from 'src/application/middleware/PostgresModule';
import {WebserviceModule} from 'src/application/middleware/WebserviceModule';

import {CommonsTool} from 'src/application/toolkit/CommonsTool';
import {ExceptionTool} from 'src/application/toolkit/ExceptionTool';
import {LogTool} from 'src/application/toolkit/LogTool';

import {JsonObject} from 'src/application/object/JsonObject';
import {ResultObject} from 'src/application/object/ResultObject';

@injectable ()
export class BackendService {

    constructor (
        @inject (MongoDbModule) private mongoDbModule: MongoDbModule,
        @inject (PostgresModule) private postgresModule: PostgresModule,
        @inject (WebserviceModule) private webserviceModule: WebserviceModule,
        @inject (LogTool) private logTool: LogTool
    ) {
    }

    public async postWakeupAction (paramsObject: JsonObject, traceObject: JsonObject): Promise<ResultObject> {

        const stackStringArray = CommonsTool.getStackStringArray ();

        this.logTool.initialize (stackStringArray, traceObject);

        let resultObject = new ResultObject ();

        try {

            paramsObject.set ('txt_schema', 'backend');
            paramsObject.set ('txt_function', 'wakeup_action');

            resultObject = await this.postgresModule.execute (paramsObject, this.logTool.trace ());

        } catch (exception) {

            resultObject.setResult (ExceptionTool.APPLICATION_EXCEPTION (stackStringArray));

            this.logTool.exception ();

        }

        this.logTool.response (resultObject);
        this.logTool.finalize ();

        return resultObject;

    }

    public async postDeleteCacheAction (paramsObject: JsonObject, traceObject: JsonObject): Promise<ResultObject> {

        const stackStringArray = CommonsTool.getStackStringArray ();

        this.logTool.initialize (stackStringArray, traceObject);

        const headersObject = new JsonObject ();
        headersObject.set ('authorization', 'Bearer ' + paramsObject.get ('txt_token'));
        headersObject.set ('content-type', 'application/json');

        const bodyObject = new JsonObject ();
        bodyObject.set ('purge_everything', true);

        const resultObject = new ResultObject ();

        try {

            await this.webserviceModule.delete (paramsObject.get ('txt_host'), headersObject, null, bodyObject, this.logTool.trace ());

            resultObject.setResult (ExceptionTool.SUCCESSFUL ());

        } catch (exception) {

            resultObject.setResult (ExceptionTool.APPLICATION_EXCEPTION (stackStringArray));

            this.logTool.exception ();

        }

        this.logTool.response (resultObject);
        this.logTool.finalize ();

        return resultObject;

    }

    public async postRebuildDocumentalAction (traceObject: JsonObject): Promise<ResultObject> {

        const stackStringArray = CommonsTool.getStackStringArray ();

        this.logTool.initialize (stackStringArray, traceObject);

        const resultObject = new ResultObject ();

        try {

            await this.mongoDbModule.rebuild (this.logTool.trace ());

            resultObject.setResult (ExceptionTool.SUCCESSFUL ());

        } catch (exception) {

            resultObject.setResult (ExceptionTool.APPLICATION_EXCEPTION (stackStringArray));

            this.logTool.exception ();

        }

        this.logTool.response (resultObject);
        this.logTool.finalize ();

        return resultObject;

    }

    public async postRebuildRelationalAction (paramsObject: JsonObject, traceObject: JsonObject): Promise<ResultObject> {

        const stackStringArray = CommonsTool.getStackStringArray ();

        this.logTool.initialize (stackStringArray, traceObject);

        const resultObject = new ResultObject ();

        try {

            await this.rebuildReadMainFile (paramsObject, this.logTool.trace ());

            resultObject.setResult (ExceptionTool.SUCCESSFUL ());

        } catch (exception) {

            resultObject.setResult (ExceptionTool.APPLICATION_EXCEPTION (stackStringArray));

            this.logTool.exception ();

        }

        this.logTool.response (resultObject);
        this.logTool.finalize ();

        return resultObject;

    }

    private async rebuildReadMainFile (paramsObject: JsonObject, traceObject: JsonObject): Promise<void> {

        const stackStringArray = CommonsTool.getStackStringArray ();

        this.logTool.initialize (stackStringArray, traceObject);

        const resultObject = new ResultObject ();

        const contentBuffer = fsExtra.readFileSync (paramsObject.get ('txt_path') + paramsObject.get ('txt_file'));

        const contentString = contentBuffer.toString ();

        const linesString = contentString.split (/\r?\n/);

        for (let offsetNumber = 0; offsetNumber < linesString.length; offsetNumber++) {

            const lineString = linesString[offsetNumber].trim ();

            if (lineString.startsWith ('/*') || lineString.startsWith ('--') || lineString === '') {

                continue;

            }

            paramsObject.set ('txt_folder', lineString);

            await this.rebuildReadFolderFile (paramsObject, this.logTool.trace ());

        }

        this.logTool.response (resultObject);
        this.logTool.finalize ();

    }

    private async rebuildReadFolderFile (paramsObject: JsonObject, traceObject: JsonObject): Promise<void> {

        const stackStringArray = CommonsTool.getStackStringArray ();

        this.logTool.initialize (stackStringArray, traceObject);

        paramsObject.set ('txt_folder', paramsObject.get ('txt_folder').split ('/') [0] + '/');

        const contentBuffer = fsExtra.readFileSync (paramsObject.get ('txt_path') + paramsObject.get ('txt_folder') + paramsObject.get ('txt_file'));

        const contentString = contentBuffer.toString ();

        const linesString = contentString.split (/\r?\n/);

        for (let offsetNumber = 0; offsetNumber < linesString.length; offsetNumber++) {

            const lineString = linesString[offsetNumber].trim ();

            if (lineString.startsWith ('/*') || lineString.startsWith ('--') || lineString === '') {

                continue;

            }

            paramsObject.set ('txt_script', lineString);

            await this.rebuildReadScriptFile (paramsObject, this.logTool.trace ());

        }

        this.logTool.comment ('Folder:', paramsObject.get ('txt_folder').split ('/') [0]);
        this.logTool.finalize ();

    }

    private async rebuildReadScriptFile (paramsObject: JsonObject, traceObject: JsonObject): Promise<void> {

        const stackStringArray = CommonsTool.getStackStringArray ();

        this.logTool.initialize (stackStringArray, traceObject);

        const contentBuffer = fsExtra.readFileSync (paramsObject.get ('txt_path') + paramsObject.get ('txt_folder') + paramsObject.get ('txt_script'));
        const contentString = contentBuffer.toString ();

        paramsObject.set ('txt_content', contentString);

        try {

            await this.postgresModule.execute (paramsObject, this.logTool.trace ());

        } catch (exception) {

            this.logTool.exception ();

        }

        this.logTool.comment ('File:', paramsObject.get ('txt_folder') + paramsObject.get ('txt_script'));
        this.logTool.finalize ();

    }

    public async postReloadIndicatorsAction (paramsObject: JsonObject, traceObject: JsonObject): Promise<ResultObject> {

        const stackStringArray = CommonsTool.getStackStringArray ();

        this.logTool.initialize (stackStringArray, traceObject);

        const resultObject = new ResultObject ();

        try {

            await this.reloadDollarIndicators (paramsObject, this.logTool.trace ());
            await this.reloadEuroIndicators (paramsObject, this.logTool.trace ());
            await this.reloadFomentUnitIndicators (paramsObject, this.logTool.trace ());
            await this.reloadMonthlyTaxUnitIndicators (paramsObject, this.logTool.trace ());

            resultObject.setResult (ExceptionTool.SUCCESSFUL ());

        } catch (exception) {

            resultObject.setResult (ExceptionTool.APPLICATION_EXCEPTION (stackStringArray));

            this.logTool.exception ();

        }

        this.logTool.response (resultObject);
        this.logTool.finalize ();

        return resultObject;

    }

    private async reloadDollarIndicators (paramsObject: JsonObject, traceObject: JsonObject): Promise<ResultObject> {

        const stackStringArray = CommonsTool.getStackStringArray ();

        this.logTool.initialize (stackStringArray, traceObject);

        const headersObject = new JsonObject ();

        const queryObject = new JsonObject ();
        queryObject.del ('jsn_data');
        queryObject.set ('apikey', paramsObject.get ('txt_token'));
        queryObject.set ('formato', 'json');

        const bodyObject = new JsonObject ();

        let resultObject = new ResultObject ();

        try {

            resultObject = await this.webserviceModule.get (paramsObject.get ('txt_host_dollar') + '/' + new Date ().getFullYear ().toString (), headersObject, queryObject, bodyObject, this.logTool.trace ());
            resultObject.set ('outgoing', resultObject.get (['outgoing', 'Dolares']));
            resultObject.rename ('Fecha', 'date');
            resultObject.rename ('Valor', 'value');

            queryObject.del ('apikey');
            queryObject.del ('formato');
            queryObject.set ('jsn_data', resultObject.get ('outgoing'));
            queryObject.set ('txt_schema', 'indicators');
            queryObject.set ('txt_function', 'set_dollar_values');

            await this.postgresModule.execute (queryObject, this.logTool.trace ());

        } catch (exception) {

            resultObject.setResult (ExceptionTool.INDICATORS_EXCEPTION (stackStringArray));

            this.logTool.exception ();

        }

        this.logTool.response (resultObject);
        this.logTool.finalize ();

        return resultObject;

    }

    private async reloadEuroIndicators (paramsObject: JsonObject, traceObject: JsonObject): Promise<ResultObject> {

        const stackStringArray = CommonsTool.getStackStringArray ();

        this.logTool.initialize (stackStringArray, traceObject);

        const headersObject = new JsonObject ();

        const queryObject = new JsonObject ();
        queryObject.del ('jsn_data');
        queryObject.set ('apikey', paramsObject.get ('txt_token'));
        queryObject.set ('formato', 'json');

        const bodyObject = new JsonObject ();

        let resultObject = new ResultObject ();

        try {

            resultObject = await this.webserviceModule.get (paramsObject.get ('txt_host_euro') + '/' + new Date ().getFullYear ().toString (), headersObject, queryObject, bodyObject, this.logTool.trace ());
            resultObject.set ('outgoing', resultObject.get (['outgoing', 'Euros']));
            resultObject.rename ('Fecha', 'date');
            resultObject.rename ('Valor', 'value');

            queryObject.del ('apikey');
            queryObject.del ('formato');
            queryObject.set ('jsn_data', resultObject.get ('outgoing'));
            queryObject.set ('txt_schema', 'indicators');
            queryObject.set ('txt_function', 'set_euro_values');

            await this.postgresModule.execute (queryObject, this.logTool.trace ());

        } catch (exception) {

            resultObject.setResult (ExceptionTool.INDICATORS_EXCEPTION (stackStringArray));

            this.logTool.exception ();

        }

        this.logTool.response (resultObject);
        this.logTool.finalize ();

        return resultObject;

    }

    private async reloadFomentUnitIndicators (paramsObject: JsonObject, traceObject: JsonObject): Promise<ResultObject> {

        const stackStringArray = CommonsTool.getStackStringArray ();

        this.logTool.initialize (stackStringArray, traceObject);

        let headersObject = new JsonObject ();

        let queryObject = new JsonObject ();
        queryObject.del ('jsn_data');
        queryObject.set ('apikey', paramsObject.get ('txt_token'));
        queryObject.set ('formato', 'json');

        const bodyObject = new JsonObject ();

        let resultObject = new ResultObject ();

        try {

            resultObject = await this.webserviceModule.get (paramsObject.get ('txt_host_foment_unit') + '/' + new Date ().getFullYear ().toString (), headersObject, queryObject, bodyObject, this.logTool.trace ());
            resultObject.set ('outgoing', resultObject.get (['outgoing', 'UFs']));
            resultObject.rename ('Fecha', 'date');
            resultObject.rename ('Valor', 'value');

            queryObject.del ('apikey');
            queryObject.del ('formato');
            queryObject.set ('jsn_data', resultObject.get ('outgoing'));
            queryObject.set ('txt_schema', 'indicators');
            queryObject.set ('txt_function', 'set_foment_unit_values');

            await this.postgresModule.execute (queryObject, this.logTool.trace ());

        } catch (exception) {

            resultObject.setResult (ExceptionTool.INDICATORS_EXCEPTION (stackStringArray));

            this.logTool.exception ();

        }

        this.logTool.response (resultObject);
        this.logTool.finalize ();

        return resultObject;

    }

    private async reloadMonthlyTaxUnitIndicators (paramsObject: JsonObject, traceObject: JsonObject): Promise<ResultObject> {

        const stackStringArray = CommonsTool.getStackStringArray ();

        this.logTool.initialize (stackStringArray, traceObject);

        let headersObject = new JsonObject ();

        let queryObject = new JsonObject ();
        queryObject.del ('jsn_data');
        queryObject.set ('apikey', paramsObject.get ('txt_token'));
        queryObject.set ('formato', 'json');

        const bodyObject = new JsonObject ();

        let resultObject = new ResultObject ();

        try {

            resultObject = await this.webserviceModule.get (paramsObject.get ('txt_host_monthly_tax_unit') + '/' + new Date ().getFullYear ().toString (), headersObject, queryObject, bodyObject, this.logTool.trace ());
            resultObject.set ('outgoing', resultObject.get (['outgoing', 'UTMs']));
            resultObject.rename ('Fecha', 'date');
            resultObject.rename ('Valor', 'value');

            queryObject.del ('apikey');
            queryObject.del ('formato');
            queryObject.set ('jsn_data', resultObject.get ('outgoing'));
            queryObject.set ('txt_schema', 'indicators');
            queryObject.set ('txt_function', 'set_monthly_tax_unit_values');

            await this.postgresModule.execute (queryObject, this.logTool.trace ());

        } catch (exception) {

            resultObject.setResult (ExceptionTool.INDICATORS_EXCEPTION (stackStringArray));

            this.logTool.exception ();

        }

        this.logTool.response (resultObject);
        this.logTool.finalize ();

        return resultObject;

    }

}