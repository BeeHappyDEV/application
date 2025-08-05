import {inject, injectable} from 'tsyringe';

import express from 'express';

import {LogTool} from '../toolkit/LogTool';
import {PropertiesTool} from '../toolkit/PropertiesTool';

@injectable ()
export class DiscordModule {

    constructor (
        @inject ('LogToolFactory') private logToolFactory: () => LogTool,
        @inject (PropertiesTool) private propertiesTool: PropertiesTool
    ) {
    }

    // @ts-ignore
    public async initialize (expressApplication: express.Application): Promise<void> {

        const logTool = this.logToolFactory ();
        logTool.OK ();

        const originalConsole = {...console};
        console.log = () => {
        };
        console.log (this.propertiesTool);
        console.log = originalConsole.log;

    }

}