import {inject, singleton} from "tsyringe";

import nodeCron from "node-cron";

import {LogTool} from "../toolkit/LogTool";
import {PropertiesTool} from "../toolkit/PropertiesTool"
import {ReflectionTool} from "../toolkit/ReflectionTool";
import {ScheduleService} from "./ScheduleService";

@singleton ()
export class ScheduleController {

    constructor (
        @inject (ScheduleService) private scheduleService: ScheduleService,
        @inject (PropertiesTool) public propertiesTool: PropertiesTool
    ) {}

    public async execute () {

        if (await this.propertiesTool.get ("scheduler.exeMetrics.enable") === true) {

            nodeCron.schedule (await this.propertiesTool.get ("scheduler.exeMetrics.cron"), this.exeMetrics.bind (this));

        }

        if (await this.propertiesTool.get ("scheduler.wakeup.enable") === true) {

            nodeCron.schedule (await this.propertiesTool.get ("scheduler.wakeup.cron"), this.exeWakeup.bind (this));

        }

        if (await this.propertiesTool.get ("scheduler.exeIndicators.enable") === true) {

            nodeCron.schedule (await this.propertiesTool.get ("scheduler.exeIndicators.cron"), this.exeIndicators.bind (this));

        }

        if (await this.propertiesTool.get ("scheduler.exeInspirational.enable") === true) {

            nodeCron.schedule (await this.propertiesTool.get ("scheduler.exeInspirational.cron"), this.exeInspirational.bind (this));

        }

    }

    private async exeMetrics () {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (null, reflectionStrings);
        logTool.comment (await this.propertiesTool.get ("scheduler.metrics.comment"), await this.propertiesTool.get ("scheduler.metrics.verbose"));
        logTool.finalize ();

    }

    private async exeWakeup () {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (null, reflectionStrings);

        await this.scheduleService.exeWakeup (logTool.trace ());

        logTool.comment (await this.propertiesTool.get ("scheduler.wakeup.comment"), await this.propertiesTool.get ("scheduler.wakeup.verbose"));
        logTool.finalize ();

    }

    private async exeIndicators () {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (null, reflectionStrings);

        await this.scheduleService.exeIndicators (logTool.trace ());

        logTool.comment (await this.propertiesTool.get ("scheduler.indicators.comment"), await this.propertiesTool.get ("scheduler.indicators.verbose"));
        logTool.finalize ();

    }

    private async exeInspirational () {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (null, reflectionStrings);

        await this.scheduleService.exeInspirational (logTool.trace ());

        logTool.comment (await this.propertiesTool.get ("scheduler.inspirational.comment"), await this.propertiesTool.get ("scheduler.inspirational.verbose"));
        logTool.finalize ();

    }

}