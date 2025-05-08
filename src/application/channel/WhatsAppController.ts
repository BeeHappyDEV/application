import {container, inject, injectable} from 'tsyringe';

import express from 'express';
import expressWs from 'express-ws';

import {Boom} from '@hapi/boom';
import {DisconnectReason, makeWASocket, useMultiFileAuthState} from 'baileys';
import {WebSocket} from 'ws';

import {CommonsTool} from '../toolkit/CommonsTool';
import {PropertiesTool} from '../toolkit/PropertiesTool';
import {LogTool} from '../toolkit/LogTool';
import {JsonObject} from '../object/JsonObject';
import {WhatsAppService} from './WhatsAppService';

@injectable ()
export class WhatsAppController {

    constructor (
        @inject (WhatsAppService) private whatsAppService: WhatsAppService,
        @inject (PropertiesTool) private propertiesTool: PropertiesTool
    ) {
        propertiesTool.initialize ().then ();
    }

    private codeString: String = '';

    public async initialize (expressApplication: typeof express.application, expressWsInstance: expressWs.Instance): Promise<void> {

        if (await this.propertiesTool.get ('channel.whatsapp.enable') === true) {

            const paramsObject = new JsonObject ();

            expressWsInstance.app.ws ('/whatsapp/websocket', (webSocket: WebSocket) => {

                this.websocketPageAction (webSocket);

            });

            expressApplication.get ('/whatsapp/associate', (expressRequest: typeof express.request, expressResponse: typeof express.response): void => {

                paramsObject.set ('txt_action', 'associate');
                paramsObject.set ('txt_render', 'configuration');

                this.getPageAction (expressRequest, expressResponse, paramsObject);

            });

            expressApplication.get ('/whatsapp/disassociate', (expressRequest: typeof express.request, expressResponse: typeof express.response): void => {

                paramsObject.set ('txt_action', 'disassociate');
                paramsObject.set ('txt_render', 'configuration');

                this.getPageAction (expressRequest, expressResponse, paramsObject);

            });

            await this.startChannel ();

        }

    }

    private async getPageAction (expressRequest: typeof express.request, expressResponse: typeof express.response, paramsObject: JsonObject): Promise<void> {

        const stackStrings = await CommonsTool.getStackStrings ();

        const logTool = container.resolve (LogTool);
        logTool.initialize (stackStrings);
        logTool.request (expressRequest);

        const resultObject = await this.whatsAppService.getPageAction (paramsObject, logTool.trace ());

        if (resultObject.hasOutgoing ()) {

            const environmentString = process.argv [2].slice (2);

            switch (environmentString) {

                case 'dev':

                    resultObject.setPath (await this.propertiesTool.get ('system.host') + ':' + await this.propertiesTool.get ('system.port'));
                    resultObject.setWebsocket (await this.propertiesTool.get ('system.websocket') + ':' + await this.propertiesTool.get ('system.port'));

                    break;

                case 'prd':

                    resultObject.setPath (await this.propertiesTool.get ('system.host'));
                    resultObject.setWebsocket (await this.propertiesTool.get ('system.websocket'));

                    break;

            }

            resultObject.setVersion (await CommonsTool.getApplicationVersion ());
            resultObject.setWebsite (await this.propertiesTool.get ('application.name') + await this.propertiesTool.get ('application.domain'));
            resultObject.setRender (paramsObject.get ('txt_render'));

            expressResponse.render (resultObject.getRender (), resultObject.getOutgoing ());

        } else {

            resultObject.setRedirect ('/');

            expressResponse.removeHeader ('cache-control');
            expressResponse.removeHeader ('pragma');
            expressResponse.redirect (resultObject.getRedirect ());

        }

        logTool.response (resultObject);
        logTool.finalize ();

    }

    private async startChannel (): Promise<void> {

        const stackStrings = await CommonsTool.getStackStrings ();

        const logTool = container.resolve (LogTool);
        logTool.initialize (stackStrings);

        let {state, saveCreds} = await useMultiFileAuthState ('sessions');

        let robotInstance = makeWASocket ({
            auth: state,
            defaultQueryTimeoutMs: 0,
            logger: {
                level: 'silent',
                trace: () => {},
                debug: () => {},
                info: () => {},
                warn: () => {},
                error: () => {},
                child: function() { return this; }
            }
        });

        robotInstance.ev.on ('creds.update', saveCreds);

        robotInstance.ev.on ('connection.update', async (requestObject: any) => {

            this.codeString = requestObject.qr;

            if (requestObject.connection === 'close') {

                let boom = new Boom (requestObject.lastDisconnect.error).output.statusCode;

                if (boom !== DisconnectReason.loggedOut) {

                    await this.startChannel ();

                }

            }

        });

        robotInstance.ev.on ('messages.upsert', async (requestObject: any) => {

            if (requestObject.type === 'notify') {

                if (requestObject.messages [0].key.fromMe === false) {

                    let paramsObject = new JsonObject ();

                    if (requestObject.messages [0].message.conversation !== '') {

                        paramsObject.set ('txt_message', requestObject.messages [0].message.conversation);

                    } else {

                        paramsObject.set ('txt_message', requestObject.messages [0].message.extendedTextMessage.text);

                    }

                    paramsObject.set ('txt_channel', 'whatsapp');
                    paramsObject.set ('txt_name', requestObject.messages [0].pushName);
                    paramsObject.set ('txt_sender', requestObject.messages [0].key.remoteJid.split ('@') [0]);

                    /*let workflowController = WorkflowController.getInstance ();
                    let resultObject = await workflowController.chatbot (paramsObject);

                    if (resultObject.getOutgoing () ['arr_expressions'] != null) {

                        let expressionsArray = resultObject.getOutgoing () ['arr_expressions'].sort ((a: any, b: any) => a.num_expression - b.num_expression);

                        for (let expressionObject of expressionsArray) {

                            if (expressionObject ['txt_type'] == 'text') {

                                await robotInstance.sendMessage (requestObject.messages [0].key.remoteJid, {text: expressionObject ['txt_content']});

                            }

                        }

                    }*/

                }

            }

        });

    }

    private async websocketPageAction (websocket: WebSocket): Promise<void> {

        const stackStrings = await CommonsTool.getStackStrings ();

        const logTool = container.resolve (LogTool);
        logTool.initialize (stackStrings);
        //logTool.websocket (await this.propertiesTool.get ('system.websocket'));

        let counterInteger = 0;

        let routineInterval = setInterval (async () => {

            if (counterInteger > 29) {

                clearInterval (routineInterval);

            }

            websocket.send (JSON.stringify ({value: this.codeString}));

            counterInteger++;

        }, 1000);

        logTool.finalize ();

    }

}