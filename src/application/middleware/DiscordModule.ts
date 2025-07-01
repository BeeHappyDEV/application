import {singleton} from 'tsyringe';
import {inject} from "tsyringe";
import {LogTool} from "../toolkit/LogTool";
import {PropertiesTool} from "../toolkit/PropertiesTool";

@singleton ()
export class DiscordModule {

    constructor (
        @inject (LogTool) private logTool: LogTool,
        @inject (PropertiesTool) private propertiesTool: PropertiesTool
    ) {
    }

    public async initialize (): Promise<void> {

        console.log (this.logTool);
        console.log (this.propertiesTool);

    }

}
