import {container, inject, injectable} from 'tsyringe';

import nodeCron from 'node-cron';

import {ScheduleService} from './ScheduleService';
import {PropertiesModule} from '../middleware/PropertiesModule';
import {CommonsTool} from '../toolkit/CommonsTool';
import {LogTool} from '../toolkit/LogTool';
import {JsonObject} from '../object/JsonObject';

@injectable ()
export class ScheduleController {

    constructor (
        @inject (PropertiesModule) private propertiesModule: PropertiesModule,
        @inject (ScheduleService) private scheduleService: ScheduleService
    ) {
        this.propertiesModule.initialize ().then ();
    }

    public async initialize (): Promise<void> {

        await this.propertiesModule.initialize();

        const paramsObject = container.resolve (JsonObject);

        if (Boolean (await this.propertiesModule.get ('scheduler.wakeup.enable'))) {

            nodeCron.schedule (await this.propertiesModule.get ('scheduler.wakeup.cron'), async (): Promise<void> => {

                paramsObject.set ('txt_action', 'wakeup');
                paramsObject.set ('txt_comment', await this.propertiesModule.get ('scheduler.wakeup.comment'));
                paramsObject.set ('txt_host', await this.propertiesModule.get ('scheduler.wakeup.host'));
                paramsObject.set ('txt_verbose', await this.propertiesModule.get ('scheduler.wakeup.verbose'));

                await this.cronScheduleAction (paramsObject);

            });

        }

        if (Boolean (await this.propertiesModule.get ('scheduler.indicators.enable'))) {

            nodeCron.schedule (await this.propertiesModule.get ('scheduler.indicators.cron'), async (): Promise<void> => {

                paramsObject.set ('txt_action', 'indicators');
                paramsObject.set ('txt_comment', await this.propertiesModule.get ('scheduler.indicators.comment'));
                paramsObject.set ('txt_host', await this.propertiesModule.get ('scheduler.indicators.host'));
                paramsObject.set ('txt_verbose', await this.propertiesModule.get ('scheduler.indicators.verbose'));

                await this.cronScheduleAction (paramsObject);

            });

        }

        if (Boolean (await this.propertiesModule.get ('scheduler.inspirational.enable'))) {

            nodeCron.schedule (await this.propertiesModule.get ('scheduler.inspirational.cron'), async (): Promise<void> => {

                paramsObject.set ('txt_action', 'inspirational');
                paramsObject.set ('txt_comment', await this.propertiesModule.get ('scheduler.inspirational.comment'));
                paramsObject.set ('txt_host', await this.propertiesModule.get ('scheduler.inspirational.host'));
                paramsObject.set ('txt_verbose', await this.propertiesModule.get ('scheduler.inspirational.verbose'));

                await this.cronScheduleAction (paramsObject);

            });

        }

    }

    private async cronScheduleAction (paramsObject: JsonObject): Promise<void> {

        const stackStrings = await CommonsTool.getStackStrings ();

        const logTool = container.resolve (LogTool);
        logTool.initialize (stackStrings);

        await this.scheduleService.cronScheduleAction (paramsObject, logTool.trace ());

        logTool.comment (paramsObject.get ('txt_comment'), paramsObject.get ('txt_verbose'));
        logTool.finalize ();

    }

}