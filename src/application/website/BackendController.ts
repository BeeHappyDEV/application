import {inject, singleton} from "tsyringe";

import express from "express";

import {BackendService} from "./BackendService";
import ExceptionTool from "../toolkit/ExceptionTool";
import JsonObject from "../object/JsonObject";
import {LogTool} from "../toolkit/LogTool";
import {ReflectionTool} from "../toolkit/ReflectionTool";

@singleton ()
export class BackendController {

    constructor (
        @inject (BackendService) private backendModule: BackendService
    ) {}

    public async execute (expressApplication: typeof express.application) {

        expressApplication.post ("/backend/system/wakeup", this.postWakeupApplication.bind (this));
        expressApplication.post ("/backend/cache/delete", this.postCacheDelete.bind (this));
        expressApplication.post ("/backend/rebuild/documental", this.postRebuildDocumental.bind (this));
        expressApplication.post ("/backend/rebuild/relational", this.postRebuildRelational.bind (this));
        expressApplication.post ("/backend/reload/indicators", this.postReloadIndicators.bind (this));

    }

    private async postWakeupApplication (expressRequest: typeof express.request, expressResponse: typeof express.response) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (null, reflectionStrings);
        logTool.contextualize (expressRequest);
        logTool.request (expressRequest);

        let paramsObject = new JsonObject ();

        let resultObject = await this.backendModule.postWakeupApplication (paramsObject, logTool.trace ());

        expressResponse.send (resultObject.all ());

        logTool.response (resultObject);
        logTool.finalize ();

    }

    private async postCacheDelete (expressRequest: typeof express.request, expressResponse: typeof express.response) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (null, reflectionStrings);
        logTool.contextualize (expressRequest);
        logTool.request (expressRequest);

        let resultObject = await this.backendModule.postCacheDelete (logTool.trace ());

        resultObject.result (ExceptionTool.SUCCESSFUL ());

        expressResponse.send (resultObject.all ());

        logTool.response (resultObject);
        logTool.finalize ();

    }

    private async postRebuildDocumental (expressRequest: typeof express.request, expressResponse: typeof express.response) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (null, reflectionStrings);
        logTool.contextualize (expressRequest);
        logTool.request (expressRequest);

        let resultObject = await this.backendModule.postRebuildDocumental (logTool.trace ());

        expressResponse.send (resultObject.all ());

        logTool.response (resultObject);
        logTool.finalize ();

    }

    private async postRebuildRelational (expressRequest: typeof express.request, expressResponse: typeof express.response) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (null, reflectionStrings);
        logTool.contextualize (expressRequest);
        logTool.request (expressRequest);

        let resultObject = await this.backendModule.postRebuildRelational (logTool.trace ());

        expressResponse.send (resultObject.all ());

        logTool.response (resultObject);
        logTool.finalize ();

    }

    private async postReloadIndicators (expressRequest: typeof express.request, expressResponse: typeof express.response) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (null, reflectionStrings);
        logTool.contextualize (expressRequest);
        logTool.request (expressRequest);

        let resultObject = await this.backendModule.postReloadIndicators (logTool.trace ());

        expressResponse.send (resultObject.all ());

        logTool.response (resultObject);
        logTool.finalize ();

    }

}