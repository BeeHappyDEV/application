import express from "express";

import BackendModule from "../website/BackendModule";
import ExceptionTool from "../toolkit/ExceptionTool";
import JsonObject from "../object/JsonObject";
import LogTool from "../toolkit/LogTool";
import ReflectionTool from "../toolkit/ReflectionTool";

class BackendController {

    private static instance: BackendController;

    public static getInstance () {

        if (!this.instance) {

            this.instance = new BackendController ();

        }

        return this.instance;

    }

    private constructor () {
    }

    public async initialize (expressApplication: typeof express.application) {

        expressApplication.post ("/backend/system/wakeup", this.postWakeupApplication.bind (this));
        expressApplication.post ("/backend/cache/delete", this.postCacheDelete.bind (this));
        expressApplication.post ("/backend/rebuild/documental", this.postRebuildDocumental.bind (this));
        expressApplication.post ("/backend/rebuild/relational", this.postRebuildRelational.bind (this));
        expressApplication.post ("/backend/reload/indicators", this.postReloadIndicators.bind (this));

    }

    private async postWakeupApplication (expressRequest: typeof express.request, expressResponse: typeof express.response) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings);
        logTool.contextualize (expressRequest);
        logTool.request (expressRequest);

        let paramsObject = new JsonObject ();

        let backendModule = BackendModule.getInstance ();
        let resultObject = await backendModule.postWakeupApplication (paramsObject, logTool.trace ());

        expressResponse.send (resultObject.all ());

        logTool.response (resultObject);
        logTool.finalize ();

    }

    private async postCacheDelete (expressRequest: typeof express.request, expressResponse: typeof express.response) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings);
        logTool.contextualize (expressRequest);
        logTool.request (expressRequest);

        let backendModule = BackendModule.getInstance ();
        let resultObject = await backendModule.postCacheDelete (logTool.trace ());

        resultObject.result (ExceptionTool.SUCCESSFUL ());

        expressResponse.send (resultObject.all ());

        logTool.response (resultObject);
        logTool.finalize ();

    }

    private async postRebuildDocumental (expressRequest: typeof express.request, expressResponse: typeof express.response) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings);
        logTool.contextualize (expressRequest);
        logTool.request (expressRequest);

        let backendModule = BackendModule.getInstance ();
        let resultObject = await backendModule.postRebuildDocumental (logTool.trace ());

        expressResponse.send (resultObject.all ());

        logTool.response (resultObject);
        logTool.finalize ();

    }

    private async postRebuildRelational (expressRequest: typeof express.request, expressResponse: typeof express.response) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings);
        logTool.contextualize (expressRequest);
        logTool.request (expressRequest);

        let backendModule = BackendModule.getInstance ();
        let resultObject = await backendModule.postRebuildRelational (logTool.trace ());

        expressResponse.send (resultObject.all ());

        logTool.response (resultObject);
        logTool.finalize ();

    }

    private async postReloadIndicators (expressRequest: typeof express.request, expressResponse: typeof express.response) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings);
        logTool.contextualize (expressRequest);
        logTool.request (expressRequest);

        let backendModule = BackendModule.getInstance ();
        let resultObject = await backendModule.postReloadIndicators (logTool.trace ());

        expressResponse.send (resultObject.all ());

        logTool.response (resultObject);
        logTool.finalize ();

    }

}

export default BackendController;