import {injectable} from 'tsyringe';
import {inject} from "tsyringe";
import {LogTool} from "../toolkit/LogTool";
import {PropertiesTool} from "../toolkit/PropertiesTool";
import {CommonsTool} from "../toolkit/CommonsTool";

@injectable ()
export class MessengerService {

    constructor (
        @inject (LogTool) private logTool: LogTool,
        @inject (PropertiesTool) private propertiesTool: PropertiesTool
    ) {
    }

    public async anyMethod (): Promise<void> {

        const stackStringArray = CommonsTool.getStackStringArray ();

        this.logTool.initialize (stackStringArray);
        this.logTool.comment ('MessengerController:', 'anyMethod');

        await this.propertiesTool.get ('');

        this.logTool.finalize ();

    }

}