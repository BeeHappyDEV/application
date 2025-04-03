import ExceptionTool from "../toolkit/ExceptionTool";
import JsonObject from "../object/JsonObject";
import LogTool from "../toolkit/LogTool";
import PropertiesTool from "../toolkit/PropertiesTool";
import ReflectionTool from "../toolkit/ReflectionTool";
import ResultObject from "../object/ResultObject";
import ServiceTool from "../toolkit/ServiceTool";

class ScheduleModule {

    private static instance: ScheduleModule;

    public static getInstance () {

        if (!this.instance) {

            this.instance = new ScheduleModule ();

        }

        return this.instance;

    }

    private constructor () {
    }

    public async execute (paramsObject: JsonObject, traceObject: JsonObject) {

        switch (traceObject.use ()) {

            case "exeWakeup": return this.exeWakeup (traceObject);
            case "exeIndicators": return this.exeIndicators (traceObject);
            case "exeInspirational": return this.exeInspirational (traceObject);
            default: return null;

        }

    }

    public async exeWakeup (traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        let paramsObject = new JsonObject ();
        paramsObject.set ("depth", "3");
        paramsObject.set ("thread", logTool.trace ().get ("thread"));

        let resultObject = new ResultObject ();

        try {

            let serviceTool = ServiceTool.getInstance ();
            resultObject = await serviceTool.post (await PropertiesTool.get ("scheduler.wakeup.service"), null, paramsObject, null, logTool.trace ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    public async exeIndicators (traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        let paramsObject = new JsonObject ();
        paramsObject.set ("depth", "3");
        paramsObject.set ("thread", logTool.trace ().get ("thread"));

        let resultObject = new ResultObject ();

        try {

            let serviceTool = ServiceTool.getInstance ();
            resultObject = await serviceTool.post (await PropertiesTool.get ("scheduler.indicators.service"), null, paramsObject, null, logTool.trace ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    public async exeInspirational (traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        let paramsObject = new JsonObject ();
        paramsObject.set ("depth", "3");
        paramsObject.set ("thread", logTool.trace ().get ("thread"));

        let resultObject = new ResultObject ();

        try {

            let serviceTool = ServiceTool.getInstance ();
            resultObject = await serviceTool.post (await PropertiesTool.get ("scheduler.inspirational.service"), null, paramsObject, null, logTool.trace ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

}

export default ScheduleModule;