import {inject, injectable} from 'tsyringe';

import express from 'express';

import {BackendService} from 'src/application/website/BackendService';

import {CommonsTool} from 'src/application/toolkit/CommonsTool';
import {ExceptionTool} from 'src/application/toolkit/ExceptionTool';
import {LogTool} from 'src/application/toolkit/LogTool';
import {PropertiesTool} from 'src/application/toolkit/PropertiesTool';

import {JsonObject} from 'src/application/object/JsonObject';

@injectable ()
export class BackendController {

    constructor (
        @inject (BackendService) private backendService: BackendService,
        @inject (LogTool) private logTool: LogTool,
        @inject (PropertiesTool) private propertiesTool: PropertiesTool
    ) {
    }

    public async initialize (expressApplication: express.Application): Promise<void> {

        const paramsObject = new JsonObject ();

        expressApplication.post ('/backend/system/wakeup', (expressRequest: express.Request, expressResponse: express.Response): void => {

            this.postWakeupAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.post ('/backend/cache/delete', (expressRequest: express.Request, expressResponse: express.Response): void => {

            this.postDeleteCacheAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.post ('/backend/rebuild/documental', (expressRequest: express.Request, expressResponse: express.Response): void => {

            this.postRebuildDocumentalAction (expressRequest, expressResponse);

        });

        expressApplication.post ('/backend/rebuild/relational', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsObject.set ('txt_file', 'index.txt');
            paramsObject.set ('txt_path', './src/database/');

            this.postRebuildRelationalAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.post ('/backend/reload/indicators', (expressRequest: express.Request, expressResponse: express.Response): void => {

            this.postReloadIndicatorsAction (expressRequest, expressResponse, paramsObject);

        });

    }

    private async postWakeupAction (expressRequest: express.Request, expressResponse: express.Response, paramsObject: JsonObject): Promise<void> {

        const stackStringArray = CommonsTool.getStackStringArray ();

        this.logTool.initialize (stackStringArray);
        this.logTool.contextualize (expressRequest);
        this.logTool.request (expressRequest);

        const resultObject = await this.backendService.postWakeupAction (paramsObject, this.logTool.trace ());

        expressResponse.send (resultObject.all ());

        this.logTool.response (resultObject);
        this.logTool.finalize ();

    }

    private async postDeleteCacheAction (expressRequest: express.Request, expressResponse: express.Response, paramsObject: JsonObject): Promise<void> {

        const stackStringArray = CommonsTool.getStackStringArray ();

        this.logTool.initialize (stackStringArray);
        this.logTool.contextualize (expressRequest);
        this.logTool.request (expressRequest);

        paramsObject.set ('txt_host', await this.propertiesTool.get ('cloudflare.host'));
        paramsObject.set ('txt_token', await this.propertiesTool.get ('cloudflare.token'));

        const resultObject = await this.backendService.postDeleteCacheAction (paramsObject, this.logTool.trace ());
        resultObject.setResult (ExceptionTool.SUCCESSFUL ());

        expressResponse.send (resultObject.all ());

        this.logTool.response (resultObject);
        this.logTool.finalize ();

    }

    private async postRebuildDocumentalAction (expressRequest: express.Request, expressResponse: express.Response): Promise<void> {

        const stackStringArray = CommonsTool.getStackStringArray ();

        this.logTool.initialize (stackStringArray);
        this.logTool.contextualize (expressRequest);
        this.logTool.request (expressRequest);

        const resultObject = await this.backendService.postRebuildDocumentalAction (this.logTool.trace ());

        expressResponse.send (resultObject.all ());

        this.logTool.response (resultObject);
        this.logTool.finalize ();

    }

    private async postRebuildRelationalAction (expressRequest: express.Request, expressResponse: express.Response, paramsObject: JsonObject): Promise<void> {

        const stackStringArray = CommonsTool.getStackStringArray ();

        this.logTool.initialize (stackStringArray);
        this.logTool.contextualize (expressRequest);
        this.logTool.request (expressRequest);

        const resultObject = await this.backendService.postRebuildRelationalAction (paramsObject, this.logTool.trace ());

        expressResponse.send (resultObject.all ());

        this.logTool.response (resultObject);
        this.logTool.finalize ();

    }

    private async postReloadIndicatorsAction (expressRequest: express.Request, expressResponse: express.Response, paramsObject: JsonObject): Promise<void> {

        const stackStringArray = CommonsTool.getStackStringArray ();

        this.logTool.initialize (stackStringArray);
        this.logTool.contextualize (expressRequest);
        this.logTool.request (expressRequest);

        paramsObject.set ('txt_host_dollar', await this.propertiesTool.get ('scheduler.indicators.host.dollar'));
        paramsObject.set ('txt_host_euro', await this.propertiesTool.get ('scheduler.indicators.host.euro'));
        paramsObject.set ('txt_host_foment_unit', await this.propertiesTool.get ('scheduler.indicators.host.foment_unit'));
        paramsObject.set ('txt_host_monthly_tax_unit', await this.propertiesTool.get ('scheduler.indicators.host.monthly_tax_unit'));
        paramsObject.set ('txt_token', await this.propertiesTool.get ('scheduler.indicators.token'));

        const resultObject = await this.backendService.postReloadIndicatorsAction (paramsObject, this.logTool.trace ());

        expressResponse.send (resultObject.all ());

        this.logTool.response (resultObject);
        this.logTool.finalize ();

    }

}