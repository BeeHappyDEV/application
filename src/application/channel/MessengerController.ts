import {inject, injectable} from 'tsyringe';

import express from 'express';

import {MessengerService} from './MessengerService';
import {PropertiesTool} from '../toolkit/PropertiesTool';
import {LogTool} from "../toolkit/LogTool";

@injectable ()
export class MessengerController {

    // @ts-ignore
    constructor (
        @inject (MessengerService) private messengerService: MessengerService,
        @inject (LogTool) private logTool: LogTool,
        @inject (PropertiesTool) private propertiesTool: PropertiesTool
    ) {
    }

    // @ts-ignore
    public async initialize (expressApplication: express.Application): Promise<void> {

        const originalConsole = {...console};
        console.log = () => {};
        console.log (this.messengerService);
        console.log (this.logTool);
        console.log (this.propertiesTool);
        console.log = originalConsole.log;

    }

}