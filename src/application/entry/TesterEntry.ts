import 'reflect-metadata';

import {container, inject, injectable} from 'tsyringe';

import {CommonsTool} from '../toolkit/CommonsTool';
import {LogTool} from '../toolkit/LogTool';
import {RegistryTool} from '../toolkit/RegistryTool';

@injectable ()
export class TesterEntry {

    constructor (
        @inject (LogTool) private logTool: LogTool
    ) {
    }

    public async initialize (): Promise<void> {

        const stackStringArray = CommonsTool.getStackStringArray ();

        this.logTool.initialize (stackStringArray);

        this.logTool.finalize ();

    }

}

async function testerEntry () {

    await RegistryTool.initialize ().then ();

    const testerEntry = container.resolve (TesterEntry);
    testerEntry.initialize ().then ();

}

testerEntry ().then ();