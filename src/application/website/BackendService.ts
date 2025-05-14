import {container, inject, injectable} from 'tsyringe';

import fsExtra from 'fs-extra';

import {MongoDbModule} from '../middleware/MongoDbModule';
import {PostgresModule} from '../middleware/PostgresModule';
import {WebserviceModule} from '../middleware/WebserviceModule';
import {CommonsTool} from '../toolkit/CommonsTool';
import {ExceptionTool} from '../toolkit/ExceptionTool';
import {LogTool} from '../toolkit/LogTool';
import {JsonObject} from '../object/JsonObject';
import {ResultObject} from '../object/ResultObject';

@injectable ()
export class BackendService {

    constructor (
        @inject (PostgresModule) private postgresModule: PostgresModule,
        @inject (MongoDbModule) private mongoDbModule: MongoDbModule,
        @inject (WebserviceModule) private webserviceModule: WebserviceModule
    ) {
    }

    public async postWakeupAction (paramsObject: JsonObject, traceObject: JsonObject): Promise<ResultObject> {

        const stackStrings = await CommonsTool.getStackStrings ();

        const logTool = container.resolve (LogTool);
        logTool.initialize (stackStrings, traceObject);

        let resultObject = container.resolve (ResultObject);

        try {

            paramsObject.set ('txt_schema', 'backend');
            paramsObject.set ('txt_function', 'wakeup_action');

            resultObject = await this.postgresModule.execute (paramsObject, logTool.trace ());

        } catch (exception) {

            resultObject.setResult (ExceptionTool.APPLICATION_EXCEPTION (stackStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    public async postDeleteCacheAction (paramsObject: JsonObject, traceObject: JsonObject): Promise<ResultObject> {

        const stackStrings = await CommonsTool.getStackStrings ();

        const logTool = container.resolve (LogTool);
        logTool.initialize (stackStrings, traceObject);

        const headersObject = container.resolve (JsonObject);
        headersObject.set ('authorization', 'Bearer ' + paramsObject.get ('txt_token'));
        headersObject.set ('content-type', 'application/json');

        const bodyObject = container.resolve (JsonObject);
        bodyObject.set ('purge_everything', true);

        const resultObject = container.resolve (ResultObject);

        try {

            await this.webserviceModule.delete (paramsObject.get ('txt_host'), headersObject, null, bodyObject, logTool.trace ());

            resultObject.setResult (ExceptionTool.SUCCESSFUL ());

        } catch (exception) {

            resultObject.setResult (ExceptionTool.APPLICATION_EXCEPTION (stackStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    public async postRebuildDocumentalAction (traceObject: JsonObject): Promise<ResultObject> {

        const stackStrings = await CommonsTool.getStackStrings ();

        const logTool = container.resolve (LogTool);
        logTool.initialize (stackStrings, traceObject);

        const resultObject = container.resolve (ResultObject);

        try {

            await this.mongoDbModule.rebuild (logTool.trace ());

            resultObject.setResult (ExceptionTool.SUCCESSFUL ());

        } catch (exception) {

            resultObject.setResult (ExceptionTool.APPLICATION_EXCEPTION (stackStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    public async postRebuildRelationalAction (paramsObject: JsonObject, traceObject: JsonObject): Promise<ResultObject> {

        const stackStrings = await CommonsTool.getStackStrings ();

        const logTool = container.resolve (LogTool);
        logTool.initialize (stackStrings, traceObject);

        const resultObject = container.resolve (ResultObject);

        try {

            await this.rebuildReadMainFile (paramsObject, logTool.trace ());

            resultObject.setResult (ExceptionTool.SUCCESSFUL ());

        } catch (exception) {

            resultObject.setResult (ExceptionTool.APPLICATION_EXCEPTION (stackStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    private async rebuildReadMainFile (paramsObject: JsonObject, traceObject: JsonObject): Promise<void> {

        const stackStrings = await CommonsTool.getStackStrings ();

        const logTool = container.resolve (LogTool);
        logTool.initialize (stackStrings, traceObject);

        const contentBuffer = fsExtra.readFileSync (paramsObject.get ('txt_path') + paramsObject.get ('txt_file'));

        const contentString = contentBuffer.toString ();

        const linesString = contentString.split (/\r?\n/);

        for (let offsetNumber = 0; offsetNumber < linesString.length; offsetNumber++) {

            const lineString = linesString[offsetNumber].trim ();

            if (lineString.startsWith ('/*') || lineString.startsWith ('--') || lineString === '') {

                continue;

            }

            paramsObject.set ('txt_folder', lineString);

            await this.rebuildReadFolderFile (paramsObject, logTool.trace ());

        }

        logTool.finalize ();

    }

    private async rebuildReadFolderFile (paramsObject: JsonObject, traceObject: JsonObject): Promise<void> {

        const stackStrings = await CommonsTool.getStackStrings ();

        const logTool = container.resolve (LogTool);
        logTool.initialize (stackStrings, traceObject);

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

            await this.rebuildReadScriptFile (paramsObject, logTool.trace ());

        }

        logTool.comment ('Folder:', paramsObject.get ('txt_folder').split ('/') [0]);
        logTool.finalize ();

    }

    private async rebuildReadScriptFile (paramsObject: JsonObject, traceObject: JsonObject): Promise<void> {

        const stackStrings = await CommonsTool.getStackStrings ();

        const logTool = container.resolve (LogTool);
        logTool.initialize (stackStrings, traceObject);

        const contentBuffer = fsExtra.readFileSync (paramsObject.get ('txt_path') + paramsObject.get ('txt_folder') + paramsObject.get ('txt_script'));
        const contentString = contentBuffer.toString ();

        paramsObject.set ('txt_content', contentString);

        try {

            await this.postgresModule.execute (paramsObject, logTool.trace ());

        } catch (exception) {

            logTool.exception ();

        }

        logTool.comment ('File:', paramsObject.get ('txt_folder') + paramsObject.get ('txt_script'));
        logTool.finalize ();

    }

    public async postReloadIndicatorsAction (paramsObject: JsonObject, traceObject: JsonObject): Promise<ResultObject> {

        const stackStrings = await CommonsTool.getStackStrings ();

        const logTool = container.resolve (LogTool);
        logTool.initialize (stackStrings, traceObject);

        const resultObject = container.resolve (ResultObject);

        try {

            await this.reloadDollarIndicators (paramsObject, logTool.trace ());
            await this.reloadEuroIndicators (paramsObject, logTool.trace ());
            await this.reloadFomentUnitIndicators (paramsObject, logTool.trace ());
            await this.reloadMonthlyTaxUnitIndicators (paramsObject, logTool.trace ());

            resultObject.setResult (ExceptionTool.SUCCESSFUL ());

        } catch (exception) {

            resultObject.setResult (ExceptionTool.APPLICATION_EXCEPTION (stackStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    private async reloadDollarIndicators (paramsObject: JsonObject, traceObject: JsonObject): Promise<ResultObject> {

        const stackStrings = await CommonsTool.getStackStrings ();

        const logTool = container.resolve (LogTool);
        logTool.initialize (stackStrings, traceObject);

        const headersObject = container.resolve (JsonObject);

        const queryObject = container.resolve (JsonObject);
        queryObject.del ('jsn_data');
        queryObject.set ('apikey', paramsObject.get ('txt_token'));
        queryObject.set ('formato', 'json');

        const bodyObject = container.resolve (JsonObject);

        let resultObject = container.resolve (ResultObject);

        try {

            resultObject = await this.webserviceModule.get (paramsObject.get ('txt_host_dollar') + '/' + new Date ().getFullYear ().toString (), headersObject, queryObject, bodyObject, logTool.trace ());
            resultObject.set ('outgoing', resultObject.get (['outgoing', 'Dolares']));
            resultObject.rename ('Fecha', 'date');
            resultObject.rename ('Valor', 'value');

            queryObject.del ('apikey');
            queryObject.del ('formato');
            queryObject.set ('jsn_data', resultObject.get ('outgoing'));
            queryObject.set ('txt_schema', 'indicators');
            queryObject.set ('txt_function', 'set_dollar_values');

            await this.postgresModule.execute (queryObject, logTool.trace ());

        } catch (exception) {

            resultObject.setResult (ExceptionTool.INDICATORS_EXCEPTION (stackStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    private async reloadEuroIndicators (paramsObject: JsonObject, traceObject: JsonObject): Promise<ResultObject> {

        const stackStrings = await CommonsTool.getStackStrings ();

        const logTool = container.resolve (LogTool);
        logTool.initialize (stackStrings, traceObject);

        const headersObject = container.resolve (JsonObject);

        const queryObject = container.resolve (JsonObject);
        queryObject.del ('jsn_data');
        queryObject.set ('apikey', paramsObject.get ('txt_token'));
        queryObject.set ('formato', 'json');

        const bodyObject = container.resolve (JsonObject);

        let resultObject = container.resolve (ResultObject);

        try {

            resultObject = await this.webserviceModule.get (paramsObject.get ('txt_host_euro') + '/' + new Date ().getFullYear ().toString (), headersObject, queryObject, bodyObject, logTool.trace ());
            resultObject.set ('outgoing', resultObject.get (['outgoing', 'Euros']));
            resultObject.rename ('Fecha', 'date');
            resultObject.rename ('Valor', 'value');

            queryObject.del ('apikey');
            queryObject.del ('formato');
            queryObject.set ('jsn_data', resultObject.get ('outgoing'));
            queryObject.set ('txt_schema', 'indicators');
            queryObject.set ('txt_function', 'set_euro_values');

            await this.postgresModule.execute (queryObject, logTool.trace ());

        } catch (exception) {

            resultObject.setResult (ExceptionTool.INDICATORS_EXCEPTION (stackStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    private async reloadFomentUnitIndicators (paramsObject: JsonObject, traceObject: JsonObject): Promise<ResultObject> {

        const stackStrings = await CommonsTool.getStackStrings ();

        const logTool = container.resolve (LogTool);
        logTool.initialize (stackStrings, traceObject);

        let headersObject = container.resolve (JsonObject);

        let queryObject = container.resolve (JsonObject);
        queryObject.del ('jsn_data');
        queryObject.set ('apikey', paramsObject.get ('txt_token'));
        queryObject.set ('formato', 'json');

        const bodyObject = container.resolve (JsonObject);

        let resultObject = container.resolve (ResultObject);

        try {

            resultObject = await this.webserviceModule.get (paramsObject.get ('txt_host_foment_unit') + '/' + new Date ().getFullYear ().toString (), headersObject, queryObject, bodyObject, logTool.trace ());
            resultObject.set ('outgoing', resultObject.get (['outgoing', 'UFs']));
            resultObject.rename ('Fecha', 'date');
            resultObject.rename ('Valor', 'value');

            queryObject.del ('apikey');
            queryObject.del ('formato');
            queryObject.set ('jsn_data', resultObject.get ('outgoing'));
            queryObject.set ('txt_schema', 'indicators');
            queryObject.set ('txt_function', 'set_foment_unit_values');

            await this.postgresModule.execute (queryObject, logTool.trace ());

        } catch (exception) {

            resultObject.setResult (ExceptionTool.INDICATORS_EXCEPTION (stackStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    private async reloadMonthlyTaxUnitIndicators (paramsObject: JsonObject, traceObject: JsonObject): Promise<ResultObject> {

        const stackStrings = await CommonsTool.getStackStrings ();

        const logTool = container.resolve (LogTool);
        logTool.initialize (stackStrings, traceObject);

        let headersObject = container.resolve (JsonObject);

        let queryObject = container.resolve (JsonObject);
        queryObject.del ('jsn_data');
        queryObject.set ('apikey', paramsObject.get ('txt_token'));
        queryObject.set ('formato', 'json');

        const bodyObject = container.resolve (JsonObject);

        let resultObject = container.resolve (ResultObject);

        try {

            resultObject = await this.webserviceModule.get (paramsObject.get ('txt_host_monthly_tax_unit') + '/' + new Date ().getFullYear ().toString (), headersObject, queryObject, bodyObject, logTool.trace ());
            resultObject.set ('outgoing', resultObject.get (['outgoing', 'UTMs']));
            resultObject.rename ('Fecha', 'date');
            resultObject.rename ('Valor', 'value');

            queryObject.del ('apikey');
            queryObject.del ('formato');
            queryObject.set ('jsn_data', resultObject.get ('outgoing'));
            queryObject.set ('txt_schema', 'indicators');
            queryObject.set ('txt_function', 'set_monthly_tax_unit_values');

            await this.postgresModule.execute (queryObject, logTool.trace ());

        } catch (exception) {

            resultObject.setResult (ExceptionTool.INDICATORS_EXCEPTION (stackStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

}