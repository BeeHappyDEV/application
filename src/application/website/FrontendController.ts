import {container, inject, injectable} from 'tsyringe';

import express from 'express';

import {FrontendService} from './FrontendService';
import {CommonsTool} from '../toolkit/CommonsTool';
import {PropertiesTool} from '../toolkit/PropertiesTool';
import {LogTool} from '../toolkit/LogTool';
import {JsonObject} from '../object/JsonObject';

@injectable ()
export class FrontendController {

    constructor (
        @inject (FrontendService) private frontendModule: FrontendService,
        @inject (PropertiesTool) private propertiesTool: PropertiesTool
    ) {
        this.propertiesTool.initialize ().then ();
    }

    public async initialize (expressApplication: typeof express.application): Promise<void> {

        const paramsObject = new JsonObject ();

        expressApplication.get ('/', (expressRequest: typeof express.request, expressResponse: typeof express.response): void => {

            paramsObject.set ('txt_action', 'landing');
            paramsObject.set ('txt_render', 'landing/index.ejs');

            this.getPageAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.get ('/contacto/llamanos', (expressRequest: typeof express.request, expressResponse: typeof express.response): void => {

            paramsObject.set ('txt_action', 'call_us');

            this.getLinkAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.get ('/contacto/escribenos', (expressRequest: typeof express.request, expressResponse: typeof express.response): void => {

            paramsObject.set ('txt_action', 'write_us');

            this.getLinkAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.get ('/contacto/texteanos', (expressRequest: typeof express.request, expressResponse: typeof express.response): void => {

            paramsObject.set ('txt_action', 'text_us');

            this.getLinkAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.get ('/contacto/visitanos', (expressRequest: typeof express.request, expressResponse: typeof express.response): void => {

            paramsObject.set ('txt_action', 'visit_us');

            this.getLinkAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.get ('/social/facebook', (expressRequest: typeof express.request, expressResponse: typeof express.response): void => {

            paramsObject.set ('txt_action', 'facebook');

            this.getLinkAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.get ('/social/instagram', (expressRequest: typeof express.request, expressResponse: typeof express.response): void => {

            paramsObject.set ('txt_action', 'instagram');

            this.getLinkAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.get ('/social/x', (expressRequest: typeof express.request, expressResponse: typeof express.response): void => {

            paramsObject.set ('txt_action', 'x');

            this.getLinkAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.get ('/social/linkedin', (expressRequest: typeof express.request, expressResponse: typeof express.response): void => {

            paramsObject.set ('txt_action', 'linkedin');

            this.getLinkAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.get ('/social/discord', (expressRequest: typeof express.request, expressResponse: typeof express.response): void => {

            paramsObject.set ('txt_action', 'discord');

            this.getLinkAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.get ('/politica-de-privacidad', (expressRequest: typeof express.request, expressResponse: typeof express.response): void => {

            paramsObject.set ('txt_action', 'privacy_policy');
            paramsObject.set ('txt_render', 'policy/index.ejs');

            this.getPageAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.get ('/politica-de-privacidad/video', (expressRequest: typeof express.request, expressResponse: typeof express.response): void => {

            paramsObject.set ('txt_action', 'privacy_policy_video');

            this.getLinkAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.get ('/terminos-y-condiciones', (expressRequest: typeof express.request, expressResponse: typeof express.response): void => {

            paramsObject.set ('txt_action', 'terms_and_conditions');
            paramsObject.set ('txt_render', 'terms/index.ejs');

            this.getPageAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.get ('/terminos-y-condiciones/video', (expressRequest: typeof express.request, expressResponse: typeof express.response): void => {

            paramsObject.set ('txt_action', 'terms_and_conditions_video');

            this.getLinkAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.get ('/colaborador/:name', (expressRequest: typeof express.request, expressResponse: typeof express.response): void => {

            paramsObject.set ('txt_action', 'collaborator');
            paramsObject.set ('txt_name', expressRequest.params ['name']);
            paramsObject.set ('txt_render', 'collaborator/index.ejs');

            this.getPageAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.get ('/colaborador/:name/vcard', (expressRequest: typeof express.request, expressResponse: typeof express.response): void => {

            paramsObject.set ('txt_action', 'vcard');
            paramsObject.set ('txt_name', expressRequest.params ['name']);

            this.getFileAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.get ('/colaborador/:name/qr', (expressRequest: typeof express.request, expressResponse: typeof express.response): void => {

            paramsObject.set ('txt_action', 'qr');
            paramsObject.set ('txt_name', expressRequest.params ['name']);
            paramsObject.set ('txt_render', 'qr/index.ejs');

            this.getPageAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.get ('/colaborador/:name/llamame', (expressRequest: typeof express.request, expressResponse: typeof express.response): void => {

            paramsObject.set ('txt_action', 'call_me');
            paramsObject.set ('txt_name', expressRequest.params ['name']);

            this.getLinkAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.get ('/colaborador/:name/escribeme', (expressRequest: typeof express.request, expressResponse: typeof express.response): void => {

            paramsObject.set ('txt_action', 'write_me');
            paramsObject.set ('txt_name', expressRequest.params ['name']);

            this.getLinkAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.get ('/colaborador/:name/texteame', (expressRequest: typeof express.request, expressResponse: typeof express.response): void => {

            paramsObject.set ('txt_action', 'text_me');
            paramsObject.set ('txt_name', expressRequest.params ['name']);

            this.getLinkAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.use ((expressRequest: typeof express.request, expressResponse: typeof express.response): void => {

            paramsObject.set ('txt_action', '');

            this.getPageAction (expressRequest, expressResponse, paramsObject);

        });

    }

    private async getPageAction (expressRequest: typeof express.request, expressResponse: typeof express.response, paramsObject: JsonObject): Promise<void> {

        const stackStrings = await CommonsTool.getStackStrings ();

        const logTool = container.resolve (LogTool);
        logTool.initialize (stackStrings);
        logTool.request (expressRequest);

        const resultObject = await this.frontendModule.getPageAction (paramsObject, logTool.trace ());

        if (resultObject.hasOutgoing ()) {

            const environmentString = process.argv [2].slice (2);

            switch (environmentString) {

                case 'dev':

                    resultObject.setPath (await this.propertiesTool.get ('system.host') + ':' + await this.propertiesTool.get ('system.port'));

                    break;

                case 'prd':

                    resultObject.setPath (await this.propertiesTool.get ('system.host'));

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

    private async getLinkAction (expressRequest: typeof express.request, expressResponse: typeof express.response, paramsObject: JsonObject): Promise<void> {

        const stackStrings = await CommonsTool.getStackStrings ();

        const logTool = container.resolve (LogTool);
        logTool.initialize (stackStrings);
        logTool.request (expressRequest);

        const resultObject = await this.frontendModule.getLinkAction (paramsObject, logTool.trace ());

        expressResponse.redirect (resultObject.getRedirect ());

        logTool.response (resultObject);
        logTool.finalize ();

    }

    private async getFileAction (expressRequest: typeof express.request, expressResponse: typeof express.response, paramsObject: JsonObject): Promise<void> {

        const stackStrings = await CommonsTool.getStackStrings ();

        const logTool = container.resolve (LogTool);
        logTool.initialize (stackStrings);
        logTool.request (expressRequest);

        const resultObject = await this.frontendModule.getFileAction (paramsObject, logTool.trace ());

        if (resultObject.hasOutgoing ()) {

            expressResponse.setHeader ('content-type', resultObject.getOutgoing () ['txt_mime']);
            expressResponse.send (resultObject.getOutgoing () ['txt_vcard']);

        } else {

            expressResponse.redirect ('/');

        }

        logTool.response (resultObject);
        logTool.finalize ();

    }

}