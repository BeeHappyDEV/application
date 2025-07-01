import {inject, injectable} from 'tsyringe';

import express from 'express';

import {TelegramService} from './TelegramService';
import {PropertiesTool} from '../toolkit/PropertiesTool';
import {LogTool} from "../toolkit/LogTool";

@injectable ()
export class TelegramController {

    // @ts-ignore
    constructor (
        @inject (TelegramService) private telegramService: TelegramService,
        @inject (LogTool) private logTool: LogTool,
        @inject (PropertiesTool) private propertiesTool: PropertiesTool
    ) {
    }

    // @ts-ignore
    public async initialize (expressApplication: express.Application): Promise<void> {

        const originalConsole = {...console};
        console.log = () => {};
        console.log (this.telegramService);
        console.log (this.logTool);
        console.log (this.propertiesTool);
        console.log = originalConsole.log;

    }

}