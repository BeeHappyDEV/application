import ExceptionTool from "../toolkit/ExceptionTool";
import JsonObject from "../object/JsonObject";
import {LogTool} from "../toolkit/LogTool";
import {PropertiesTool} from "../toolkit/PropertiesTool";
import {ReflectionTool} from "../toolkit/ReflectionTool";
import ResultObject from "../object/ResultObject";
import ServiceTool from "../toolkit/ServiceTool";
import {inject, singleton} from "tsyringe";

@singleton ()
export class ScheduleService {

    constructor (
        @inject (PropertiesTool) private propertiesTool: PropertiesTool
    ) {}

    public async exeWakeup (traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (traceObject, reflectionStrings);

        let paramsObject = new JsonObject ();
        paramsObject.set ("depth", "3");
        paramsObject.set ("thread", logTool.trace ().get ("thread"));

        let resultObject = new ResultObject ();

        try {

            let serviceTool = ServiceTool.getInstance ();
            resultObject = await serviceTool.post (await this.propertiesTool.get ("scheduler.wakeup.service"), null, paramsObject, null, logTool.trace ());

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
        logTool.initialize (traceObject, reflectionStrings);

        let paramsObject = new JsonObject ();
        paramsObject.set ("depth", "3");
        paramsObject.set ("thread", logTool.trace ().get ("thread"));

        let resultObject = new ResultObject ();

        try {

            let serviceTool = ServiceTool.getInstance ();
            resultObject = await serviceTool.post (await this.propertiesTool.get ("scheduler.indicators.service"), null, paramsObject, null, logTool.trace ());

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
        logTool.initialize (traceObject, reflectionStrings);

        let paramsObject = new JsonObject ();
        paramsObject.set ("depth", "3");
        paramsObject.set ("thread", logTool.trace ().get ("thread"));

        let resultObject = new ResultObject ();

        try {

            let serviceTool = ServiceTool.getInstance ();
            resultObject = await serviceTool.post (await this.propertiesTool.get ("scheduler.inspirational.service"), null, paramsObject, null, logTool.trace ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

}