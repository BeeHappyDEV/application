import {inject, injectable} from 'tsyringe';

import express from 'express';

//import {LogTool} from '../toolkit/LogTool';
import {PropertiesTool} from '../toolkit/PropertiesTool';

import {MessengerService} from './MessengerService';

@injectable ()
export class MessengerController {

    private initializedBoolean = false;

    constructor (
        //@inject ('LogToolFactory') private logToolFactory: () => LogTool,
        @inject (PropertiesTool) private propertiesTool: PropertiesTool,
        @inject (MessengerService) private messengerService: MessengerService
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