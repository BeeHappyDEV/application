import {inject, injectable} from 'tsyringe';

import express from 'express';

import {MessengerService} from './MessengerService';

//import {LogTool} from '../toolkit/LogTool';
import {PropertiesTool} from '../toolkit/PropertiesTool';

@injectable ()
export class MessengerController {

    private initializedBoolean = false;

    constructor (
        //@inject ('LogToolFactory') private logToolFactory: () => LogTool,
        @inject (MessengerService) private messengerService: MessengerService,
        @inject (PropertiesTool) private propertiesTool: PropertiesTool
    ) {
    }

    // @ts-ignore
    public async initialize (expressApplication: express.Application): Promise<void> {

        const originalConsole = {...console};
        console.log = () => {};
        console.log (this.messengerService);
        console.log (this.propertiesTool);
        console.log = originalConsole.log;

        this.initializedBoolean = true;

    }

    public async isInitialized (): Promise<boolean> {

        return this.initializedBoolean;

    }

}