import {inject, injectable} from 'tsyringe';

import {NaturalModule} from '../middleware/NaturalModule';

import {LogTool} from '../toolkit/LogTool';

@injectable ()
export class WorkflowController {

    constructor (
        @inject ('LogToolFactory') private logToolFactory: () => LogTool,
        @inject (NaturalModule) private naturalModule: NaturalModule
    ) {
    }

    public async executeWorkflow (incomingString: string): Promise<String> {

        const logTool = this.logToolFactory ();
        logTool.INITIALIZE ();

        const intentObject = await this.naturalModule.getResponse (incomingString);

        console.log(intentObject.preprocessed);
        console.log(intentObject.intent);

        for (const actionString of intentObject.actions) {

            console.log (actionString);

            await this.executeAction ();

        }

        const responseString = await this.prepareResponse (intentObject);

        logTool.FINALIZE ();

        console.log();

        return responseString;

    }

    private async executeAction () {

    }

    private async prepareResponse (intentObject: Record<string, any>): Promise<string> {

        return intentObject.response;

    }

}