import {inject, injectable} from 'tsyringe';

import express from 'express';

import {GatewayController} from '../channel/GatewayController';

import {LogTool} from '../toolkit/LogTool';

@injectable ()
export class TestingController {

    private initializedBoolean = false;

    constructor (
        @inject ('LogToolFactory') private logToolFactory: () => LogTool,
        @inject (GatewayController) private gatewayController: GatewayController
    ) {
    }

    public async initialize (expressApplication: express.Application): Promise<void> {

        const paramsRecord: Record<string, any> = {};

        expressApplication.get ('/test/:param', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsRecord.txt_message = expressRequest.params ['param'];

            this.getTestAction (expressRequest, expressResponse, paramsRecord);

        });

        this.initializedBoolean = true;

    }

    public async isInitialized (): Promise<boolean> {

        return this.initializedBoolean;

    }

    private async getTestAction (expressRequest: express.Request, expressResponse: express.Response, paramsRecord: Record<string, any>): Promise<void> {

        const logTool = this.logToolFactory ();
        logTool.setRequest (expressRequest);
        logTool.INITIALIZE ();

        paramsRecord.boo_testing = true;

        const requestRecord: Record<string, any> = {};

        requestRecord.txt_number = '56912345678';
        requestRecord.txt_incoming = paramsRecord.txt_message;

        const responseRecord = await this.gatewayController.processMessage (logTool.getTrace (), requestRecord);

        expressResponse.send (responseRecord);

        logTool.FINALIZE ();

    }

}