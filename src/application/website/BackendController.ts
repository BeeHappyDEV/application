import {inject, injectable} from 'tsyringe';

import express from 'express';

import {WorkflowController} from '../workflow/WorkflowController';

import {BackendService} from './BackendService';

import {LogConstants} from '../constants/LogConstants';

import {LogTool} from '../toolkit/LogTool';
import {PropertiesTool} from '../toolkit/PropertiesTool';

@injectable ()
export class BackendController {

    private initializedBoolean = false;

    constructor (
        @inject ('LogToolFactory') private logToolFactory: () => LogTool,
        @inject (PropertiesTool) private propertiesTool: PropertiesTool,
        @inject (WorkflowController) private workflowController: WorkflowController,
        @inject (BackendService) private backendService: BackendService
    ) {
    }

    public async initialize (expressApplication: express.Application): Promise<void> {

        const paramsObject: Record<string, any> = {};

        expressApplication.post ('/backend/system/wakeup', (expressRequest: express.Request, expressResponse: express.Response): void => {

            this.postWakeupAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.post ('/backend/cache/delete', (expressRequest: express.Request, expressResponse: express.Response): void => {

            this.postDeleteCacheAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.post ('/backend/rebuild/documental', (expressRequest: express.Request, expressResponse: express.Response): void => {

            this.postRebuildDocumentalAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.post ('/backend/rebuild/relational', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsObject.txt_file = 'index.txt';
            paramsObject.txt_path = './src/database/';

            this.postRebuildRelationalAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.post ('/backend/reload/indicators', (expressRequest: express.Request, expressResponse: express.Response): void => {

            this.postReloadIndicatorsAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.post ('/test', async (expressRequest: express.Request, expressResponse: express.Response): Promise<void> => {

            const incomingString = expressRequest.query.incoming;

            if (typeof incomingString === "string") {

                const resultString = await this.workflowController.executeWorkflow (incomingString);

                expressResponse.send (resultString);

            } else {

                expressResponse.send ('Error');

            }

        });

        this.initializedBoolean = true;

    }

    public async isInitialized (): Promise<boolean> {

        return this.initializedBoolean;

    }

    private async postWakeupAction (expressRequest: express.Request, expressResponse: express.Response, paramsObject: Record<string, any>): Promise<void> {

        const logTool = this.logToolFactory ();
        logTool.setRequest (expressRequest);

        if (expressRequest.body.transaction && expressRequest.body.depth) {

            const traceObject: Record<string, any> = {};
            traceObject.transaction = expressRequest.body.transaction;
            traceObject.depth = Number (expressRequest.body.depth);

            logTool.setSoftTrace (traceObject);

        }

        logTool.INITIALIZE ();

        let resultObject: Record<string, any> = {};

        try {

            resultObject = await this.backendService.postWakeupAction (logTool.getTrace (), paramsObject);

            logTool.OK ();

        } catch (exception) {

            logTool.ERR (LogConstants.CONTROLLER);

        }

        expressResponse.send (resultObject);

        logTool.FINALIZE ();

    }

    private async postDeleteCacheAction (expressRequest: express.Request, expressResponse: express.Response, paramsObject: Record<string, any>): Promise<Record<string, any>> {

        const logTool = this.logToolFactory ();
        logTool.setRequest (expressRequest);
        logTool.INITIALIZE ();

        let resultObject: Record<string, any> = {};

        try {

            paramsObject.txt_host = await this.propertiesTool.get ('integration.cloudflare.host');
            paramsObject.txt_token = await this.propertiesTool.get ('integration.cloudflare.token');

            resultObject = await this.backendService.postDeleteCacheAction (logTool.getTrace (), paramsObject);

            logTool.OK ();

        } catch (exception) {

            logTool.ERR (LogConstants.CONTROLLER);

        }

        expressResponse.send (resultObject);

        logTool.FINALIZE ();

        return resultObject;

    }

    private async postRebuildDocumentalAction (expressRequest: express.Request, expressResponse: express.Response, paramsObject: Record<string, any>): Promise<void> {

        const logTool = this.logToolFactory ();
        logTool.setRequest (expressRequest);
        logTool.INITIALIZE ();

        let resultObject: Record<string, any> = {};

        try {

            resultObject = await this.backendService.postRebuildDocumentalAction (logTool.getTrace (), paramsObject);

            logTool.OK ();

        } catch (exception) {

            logTool.ERR (LogConstants.CONTROLLER);

        }

        expressResponse.send (resultObject);

        logTool.FINALIZE ();

    }

    private async postRebuildRelationalAction (expressRequest: express.Request, expressResponse: express.Response, paramsObject: Record<string, any>): Promise<void> {

        const logTool = this.logToolFactory ();
        logTool.setRequest (expressRequest);
        logTool.INITIALIZE ();

        let resultObject: Record<string, any> = {};

        try {

            resultObject = await this.backendService.postRebuildRelationalAction (logTool.getTrace (), paramsObject);

            logTool.OK ();

        } catch (exception) {

            logTool.ERR (LogConstants.CONTROLLER);

        }

        expressResponse.send (resultObject);

        logTool.FINALIZE ();

    }

    private async postReloadIndicatorsAction (expressRequest: express.Request, expressResponse: express.Response, paramsObject: Record<string, any>): Promise<void> {

        const logTool = this.logToolFactory ();
        logTool.setRequest (expressRequest);

        if (expressRequest.body.transaction && expressRequest.body.depth) {

            const traceObject: Record<string, any> = {};
            traceObject.transaction = expressRequest.body.transaction;
            traceObject.depth = Number (expressRequest.body.depth);

            logTool.setSoftTrace (traceObject);

        }

        logTool.INITIALIZE ();

        paramsObject.txt_host_dollar = await this.propertiesTool.get ('scheduler.indicators.host.dollar');
        paramsObject.txt_host_euro = await this.propertiesTool.get ('scheduler.indicators.host.euro');
        paramsObject.txt_host_foment_unit = await this.propertiesTool.get ('scheduler.indicators.host.foment_unit');
        paramsObject.txt_host_monthly_tax_unit = await this.propertiesTool.get ('scheduler.indicators.host.monthly_tax_unit');
        paramsObject.txt_token = await this.propertiesTool.get ('scheduler.indicators.token');

        let resultObject: Record<string, any> = {};

        try {

            resultObject = await this.backendService.postReloadIndicatorsAction (logTool.getTrace (), paramsObject);

            logTool.OK ();

        } catch (exception) {

            logTool.ERR (LogConstants.CONTROLLER);

        }

        expressResponse.send (resultObject);

        logTool.FINALIZE ();

    }

}