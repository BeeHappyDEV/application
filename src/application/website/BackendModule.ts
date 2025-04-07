import BackendSupport from "../website/BackendSupport";
import ExceptionTool from "../toolkit/ExceptionTool";
import JsonObject from "../object/JsonObject";
import LogTool from "../toolkit/LogTool";
import MongoTool from "../toolkit/MongoTool";
import PropertiesTool from "../toolkit/PropertiesTool";
import ReflectionTool from "../toolkit/ReflectionTool";
import ResultObject from "../object/ResultObject";
import ServiceTool from "../toolkit/ServiceTool";
import PostgresTool from "../toolkit/PostgresTool";

class BackendModule {

    private static instance: BackendModule;

    public static getInstance () {

        if (!this.instance) {

            this.instance = new BackendModule ();

        }

        return this.instance;

    }

    private constructor () {
    }

    public async execute (paramsObject: JsonObject, traceObject: JsonObject) {

        switch (traceObject.use ()) {

            case "postWakeupApplication": return this.postWakeupApplication (paramsObject, traceObject);
            case "postCacheDelete": return this.postCacheDelete (traceObject);
            case "postRebuildDocumental": return this.postRebuildDocumental (traceObject);
            case "postRebuildRelational": return this.postRebuildRelational (traceObject);
            case "postReloadIndicators": return this.postReloadIndicators (traceObject);
            default: return new ResultObject ();

        }

    }

    private async postWakeupApplication (paramsObject: JsonObject, traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        paramsObject.set ("txt_function", "backend_wakeup_application");

        let resultObject = new ResultObject ();

        try {

            let postgresTool = PostgresTool.getInstance ();
            resultObject = await postgresTool.execute (paramsObject, logTool.trace ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    private async postCacheDelete (traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        let headersObject = new JsonObject ();
        headersObject.set ("authorization", "Bearer " + await PropertiesTool.get ("cloudflare.token"));
        headersObject.set ("content-type", "application/json");

        let bodyObject = new JsonObject ();
        bodyObject.set ("purge_everything", true);

        let resultObject = new ResultObject ();

        try {

            let serviceTool = ServiceTool.getInstance ();
            await serviceTool.delete (await PropertiesTool.get ("cloudflare.host"), headersObject, null, bodyObject, logTool.trace ());

            resultObject.result (ExceptionTool.SUCCESSFUL ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    private async postRebuildDocumental (traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        let resultObject = new ResultObject ();

        try {

            let mongoTool = MongoTool.getInstance ();
            await mongoTool.rebuild (logTool.trace ());

            resultObject.result (ExceptionTool.SUCCESSFUL ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    private async postRebuildRelational (traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        let resultObject = new ResultObject ();

        try {

            let backendSupport = BackendSupport.getInstance ();
            await backendSupport.readMainFile (logTool.trace ());

            resultObject.result (ExceptionTool.SUCCESSFUL ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    private async postReloadIndicators (traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        let resultObject = new ResultObject ();

        try {

            let backendSupport = BackendSupport.getInstance ();
            await backendSupport.reloadDollarIndicators (logTool.trace ());
            await backendSupport.reloadEuroIndicators (logTool.trace ());
            await backendSupport.reloadFomentUnitIndicators (logTool.trace ());
            await backendSupport.reloadMonthlyTaxUnitIndicators (logTool.trace ());

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

export default BackendModule;