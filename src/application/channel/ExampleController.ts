import {inject, injectable} from 'tsyringe';

import {LogTool} from '../toolkit/LogTool';

@injectable ()
export class ExampleController {

    constructor (
        @inject ('LogToolFactory') private logToolFactory: () => LogTool
    ) {
    }

    public async exampleMethod1 (): Promise<string> {

        const logTool = this.logToolFactory ();

        const exampleString = '123457890';

        logTool.OK (exampleString);

        return exampleString

    }

    public async exampleMethod2 (): Promise<string> {

        const logTool = this.logToolFactory ();

        const exampleString = '0987654321';

        logTool.OK (exampleString);

        return exampleString

    }

}