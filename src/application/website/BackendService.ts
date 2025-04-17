import {inject, injectable} from 'tsyringe';

import fsExtra from 'fs-extra';

import {MongoDbModule} from '@middleware/MongoDbModule';
import {PostgresModule} from '@middleware/PostgresModule';
import {WebserviceModule} from '@middleware/WebserviceModule';
import {ExceptionTool} from '@toolkit/ExceptionTool';
import {LogTool} from '@toolkit/LogTool';
import {PropertiesTool} from '@toolkit/PropertiesTool';
import {ReflectionTool} from '@toolkit/ReflectionTool';
import {JsonObject} from '@object/JsonObject';
import {ResultObject} from '@object/ResultObject';

@injectable ()
export class BackendService {

    constructor (
        @inject (PostgresModule) public readonly postgresModule: PostgresModule,
        @inject (MongoDbModule) public readonly mongoDbModule: MongoDbModule,
        @inject (PropertiesTool) public readonly propertiesTool: PropertiesTool,
        @inject (ReflectionTool) private readonly reflectionTool: ReflectionTool,
        @inject (WebserviceModule) public readonly webserviceModule: WebserviceModule
    ) {
    }

    public async postWakeupApplication (paramsObject: JsonObject, traceObject: JsonObject): Promise<ResultObject> {

        const reflectionStrings = await this.reflectionTool.getStackStrings ();

        const logTool = new LogTool ();
        logTool.initialize (traceObject, reflectionStrings);

        paramsObject.set ('txt_function', 'backend_wakeup_application');

        let resultObject = new ResultObject ();

        try {

            resultObject = await this.postgresModule.execute (paramsObject, logTool.trace ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    public async postCacheDelete (traceObject: JsonObject): Promise<ResultObject> {

        const reflectionStrings = await this.reflectionTool.getStackStrings ();

        const logTool = new LogTool ();
        logTool.initialize (traceObject, reflectionStrings);

        const headersObject = new JsonObject ();
        headersObject.set ('authorization', 'Bearer ' + await this.propertiesTool.get ('cloudflare.token'));
        headersObject.set ('content-type', 'application/json');

        const bodyObject = new JsonObject ();
        bodyObject.set ('purge_everything', true);

        const resultObject = new ResultObject ();

        try {

            await this.webserviceModule.delete (await this.propertiesTool.get ('cloudflare.host'), headersObject, null, bodyObject, logTool.trace ());

            resultObject.result (ExceptionTool.SUCCESSFUL ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    public async postRebuildDocumental (traceObject: JsonObject): Promise<ResultObject> {

        const reflectionStrings = await this.reflectionTool.getStackStrings ();

        const logTool = new LogTool ();
        logTool.initialize (traceObject, reflectionStrings);

        const resultObject = new ResultObject ();

        try {

            await this.mongoDbModule.rebuild (logTool.trace ());

            resultObject.result (ExceptionTool.SUCCESSFUL ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    public async postRebuildRelational (traceObject: JsonObject): Promise<ResultObject> {

        const reflectionStrings = await this.reflectionTool.getStackStrings ();

        const logTool = new LogTool ();
        logTool.initialize (traceObject, reflectionStrings);

        const resultObject = new ResultObject ();

        try {

            await this.rebuildReadMainFile (logTool.trace ());

            resultObject.result (ExceptionTool.SUCCESSFUL ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    public async postReloadIndicators (traceObject: JsonObject): Promise<ResultObject> {

        const reflectionStrings = await this.reflectionTool.getStackStrings ();

        const logTool = new LogTool ();
        logTool.initialize (traceObject, reflectionStrings);

        let resultObject = new ResultObject ();

        try {

            await this.reloadDollarIndicators (logTool.trace ());
            await this.reloadEuroIndicators (logTool.trace ());
            await this.reloadFomentUnitIndicators (logTool.trace ());
            await this.reloadMonthlyTaxUnitIndicators (logTool.trace ());

            resultObject.result (ExceptionTool.SUCCESSFUL ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    private async rebuildReadMainFile (traceObject: JsonObject): Promise<void> {

        const reflectionStrings = await this.reflectionTool.getStackStrings ();

        const logTool = new LogTool ();
        logTool.initialize (traceObject, reflectionStrings);

        const paramsObject = new JsonObject ();
        paramsObject.set ('txt_file', 'index.txt');
        paramsObject.set ('txt_path', './src/database/');

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

        const reflectionStrings = await this.reflectionTool.getStackStrings ();

        const logTool = new LogTool ();
        logTool.initialize (traceObject, reflectionStrings);

        paramsObject.set ('txt_folder', paramsObject.get ('txt_folder').split ('/') [0] + '/');

        let contentBuffer = fsExtra.readFileSync (paramsObject.get ('txt_path') + paramsObject.get ('txt_folder') + paramsObject.get ('txt_file'));
        let contentString = contentBuffer.toString ();
        let linesString = contentString.split (/\r?\n/);

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

        const reflectionStrings = await this.reflectionTool.getStackStrings ();

        const logTool = new LogTool ();
        logTool.initialize (traceObject, reflectionStrings);

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

    private async reloadDollarIndicators (traceObject: JsonObject): Promise<ResultObject> {

        const reflectionStrings = await this.reflectionTool.getStackStrings ();

        const logTool = new LogTool ();
        logTool.initialize (traceObject, reflectionStrings);

        const headersObject = null;

        const queryObject = new JsonObject ();
        queryObject.del ('jsn_data');
        queryObject.set ('apikey', await this.propertiesTool.get ('scheduler.indicators.token'));
        queryObject.set ('formato', 'json');

        let resultObject = new ResultObject ();

        try {

            resultObject = await this.webserviceModule.get (await this.propertiesTool.get ('scheduler.indicators.host.dollar') + '/' + new Date ().getFullYear ().toString (), headersObject, queryObject, null, logTool.trace ());
            resultObject.set ('outgoing', resultObject.get (['outgoing', 'Dolares']));
            resultObject.rename ('Fecha', 'date');
            resultObject.rename ('Valor', 'value');

            queryObject.del ('apikey');
            queryObject.del ('formato');
            queryObject.set ('jsn_data', resultObject.get ('outgoing'));
            queryObject.set ('txt_function', 'backend_update_dollar_values');

            await this.postgresModule.execute (queryObject, logTool.trace ());

        } catch (exception) {

            resultObject.result (ExceptionTool.INDICATORS_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    private async reloadEuroIndicators (traceObject: JsonObject): Promise<ResultObject> {

        const reflectionStrings = await this.reflectionTool.getStackStrings ();

        let logTool = new LogTool ();
        logTool.initialize (traceObject, reflectionStrings);

        let headersObject = null;

        let queryObject = new JsonObject ();
        queryObject.del ('jsn_data');
        queryObject.set ('apikey', await this.propertiesTool.get ('scheduler.indicators.token'));
        queryObject.set ('formato', 'json');

        let resultObject = new ResultObject ();

        try {

            resultObject = await this.webserviceModule.get (await this.propertiesTool.get ('scheduler.indicators.host.euro') + '/' + new Date ().getFullYear ().toString (), headersObject, queryObject, null, logTool.trace ());
            resultObject.set ('outgoing', resultObject.get (['outgoing', 'Euros']));
            resultObject.rename ('Fecha', 'date');
            resultObject.rename ('Valor', 'value');

            queryObject.del ('apikey');
            queryObject.del ('formato');
            queryObject.set ('jsn_data', resultObject.get ('outgoing'));
            queryObject.set ('txt_function', 'backend_update_euro_values');

            await this.postgresModule.execute (queryObject, logTool.trace ());

        } catch (exception) {

            resultObject.result (ExceptionTool.INDICATORS_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    private async reloadFomentUnitIndicators (traceObject: JsonObject): Promise<ResultObject> {

        const reflectionStrings = await this.reflectionTool.getStackStrings ();

        let logTool = new LogTool ();
        logTool.initialize (traceObject, reflectionStrings);

        let headersObject = null;

        let queryObject = new JsonObject ();
        queryObject.del ('jsn_data');
        queryObject.set ('apikey', await this.propertiesTool.get ('scheduler.indicators.token'));
        queryObject.set ('formato', 'json');

        let resultObject = new ResultObject ();

        try {

            resultObject = await this.webserviceModule.get (await this.propertiesTool.get ('scheduler.indicators.host.foment_unit') + '/' + new Date ().getFullYear ().toString (), headersObject, queryObject, null, logTool.trace ());
            resultObject.set ('outgoing', resultObject.get (['outgoing', 'UFs']));
            resultObject.rename ('Fecha', 'date');
            resultObject.rename ('Valor', 'value');

            queryObject.del ('apikey');
            queryObject.del ('formato');
            queryObject.set ('jsn_data', resultObject.get ('outgoing'));
            queryObject.set ('txt_function', 'backend_update_foment_unit_values');

            await this.postgresModule.execute (queryObject, logTool.trace ());

        } catch (exception) {

            resultObject.result (ExceptionTool.INDICATORS_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    private async reloadMonthlyTaxUnitIndicators (traceObject: JsonObject): Promise<ResultObject> {

        const reflectionStrings = await this.reflectionTool.getStackStrings ();

        let logTool = new LogTool ();
        logTool.initialize (traceObject, reflectionStrings);

        let headersObject = null;

        let queryObject = new JsonObject ();
        queryObject.del ('jsn_data');
        queryObject.set ('apikey', await this.propertiesTool.get ('scheduler.indicators.token'));
        queryObject.set ('formato', 'json');

        let resultObject = new ResultObject ();

        try {

            resultObject = await this.webserviceModule.get (await this.propertiesTool.get ('scheduler.indicators.host.monthly_tax_unit') + '/' + new Date ().getFullYear ().toString (), headersObject, queryObject, null, logTool.trace ());
            resultObject.set ('outgoing', resultObject.get (['outgoing', 'UTMs']));
            resultObject.rename ('Fecha', 'date');
            resultObject.rename ('Valor', 'value');

            queryObject.del ('apikey');
            queryObject.del ('formato');
            queryObject.set ('jsn_data', resultObject.get ('outgoing'));
            queryObject.set ('txt_function', 'backend_update_monthly_tax_unit_values');

            await this.postgresModule.execute (queryObject, logTool.trace ());

        } catch (exception) {

            resultObject.result (ExceptionTool.INDICATORS_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

}