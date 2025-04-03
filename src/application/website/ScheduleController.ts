import nodeCron from "node-cron";

import LogTool from "../toolkit/LogTool";
import PropertiesTool from "../toolkit/PropertiesTool"
import ReflectionTool from "../toolkit/ReflectionTool";
import ScheduleModule from "../website/ScheduleModule";

class ScheduleController {

    private static instance: ScheduleController;

    public static getInstance () {

        if (!this.instance) {

            this.instance = new ScheduleController ();

        }

        return this.instance;

    }

    private constructor () {
    }

    public async execute () {

        if (await PropertiesTool.get ("scheduler.exeMetrics.enable") === true) {

            nodeCron.schedule (await PropertiesTool.get ("scheduler.exeMetrics.cron"), this.exeMetrics.bind (this));

        }

        if (await PropertiesTool.get ("scheduler.wakeup.enable") === true) {

            nodeCron.schedule (await PropertiesTool.get ("scheduler.wakeup.cron"), this.exeWakeup.bind (this));

        }

        if (await PropertiesTool.get ("scheduler.exeIndicators.enable") === true) {

            nodeCron.schedule (await PropertiesTool.get ("scheduler.exeIndicators.cron"), this.exeIndicators.bind (this));

        }

        if (await PropertiesTool.get ("scheduler.exeInspirational.enable") === true) {

            nodeCron.schedule (await PropertiesTool.get ("scheduler.exeInspirational.cron"), this.exeInspirational.bind (this));

        }

    }

    private async exeMetrics () {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings);
        logTool.comment (await PropertiesTool.get ("scheduler.metrics.comment"), await PropertiesTool.get ("scheduler.metrics.verbose"));
        logTool.finalize ();

    }

    private async exeWakeup () {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings);

        let scheduleModule = ScheduleModule.getInstance ();
        await scheduleModule.exeWakeup (logTool.trace ());

        logTool.comment (await PropertiesTool.get ("scheduler.wakeup.comment"), await PropertiesTool.get ("scheduler.wakeup.verbose"));
        logTool.finalize ();

    }

    private async exeIndicators () {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings);

        let scheduleModule = ScheduleModule.getInstance ();
        await scheduleModule.exeIndicators (logTool.trace ());

        logTool.comment (await PropertiesTool.get ("scheduler.indicators.comment"), await PropertiesTool.get ("scheduler.indicators.verbose"));
        logTool.finalize ();

    }

    private async exeInspirational () {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings);

        let scheduleModule = ScheduleModule.getInstance ();
        await scheduleModule.exeInspirational (logTool.trace ());

        logTool.comment (await PropertiesTool.get ("scheduler.inspirational.comment"), await PropertiesTool.get ("scheduler.inspirational.verbose"));
        logTool.finalize ();

    }

}

export default ScheduleController;