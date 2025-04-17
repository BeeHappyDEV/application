import {inject, injectable} from 'tsyringe';

import express from 'express';

import {BackendService} from '@website/BackendService';
import {ExceptionTool} from '@toolkit/ExceptionTool';
import {LogTool} from '@toolkit/LogTool';
import {ReflectionTool} from '@toolkit/ReflectionTool';
import {JsonObject} from '@object/JsonObject';

@injectable ()
export class BackendController {

    constructor (
        @inject (BackendService) private readonly backendModule: BackendService,
        @inject (ReflectionTool) private readonly reflectionTool: ReflectionTool
    ) {
    }

    public async initialize (expressApplication: typeof express.application): Promise<void> {

        expressApplication.post ('/backend/system/wakeup', (expressRequest: typeof express.request, expressResponse: typeof express.response): void => {
            this.postWakeupApplication (expressRequest, expressResponse);
        });

        expressApplication.post ('/backend/cache/delete', (expressRequest: typeof express.request, expressResponse: typeof express.response): void => {
            this.postCacheDelete (expressRequest, expressResponse);
        });

        expressApplication.post ('/backend/rebuild/documental', (expressRequest: typeof express.request, expressResponse: typeof express.response): void => {
            this.postRebuildDocumental (expressRequest, expressResponse);
        });

        expressApplication.post ('/backend/rebuild/relational', (expressRequest: typeof express.request, expressResponse: typeof express.response): void => {
            this.postRebuildRelational (expressRequest, expressResponse);
        });

        expressApplication.post ('/backend/reload/indicators', (expressRequest: typeof express.request, expressResponse: typeof express.response): void => {
            this.postReloadIndicators (expressRequest, expressResponse);
        });

    }

    private async postWakeupApplication (expressRequest: typeof express.request, expressResponse: typeof express.response): Promise<void> {

        const reflectionStrings = await this.reflectionTool.getStackStrings ();

        const logTool = new LogTool ();
        logTool.initialize (null, reflectionStrings);
        logTool.contextualize (expressRequest);
        logTool.request (expressRequest);

        const paramsObject = new JsonObject ();

        const resultObject = await this.backendModule.postWakeupApplication (paramsObject, logTool.trace ());

        expressResponse.send (resultObject.all ());

        logTool.response (resultObject);
        logTool.finalize ();

    }

    private async postCacheDelete (expressRequest: typeof express.request, expressResponse: typeof express.response): Promise<void> {

        const reflectionStrings = await this.reflectionTool.getStackStrings ();

        const logTool = new LogTool ();
        logTool.initialize (null, reflectionStrings);
        logTool.contextualize (expressRequest);
        logTool.request (expressRequest);

        const resultObject = await this.backendModule.postCacheDelete (logTool.trace ());

        resultObject.result (ExceptionTool.SUCCESSFUL ());

        expressResponse.send (resultObject.all ());

        logTool.response (resultObject);
        logTool.finalize ();

    }

    private async postRebuildDocumental (expressRequest: typeof express.request, expressResponse: typeof express.response): Promise<void> {

        const reflectionStrings = await this.reflectionTool.getStackStrings ();

        const logTool = new LogTool ();
        logTool.initialize (null, reflectionStrings);
        logTool.contextualize (expressRequest);
        logTool.request (expressRequest);

        const resultObject = await this.backendModule.postRebuildDocumental (logTool.trace ());

        expressResponse.send (resultObject.all ());

        logTool.response (resultObject);
        logTool.finalize ();

    }

    private async postRebuildRelational (expressRequest: typeof express.request, expressResponse: typeof express.response): Promise<void> {

        const reflectionStrings = await this.reflectionTool.getStackStrings ();

        const logTool = new LogTool ();
        logTool.initialize (null, reflectionStrings);
        logTool.contextualize (expressRequest);
        logTool.request (expressRequest);

        const resultObject = await this.backendModule.postRebuildRelational (logTool.trace ());

        expressResponse.send (resultObject.all ());

        logTool.response (resultObject);
        logTool.finalize ();

    }

    private async postReloadIndicators (expressRequest: typeof express.request, expressResponse: typeof express.response): Promise<void> {

        const reflectionStrings = await this.reflectionTool.getStackStrings ();

        const logTool = new LogTool ();
        logTool.initialize (null, reflectionStrings);
        logTool.contextualize (expressRequest);
        logTool.request (expressRequest);

        const resultObject = await this.backendModule.postReloadIndicators (logTool.trace ());

        expressResponse.send (resultObject.all ());

        logTool.response (resultObject);
        logTool.finalize ();

    }

}