import {inject, injectable} from 'tsyringe';

import express from 'express';

import {TelegramService} from './TelegramService';

//import {LogTool} from '../toolkit/LogTool';
import {PropertiesTool} from '../toolkit/PropertiesTool';

@injectable ()
export class TelegramController {

    private initializedBoolean = false;

    constructor (
        //@inject ('LogToolFactory') private logToolFactory: () => LogTool,
        @inject (TelegramService) private telegramService: TelegramService,
        @inject (PropertiesTool) private propertiesTool: PropertiesTool
    ) {
    }

    // @ts-ignore
    public async initialize (expressApplication: express.Application): Promise<void> {

        const originalConsole = {...console};
        console.log = () => {
        };
        console.log (this.telegramService);
        console.log (this.propertiesTool);
        console.log = originalConsole.log;

        this.initializedBoolean = true;

    }

    public async isInitialized (): Promise<boolean> {

        return this.initializedBoolean;

    }

}