import {inject, injectable} from 'tsyringe';

import nodeCron from 'node-cron';

import {ScheduleService} from '../website/ScheduleService';

import {CommonsTool} from '../toolkit/CommonsTool';
import {LogTool} from '../toolkit/LogTool';
import {PropertiesTool} from '../toolkit/PropertiesTool';

import {JsonObject} from '../object/JsonObject';

@injectable ()
export class ScheduleController {

    constructor (
        @inject (ScheduleService) private scheduleService: ScheduleService,
        @inject (LogTool) private logTool: LogTool,
        @inject (PropertiesTool) private propertiesTool: PropertiesTool
    ) {
    }

    public async initialize (): Promise<void> {

        const paramsObject = new JsonObject ();

        if (Boolean (await this.propertiesTool.get ('scheduler.wakeup.enable'))) {

            nodeCron.schedule (await this.propertiesTool.get ('scheduler.wakeup.cron'), async (): Promise<void> => {

                paramsObject.set ('txt_action', 'wakeup');
                paramsObject.set ('txt_comment', await this.propertiesTool.get ('scheduler.wakeup.comment'));
                paramsObject.set ('txt_host', await this.propertiesTool.get ('scheduler.wakeup.host'));
                paramsObject.set ('txt_verbose', await this.propertiesTool.get ('scheduler.wakeup.verbose'));

                await this.cronScheduleAction (paramsObject);

            });

        }

        if (Boolean (await this.propertiesTool.get ('scheduler.indicators.enable'))) {

            nodeCron.schedule (await this.propertiesTool.get ('scheduler.indicators.cron'), async (): Promise<void> => {

                paramsObject.set ('txt_action', 'indicators');
                paramsObject.set ('txt_comment', await this.propertiesTool.get ('scheduler.indicators.comment'));
                paramsObject.set ('txt_host', await this.propertiesTool.get ('scheduler.indicators.host'));
                paramsObject.set ('txt_verbose', await this.propertiesTool.get ('scheduler.indicators.verbose'));

                await this.cronScheduleAction (paramsObject);

            });

        }

        if (Boolean (await this.propertiesTool.get ('scheduler.inspirational.enable'))) {

            nodeCron.schedule (await this.propertiesTool.get ('scheduler.inspirational.cron'), async (): Promise<void> => {

                paramsObject.set ('txt_action', 'inspirational');
                paramsObject.set ('txt_comment', await this.propertiesTool.get ('scheduler.inspirational.comment'));
                paramsObject.set ('txt_host', await this.propertiesTool.get ('scheduler.inspirational.host'));
                paramsObject.set ('txt_verbose', await this.propertiesTool.get ('scheduler.inspirational.verbose'));

                await this.cronScheduleAction (paramsObject);

            });

        }

    }

    private async cronScheduleAction (paramsObject: JsonObject): Promise<void> {

        const stackStringArray = CommonsTool.getStackStringArray ();

        this.logTool.initialize (stackStringArray);

        await this.scheduleService.cronScheduleAction (paramsObject, this.logTool.trace ());

        this.logTool.comment (paramsObject.get ('txt_comment'), paramsObject.get ('txt_verbose'));
        this.logTool.finalize ();

    }

}