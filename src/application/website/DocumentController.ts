import {container, inject, injectable} from 'tsyringe';

import express from 'express';

import {DocumentService} from './DocumentService';
import {CommonsTool} from '../toolkit/CommonsTool';
import {LogTool} from '../toolkit/LogTool';
import {JsonObject} from '../object/JsonObject';

@injectable ()
export class DocumentController {

    constructor (
        @inject (DocumentService) private documentService: DocumentService
    ) {
    }

    public async initialize (expressApplication: typeof express.application): Promise<void> {

        const paramsObject = container.resolve (JsonObject);

        paramsObject.set ('txt_version', '4.1');

        expressApplication.get ('/documentation/generate', (expressRequest: typeof express.request, expressResponse: typeof express.response): void => {

            this.getGenerateAction (expressRequest, expressResponse, paramsObject);

        });

    }

    private async getGenerateAction (expressRequest: typeof express.request, expressResponse: typeof express.response, paramsObject: JsonObject): Promise<void> {

        const stackStrings = await CommonsTool.getStackStrings ();

        const logTool = container.resolve (LogTool);
        logTool.initialize (stackStrings);
        logTool.contextualize (expressRequest);
        logTool.request (expressRequest);

        const resultObject = await this.documentService.getGenerateAction (paramsObject, logTool.trace ());

        expressResponse.send (resultObject.all ());

        logTool.response (resultObject);
        logTool.finalize ();

    }

}