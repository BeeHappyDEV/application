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
        @inject (PropertiesTool) private propertiesTool: PropertiesTool,
        @inject (ScheduleService) private scheduleService: ScheduleService
    ) {
    }

    public async initialize (): Promise<void> {

        const paramsRecord: Record<string, any> = {};

        if (Boolean (await this.propertiesTool.get ('scheduler.wakeup.enable'))) {

            nodeCron.schedule (await this.propertiesTool.get ('scheduler.wakeup.cron'), async (): Promise<void> => {

                paramsRecord.txt_action = 'wakeup';
                paramsRecord.txt_comment = await this.propertiesTool.get ('scheduler.wakeup.comment');
                paramsRecord.txt_host = await this.propertiesTool.get ('scheduler.wakeup.host');
                paramsRecord.txt_verbose = await this.propertiesTool.get ('scheduler.wakeup.verbose');

                await this.cronScheduleAction (paramsRecord);

            });

        }

        if (Boolean (await this.propertiesTool.get ('scheduler.indicators.enable'))) {

            nodeCron.schedule (await this.propertiesTool.get ('scheduler.indicators.cron'), async (): Promise<void> => {

                paramsRecord.set ('txt_action', 'indicators');
                paramsRecord.set ('txt_comment', await this.propertiesTool.get ('scheduler.indicators.comment'));
                paramsRecord.set ('txt_host', await this.propertiesTool.get ('scheduler.indicators.host'));
                paramsRecord.set ('txt_verbose', await this.propertiesTool.get ('scheduler.indicators.verbose'));

                await this.cronScheduleAction (paramsRecord);

            });

        }

        if (Boolean (await this.propertiesTool.get ('scheduler.inspirational.enable'))) {

            nodeCron.schedule (await this.propertiesTool.get ('scheduler.inspirational.cron'), async (): Promise<void> => {

                paramsRecord.set ('txt_action', 'inspirational');
                paramsRecord.set ('txt_comment', await this.propertiesTool.get ('scheduler.inspirational.comment'));
                paramsRecord.set ('txt_host', await this.propertiesTool.get ('scheduler.inspirational.host'));
                paramsRecord.set ('txt_verbose', await this.propertiesTool.get ('scheduler.inspirational.verbose'));

                await this.cronScheduleAction (paramsRecord);

            });

        }

        this.initializedBoolean = true;

    }

    public async isInitialized (): Promise<boolean> {

        return this.initializedBoolean;

    }

    private async cronScheduleAction (paramsRecord: Record<string, any>): Promise<void> {

        const logTool = this.logToolFactory ();
        logTool.INITIALIZE ();

        let resultRecord: Record<string, any> = {};

        try {

            logTool.OK ('Execute', paramsRecord.txt_comment + ' runs ' + paramsRecord.txt_verbose);

            resultRecord = await this.scheduleService.cronScheduleAction (logTool.getTrace (), paramsRecord);

            if (resultRecord.outgoing) {

                if (resultRecord.status.num_exception === 0) {

                    logTool.OK ('Success', paramsRecord.txt_comment);

                } else {

                    logTool.NOK ('Schedule Exception', paramsRecord.txt_comment);

                }

            } else {

                resultRecord.outgoing = {};

                logTool.NOK ('Schedule Exception', paramsRecord.txt_comment);

            }

        } catch (exception) {

            if (!resultRecord.status) {

                resultRecord.status = {};

            }

            resultRecord.status.boo_exception = true;
            resultRecord.status.num_exception = LogConstants.CONTROLLER.num_exception;
            resultRecord.status.txt_exception = LogConstants.CONTROLLER.txt_exception;

            logTool.ERR (LogConstants.CONTROLLER);

        }

        logTool.FINALIZE ();

    }

}