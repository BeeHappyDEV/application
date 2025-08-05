import {inject, injectable} from 'tsyringe';

import {LogTool} from '../toolkit/LogTool';
import {PropertiesTool} from '../toolkit/PropertiesTool';

@injectable ()
export class WhatsAppService {

    constructor (
        @inject ('LogToolFactory') private logToolFactory: () => LogTool,
        @inject (PropertiesTool) private propertiesTool: PropertiesTool
    ) {
    }

    // @ts-ignore
    public async anyMethod (): Promise<void> {

        const logTool = this.logToolFactory ();
        logTool.OK ();

        const originalConsole = {...console};
        console.log = () => {};
        console.log (this.propertiesTool);
        console.log = originalConsole.log;

    }

}