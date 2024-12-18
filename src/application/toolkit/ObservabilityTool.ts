import os from "os";
import process from "process";

import JsonObject from "../object/JsonObject";

class ObservabilityTool {

    private static instance: ObservabilityTool;

    public static getInstance () {

        if (!this.instance) {

            this.instance = new ObservabilityTool ();

        }

        return this.instance;

    }

    private constructor () {
    }

    public before () {

        let beforeObject = new JsonObject ();
        beforeObject.set ("cpu_system", process.cpuUsage ().system);
        beforeObject.set ("cpu_user", process.cpuUsage ().user);
        beforeObject.set ("memory_system", os.totalmem ());
        beforeObject.set ("memory_user", process.memoryUsage ().rss);

        let metricsObject = new JsonObject ();
        metricsObject.set ("before", beforeObject.all ());

        return metricsObject;

    }

    public after (logObject: JsonObject) {

        let afterObject = new JsonObject ();
        afterObject.set ("cpu_system", process.cpuUsage ().system);
        afterObject.set ("cpu_user", process.cpuUsage ().user);
        afterObject.set ("memory_system", os.totalmem ());
        afterObject.set ("memory_user", process.memoryUsage ().rss);

        let metricsObject = logObject.get ("metrics");
        metricsObject.set ("after", afterObject.all ());

        let systemCpuInterval = metricsObject.get ("after") ["cpu_system"] - metricsObject.get ("before") ["cpu_system"];
        let userCpuInterval = metricsObject.get ("after") ["cpu_user"] - metricsObject.get ("before") ["cpu_user"];
        let totalCpuInterval = process.uptime () * os.cpus ().length * 1e6;
        let cpuInterval = (((userCpuInterval + systemCpuInterval) / totalCpuInterval) * 100).toFixed (2);

        metricsObject.set ("cpu", Number (cpuInterval));

        let systemMemoryInterval = (metricsObject.get ("after") ["memory_system"] + metricsObject.get ("before") ["memory_system"]) / 2;
        let userMemoryInterval = (metricsObject.get ("after") ["memory_user"] + metricsObject.get ("before") ["memory_user"]) / 2;

        let memoryInterval = (userMemoryInterval / systemMemoryInterval * 100).toFixed (2);

        metricsObject.set ("memory", Number (memoryInterval));

        logObject.del ("metrics");
        logObject.set ("metrics", metricsObject.all ());

    }

}

export default ObservabilityTool;