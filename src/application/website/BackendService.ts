import {inject, injectable} from "tsyringe";

import {BackendHelper} from "./BackendHelper";
import ExceptionTool from "../toolkit/ExceptionTool";
import JsonObject from "../object/JsonObject";
import {LogTool} from "../toolkit/LogTool";
import {MongoTool} from "../toolkit/MongoTool";
import {PropertiesTool} from "../toolkit/PropertiesTool";
import {ReflectionTool} from "../toolkit/ReflectionTool";
import ResultObject from "../object/ResultObject";
import ServiceTool from "../toolkit/ServiceTool";
import {PostgresTool} from "../toolkit/PostgresTool";

@injectable ()
export class BackendService {

    constructor (
        @inject (BackendHelper) public backendSupport: BackendHelper,
        @inject (PostgresTool) public postgresTool: PostgresTool,
        @inject (MongoTool) public mongoTool: MongoTool,
        @inject (PropertiesTool) public propertiesTool: PropertiesTool
    ) {}

    public async postWakeupApplication (paramsObject: JsonObject, traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (traceObject, reflectionStrings);

        paramsObject.set ("txt_function", "backend_wakeup_application");

        let resultObject = new ResultObject ();

        try {

            resultObject = await this.postgresTool.execute (paramsObject, logTool.trace ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    public async postCacheDelete (traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (traceObject, reflectionStrings);

        let headersObject = new JsonObject ();
        headersObject.set ("authorization", "Bearer " + await this.propertiesTool.get ("cloudflare.token"));
        headersObject.set ("content-type", "application/json");

        let bodyObject = new JsonObject ();
        bodyObject.set ("purge_everything", true);

        let resultObject = new ResultObject ();

        try {

            let serviceTool = ServiceTool.getInstance ();
            await serviceTool.delete (await this.propertiesTool.get ("cloudflare.host"), headersObject, null, bodyObject, logTool.trace ());

            resultObject.result (ExceptionTool.SUCCESSFUL ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    public async postRebuildDocumental (traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (traceObject, reflectionStrings);

        let resultObject = new ResultObject ();

        try {

            await this.mongoTool.rebuild (logTool.trace ());

            resultObject.result (ExceptionTool.SUCCESSFUL ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    public async postRebuildRelational (traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (traceObject, reflectionStrings);

        let resultObject = new ResultObject ();

        try {

            await this.backendSupport.readMainFile (logTool.trace ());

            resultObject.result (ExceptionTool.SUCCESSFUL ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    public async postReloadIndicators (traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (traceObject, reflectionStrings);

        let resultObject = new ResultObject ();

        try {

            await this.backendSupport.reloadDollarIndicators (logTool.trace ());
            await this.backendSupport.reloadEuroIndicators (logTool.trace ());
            await this.backendSupport.reloadFomentUnitIndicators (logTool.trace ());
            await this.backendSupport.reloadMonthlyTaxUnitIndicators (logTool.trace ());

            resultObject.result (ExceptionTool.SUCCESSFUL ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

}