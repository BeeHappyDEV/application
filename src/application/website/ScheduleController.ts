import {inject, injectable} from 'tsyringe';

import nodeCron from 'node-cron';

import {JsonObject} from "@object/JsonObject";
import {LogTool} from '@toolkit/LogTool';
import {PropertiesTool} from '@toolkit/PropertiesTool'
import {ReflectionTool} from '@toolkit/ReflectionTool';
import {ScheduleService} from '@website/ScheduleService';

@injectable ()
export class ScheduleController {

    constructor (
        @inject (PropertiesTool) public readonly propertiesTool: PropertiesTool,
        @inject (ReflectionTool) private readonly reflectionTool: ReflectionTool,
        @inject (ScheduleService) private readonly scheduleService: ScheduleService
    ) {
    }

    public async initialize () {

        const paramsObject = new JsonObject ();

        if (await this.propertiesTool.get ('scheduler.wakeup.enable') === true) {
            nodeCron.schedule (await this.propertiesTool.get ('scheduler.wakeup.cron'), (): void => {
                paramsObject.set ('txt_action', 'wakeup');
                paramsObject.set ('txt_comment', this.propertiesTool.get ('scheduler.wakeup.comment'));
                paramsObject.set ('txt_verbose', this.propertiesTool.get ('scheduler.wakeup.verbose'));
                paramsObject.set ('txt_webservice', this.propertiesTool.get ('scheduler.wakeup.webservice'));
                this.cronScheduleAction (paramsObject);
            });
        }

        if (await this.propertiesTool.get ('scheduler.indicators.enable') === true) {
            nodeCron.schedule (await this.propertiesTool.get ('scheduler.indicators.cron'), (): void => {
                paramsObject.set ('txt_action', 'indicators');
                paramsObject.set ('txt_comment', this.propertiesTool.get ('scheduler.indicators.comment'));
                paramsObject.set ('txt_verbose', this.propertiesTool.get ('scheduler.indicators.verbose'));
                paramsObject.set ('txt_webservice', this.propertiesTool.get ('scheduler.indicators.webservice'));
                this.cronScheduleAction (paramsObject);
            });
        }

        if (await this.propertiesTool.get ('scheduler.inspirational.enable') === true) {
            nodeCron.schedule (await this.propertiesTool.get ('scheduler.inspirational.cron'), (): void => {
                paramsObject.set ('txt_action', 'inspirational');
                paramsObject.set ('txt_comment', this.propertiesTool.get ('scheduler.inspirational.comment'));
                paramsObject.set ('txt_verbose', this.propertiesTool.get ('scheduler.inspirational.verbose'));
                paramsObject.set ('txt_webservice', this.propertiesTool.get ('scheduler.inspirational.webservice'));
                this.cronScheduleAction (paramsObject);
            });
        }

    }

    private async cronScheduleAction (paramsObject: JsonObject): Promise<void> {

        const reflectionStrings = await this.reflectionTool.getStackStrings ();

        const logTool = new LogTool ();
        logTool.initialize (null, reflectionStrings);

        await this.scheduleService.cronScheduleAction (paramsObject, logTool.trace ());

        logTool.comment (paramsObject.get ('txt_comment'), paramsObject.get ('txt_verbose'));
        logTool.finalize ();

    }

}