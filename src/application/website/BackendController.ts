import {inject, injectable} from 'tsyringe';

import express from 'express';

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
        @inject (BackendService) private backendService: BackendService
    ) {
    }

    public async initialize (expressApplication: express.Application): Promise<void> {

        const paramsRecord: Record<string, any> = {};

        expressApplication.post ('/backend/system/wakeup', (expressRequest: express.Request, expressResponse: express.Response): void => {

            this.postWakeupAction (expressRequest, expressResponse, paramsRecord);

        });

        expressApplication.post ('/backend/cache/delete', (expressRequest: express.Request, expressResponse: express.Response): void => {

            this.postDeleteCacheAction (expressRequest, expressResponse, paramsRecord);

        });

        expressApplication.post ('/backend/rebuild/documental', (expressRequest: express.Request, expressResponse: express.Response): void => {

            this.postRebuildDocumentalAction (expressRequest, expressResponse, paramsRecord);

        });

        expressApplication.post ('/backend/rebuild/relational', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsRecord.txt_file = 'index.txt';
            paramsRecord.txt_path = './src/database/';

            this.postRebuildRelationalAction (expressRequest, expressResponse, paramsRecord);

        });

        expressApplication.post ('/backend/reload/indicators', (expressRequest: express.Request, expressResponse: express.Response): void => {

            this.postReloadIndicatorsAction (expressRequest, expressResponse, paramsRecord);

        });

        this.initializedBoolean = true;

    }

    public async isInitialized (): Promise<boolean> {

        return this.initializedBoolean;

    }

    private async postWakeupAction (expressRequest: express.Request, expressResponse: express.Response, paramsRecord: Record<string, any>): Promise<void> {

        const logTool = this.logToolFactory ();
        logTool.setRequest (expressRequest);

        if (expressRequest.body.transaction && expressRequest.body.depth) {

            const traceRecord: Record<string, any> = {};
            traceRecord.transaction = expressRequest.body.transaction;
            traceRecord.depth = Number (expressRequest.body.depth);

            logTool.setSoftTrace (traceRecord);

        }

        logTool.INITIALIZE ();

        let resultRecord: Record<string, any> = {};

        try {

            resultRecord = await this.backendService.postWakeupAction (logTool.getTrace (), paramsRecord);

            logTool.OK ();

        } catch (exception) {

            logTool.ERR (LogConstants.CONTROLLER);

        }

        expressResponse.send (resultRecord);

        logTool.FINALIZE ();

    }

    private async postDeleteCacheAction (expressRequest: express.Request, expressResponse: express.Response, paramsRecord: Record<string, any>): Promise<Record<string, any>> {

        const logTool = this.logToolFactory ();
        logTool.setRequest (expressRequest);
        logTool.INITIALIZE ();

        let resultRecord: Record<string, any> = {};

        try {

            paramsRecord.txt_host = await this.propertiesTool.get ('integration.cloudflare.host');
            paramsRecord.txt_token = await this.propertiesTool.get ('integration.cloudflare.token');

            resultRecord = await this.backendService.postDeleteCacheAction (logTool.getTrace (), paramsRecord);

            logTool.OK ();

        } catch (exception) {

            logTool.ERR (LogConstants.CONTROLLER);

        }

        expressResponse.send (resultRecord);

        logTool.FINALIZE ();

        return resultRecord;

    }

    private async postRebuildDocumentalAction (expressRequest: express.Request, expressResponse: express.Response, paramsRecord: Record<string, any>): Promise<void> {

        const logTool = this.logToolFactory ();
        logTool.setRequest (expressRequest);
        logTool.INITIALIZE ();

        let resultRecord: Record<string, any> = {};

        try {

            resultRecord = await this.backendService.postRebuildDocumentalAction (logTool.getTrace (), paramsRecord);

            logTool.OK ();

        } catch (exception) {

            logTool.ERR (LogConstants.CONTROLLER);

        }

        expressResponse.send (resultRecord);

        logTool.FINALIZE ();

    }

    private async postRebuildRelationalAction (expressRequest: express.Request, expressResponse: express.Response, paramsRecord: Record<string, any>): Promise<void> {

        const logTool = this.logToolFactory ();
        logTool.setRequest (expressRequest);
        logTool.INITIALIZE ();

        let resultRecord: Record<string, any> = {};

        try {

            resultRecord = await this.backendService.postRebuildRelationalAction (logTool.getTrace (), paramsRecord);

            logTool.OK ();

        } catch (exception) {

            logTool.ERR (LogConstants.CONTROLLER);

        }

        expressResponse.send (resultRecord);

        logTool.FINALIZE ();

    }

    private async postReloadIndicatorsAction (expressRequest: express.Request, expressResponse: express.Response, paramsRecord: Record<string, any>): Promise<void> {

        const logTool = this.logToolFactory ();
        logTool.setRequest (expressRequest);

        if (expressRequest.body.transaction && expressRequest.body.depth) {

            const traceRecord: Record<string, any> = {};
            traceRecord.transaction = expressRequest.body.transaction;
            traceRecord.depth = Number (expressRequest.body.depth);

            logTool.setSoftTrace (traceRecord);

        }

        logTool.INITIALIZE ();

        paramsRecord.txt_host_dollar = await this.propertiesTool.get ('scheduler.indicators.host.dollar');
        paramsRecord.txt_host_euro = await this.propertiesTool.get ('scheduler.indicators.host.euro');
        paramsRecord.txt_host_foment_unit = await this.propertiesTool.get ('scheduler.indicators.host.foment_unit');
        paramsRecord.txt_host_monthly_tax_unit = await this.propertiesTool.get ('scheduler.indicators.host.monthly_tax_unit');
        paramsRecord.txt_token = await this.propertiesTool.get ('scheduler.indicators.token');

        let resultRecord: Record<string, any> = {};

        try {

            resultRecord = await this.backendService.postReloadIndicatorsAction (logTool.getTrace (), paramsRecord);

            logTool.OK ();

        } catch (exception) {

            logTool.ERR (LogConstants.CONTROLLER);

        }

        expressResponse.send (resultRecord);

        logTool.FINALIZE ();

    }

}