import {inject, injectable} from 'tsyringe';

import nodeCron from 'node-cron';

import {ScheduleService} from './ScheduleService';

import {LogTool} from '../toolkit/LogTool';
import {PropertiesTool} from '../toolkit/PropertiesTool';

import {LogConstants} from "../constants/LogConstants";

@injectable ()
export class ScheduleController {

    private initializedBoolean = false;

    constructor (
        @inject ('LogToolFactory') private logToolFactory: () => LogTool,
        @inject (ScheduleService) private scheduleService: ScheduleService,
        @inject (PropertiesTool) private propertiesTool: PropertiesTool
    ) {
    }

    public async initialize (): Promise<void> {

        const paramsObject: Record<string, any> = {};

        if (Boolean (await this.propertiesTool.get ('scheduler.wakeup.enable'))) {

            nodeCron.schedule (await this.propertiesTool.get ('scheduler.wakeup.cron'), async (): Promise<void> => {

                paramsObject.txt_action = 'wakeup';
                paramsObject.txt_comment = await this.propertiesTool.get ('scheduler.wakeup.comment');
                paramsObject.txt_host = await this.propertiesTool.get ('scheduler.wakeup.host');
                paramsObject.txt_verbose = await this.propertiesTool.get ('scheduler.wakeup.verbose');

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

        this.initializedBoolean = true;

    }

    public async isInitialized (): Promise<boolean> {

        return this.initializedBoolean;

    }

    private async cronScheduleAction (paramsObject: Record<string, any>): Promise<void> {

        const logTool = this.logToolFactory ();
        logTool.INITIALIZE ();

        let resultObject: Record<string, any> = {};

        try {

            logTool.OK ('Execute',paramsObject.txt_comment + ' runs ' + paramsObject.txt_verbose);

            resultObject = await this.scheduleService.cronScheduleAction (logTool.getTrace (), paramsObject);

            if (resultObject.outgoing) {

                if (resultObject.status.num_exception === 0) {

                    logTool.OK ('Success', paramsObject.txt_comment);

                } else {

                    logTool.NOK ('Schedule Exception', paramsObject.txt_comment);

                }

            } else {

                resultObject.outgoing = {};

                logTool.NOK ('Schedule Exception', paramsObject.txt_comment);

            }

        } catch (exception) {

            if (!resultObject.status) {

                resultObject.status = {};

            }

            resultObject.status.boo_exception = true;
            resultObject.status.num_exception = LogConstants.CONTROLLER.num_exception;
            resultObject.status.txt_exception = LogConstants.CONTROLLER.txt_exception;

            logTool.ERR (LogConstants.CONTROLLER);

        }

        logTool.FINALIZE ();

    }

}