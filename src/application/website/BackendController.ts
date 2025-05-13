import {container, inject, injectable} from 'tsyringe';

import express from 'express';

import {BackendService} from './BackendService';
import {PropertiesModule} from '../middleware/PropertiesModule';
import {CommonsTool} from '../toolkit/CommonsTool';
import {ExceptionTool} from '../toolkit/ExceptionTool';
import {LogTool} from '../toolkit/LogTool';
import {JsonObject} from '../object/JsonObject';

@injectable ()
export class BackendController {

    constructor (
        @inject (BackendService) private backendModule: BackendService,
        @inject (PropertiesModule) private propertiesModule: PropertiesModule
    ) {
        propertiesModule.initialize ().then ();
    }

    public async initialize (expressApplication: typeof express.application): Promise<void> {

        const paramsObject = container.resolve (JsonObject);

        expressApplication.post ('/backend/system/wakeup', (expressRequest: typeof express.request, expressResponse: typeof express.response): void => {

            paramsObject.set ('txt_function', 'backend_wakeup_application');

            this.postWakeupAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.post ('/backend/cache/delete', (expressRequest: typeof express.request, expressResponse: typeof express.response): void => {

            this.postDeleteCacheAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.post ('/backend/rebuild/documental', (expressRequest: typeof express.request, expressResponse: typeof express.response): void => {

            this.postRebuildDocumentalAction (expressRequest, expressResponse);

        });

        expressApplication.post ('/backend/rebuild/relational', (expressRequest: typeof express.request, expressResponse: typeof express.response): void => {

            paramsObject.set ('txt_file', 'index.txt');
            paramsObject.set ('txt_path', './src/database/');

            this.postRebuildRelationalAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.post ('/backend/reload/indicators', (expressRequest: typeof express.request, expressResponse: typeof express.response): void => {

            this.postReloadIndicatorsAction (expressRequest, expressResponse, paramsObject);

        });

    }

    private async postWakeupAction (expressRequest: typeof express.request, expressResponse: typeof express.response, paramsObject: JsonObject): Promise<void> {

        const stackStrings = await CommonsTool.getStackStrings ();

        const logTool = container.resolve (LogTool);
        logTool.initialize (stackStrings);
        logTool.contextualize (expressRequest);
        logTool.request (expressRequest);

        const resultObject = await this.backendModule.postWakeupAction (paramsObject, logTool.trace ());

        expressResponse.send (resultObject.all ());

        logTool.response (resultObject);
        logTool.finalize ();

    }

    private async postDeleteCacheAction (expressRequest: typeof express.request, expressResponse: typeof express.response, paramsObject: JsonObject): Promise<void> {

        const stackStrings = await CommonsTool.getStackStrings ();

        const logTool = container.resolve (LogTool);
        logTool.initialize (stackStrings);
        logTool.contextualize (expressRequest);
        logTool.request (expressRequest);

        paramsObject.set ('txt_host', await this.propertiesModule.get ('cloudflare.host'));
        paramsObject.set ('txt_token', await this.propertiesModule.get ('cloudflare.token'));

        const resultObject = await this.backendModule.postDeleteCacheAction (paramsObject, logTool.trace ());

        resultObject.setResult (ExceptionTool.SUCCESSFUL ());

        expressResponse.send (resultObject.all ());

        logTool.response (resultObject);
        logTool.finalize ();

    }

    private async postRebuildDocumentalAction (expressRequest: typeof express.request, expressResponse: typeof express.response): Promise<void> {

        const stackStrings = await CommonsTool.getStackStrings ();

        const logTool = container.resolve (LogTool);
        logTool.initialize (stackStrings);
        logTool.contextualize (expressRequest);
        logTool.request (expressRequest);

        const resultObject = await this.backendModule.postRebuildDocumentalAction (logTool.trace ());

        expressResponse.send (resultObject.all ());

        logTool.response (resultObject);
        logTool.finalize ();

    }

    private async postRebuildRelationalAction (expressRequest: typeof express.request, expressResponse: typeof express.response, paramsObject: JsonObject): Promise<void> {

        const stackStrings = await CommonsTool.getStackStrings ();

        const logTool = container.resolve (LogTool);
        logTool.initialize (stackStrings);
        logTool.contextualize (expressRequest);
        logTool.request (expressRequest);

        const resultObject = await this.backendModule.postRebuildRelationalAction (paramsObject, logTool.trace ());

        expressResponse.send (resultObject.all ());

        logTool.response (resultObject);
        logTool.finalize ();

    }

    private async postReloadIndicatorsAction (expressRequest: typeof express.request, expressResponse: typeof express.response, paramsObject: JsonObject): Promise<void> {

        const stackStrings = await CommonsTool.getStackStrings ();

        const logTool = container.resolve (LogTool);
        logTool.initialize (stackStrings);
        logTool.contextualize (expressRequest);
        logTool.request (expressRequest);

        paramsObject.set ('txt_host_dollar', await this.propertiesModule.get ('scheduler.indicators.host.dollar'));
        paramsObject.set ('txt_host_euro', await this.propertiesModule.get ('scheduler.indicators.host.euro'));
        paramsObject.set ('txt_host_foment_unit', await this.propertiesModule.get ('scheduler.indicators.host.foment_unit'));
        paramsObject.set ('txt_host_monthly_tax_unit', await this.propertiesModule.get ('scheduler.indicators.host.monthly_tax_unit'));
        paramsObject.set ('txt_token', await this.propertiesModule.get ('scheduler.indicators.token'));

        const resultObject = await this.backendModule.postReloadIndicatorsAction (paramsObject, logTool.trace ());

        expressResponse.send (resultObject.all ());

        logTool.response (resultObject);
        logTool.finalize ();

    }

}