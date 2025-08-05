import {inject, injectable} from 'tsyringe';

import express from 'express';
import expressWs from 'express-ws';

import {WhatsAppService} from './WhatsAppService';

//import {LogTool} from '../toolkit/LogTool';
import {PropertiesTool} from '../toolkit/PropertiesTool';

@injectable ()
export class WhatsAppController {

    private initializedBoolean = false;

    constructor (
        //@inject ('LogToolFactory') private logToolFactory: () => LogTool,
        @inject (WhatsAppService) private whatsAppService: WhatsAppService,
        @inject (PropertiesTool) private propertiesTool: PropertiesTool
    ) {
    }

    // @ts-ignore
    public async initialize (expressApplication: express.Application, expressWsInstance: expressWs.Instance): Promise<void> {

        const originalConsole = {...console};
        console.log = () => {
        };
        console.log (this.whatsAppService);
        console.log (this.propertiesTool);
        console.log = originalConsole.log;

        this.initializedBoolean = true;

    }

    public async isInitialized (): Promise<boolean> {

        return this.initializedBoolean;

    }

}