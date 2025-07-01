import {inject, injectable} from 'tsyringe';

import express from 'express';

import {FrontendService} from '../website/FrontendService';

import {CommonsTool} from '../toolkit/CommonsTool';
import {LogTool} from '../toolkit/LogTool';
import {PropertiesTool} from '../toolkit/PropertiesTool';

import {JsonObject} from '../object/JsonObject';

@injectable ()
export class FrontendController {

    constructor (
        @inject (FrontendService) private frontendService: FrontendService,
        @inject (LogTool) private logTool: LogTool,
        @inject (PropertiesTool) private propertiesTool: PropertiesTool
    ) {
    }

    public async initialize (expressApplication: express.Application): Promise<void> {

        const paramsObject = new JsonObject ();

        expressApplication.get ('/', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsObject.set ('txt_action', 'landing');
            paramsObject.set ('txt_render', 'landing');

            this.getPageAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.get ('/contacto/llamanos', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsObject.set ('txt_action', 'call_us');

            this.getLinkAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.get ('/contacto/escribenos', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsObject.set ('txt_action', 'write_us');

            this.getLinkAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.get ('/contacto/texteanos', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsObject.set ('txt_action', 'text_us');

            this.getLinkAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.get ('/contacto/visitanos', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsObject.set ('txt_action', 'visit_us');

            this.getLinkAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.get ('/social/facebook', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsObject.set ('txt_action', 'facebook');

            this.getLinkAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.get ('/social/instagram', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsObject.set ('txt_action', 'instagram');

            this.getLinkAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.get ('/social/x', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsObject.set ('txt_action', 'x');

            this.getLinkAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.get ('/social/linkedin', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsObject.set ('txt_action', 'linkedin');

            this.getLinkAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.get ('/social/discord', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsObject.set ('txt_action', 'discord');

            this.getLinkAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.get ('/politica-de-privacidad', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsObject.set ('txt_action', 'privacy_policy');
            paramsObject.set ('txt_render', 'policy');

            this.getPageAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.get ('/politica-de-privacidad/video', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsObject.set ('txt_action', 'privacy_policy_video');

            this.getLinkAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.get ('/terminos-y-condiciones', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsObject.set ('txt_action', 'terms_and_conditions');
            paramsObject.set ('txt_render', 'terms');

            this.getPageAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.get ('/terminos-y-condiciones/video', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsObject.set ('txt_action', 'terms_and_conditions_video');

            this.getLinkAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.get ('/colaborador/:name', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsObject.set ('txt_action', 'collaborator');
            paramsObject.set ('txt_name', expressRequest.params ['name']);
            paramsObject.set ('txt_render', 'collaborator');

            this.getPageAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.get ('/colaborador/:name/vcard', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsObject.set ('txt_action', 'vcard');
            paramsObject.set ('txt_name', expressRequest.params ['name']);

            this.getFileAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.get ('/colaborador/:name/qr', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsObject.set ('txt_action', 'qr');
            paramsObject.set ('txt_name', expressRequest.params ['name']);
            paramsObject.set ('txt_render', 'qr');

            this.getPageAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.get ('/colaborador/:name/llamame', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsObject.set ('txt_action', 'call_me');
            paramsObject.set ('txt_name', expressRequest.params ['name']);

            this.getLinkAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.get ('/colaborador/:name/escribeme', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsObject.set ('txt_action', 'write_me');
            paramsObject.set ('txt_name', expressRequest.params ['name']);

            this.getLinkAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.get ('/colaborador/:name/texteame', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsObject.set ('txt_action', 'text_me');
            paramsObject.set ('txt_name', expressRequest.params ['name']);

            this.getLinkAction (expressRequest, expressResponse, paramsObject);

        });

    }

    private async getPageAction (expressRequest: express.Request, expressResponse: express.Response, paramsObject: JsonObject): Promise<void> {

        const stackStringArray = CommonsTool.getStackStringArray ();

        this.logTool.initialize (stackStringArray);
        this.logTool.request (expressRequest);

        const resultObject = await this.frontendService.getPageAction (paramsObject, this.logTool.trace ());

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

            resultObject.setVersion (CommonsTool.getApplicationVersion ());
            resultObject.setWebsite (await this.propertiesTool.get ('application.name') + await this.propertiesTool.get ('application.domain'));
            resultObject.setRender (paramsObject.get ('txt_render'));

            expressResponse.render (resultObject.getRender (), resultObject.getOutgoing ());

        } else {

            resultObject.setRedirect ('/');

            expressResponse.removeHeader ('cache-control');
            expressResponse.removeHeader ('pragma');
            expressResponse.redirect (resultObject.getRedirect ());

        }

        this.logTool.response (resultObject);
        this.logTool.finalize ();

    }

    private async getLinkAction (expressRequest: express.Request, expressResponse: express.Response, paramsObject: JsonObject): Promise<void> {

        const stackStringArray = CommonsTool.getStackStringArray ();

        this.logTool.initialize (stackStringArray);
        this.logTool.request (expressRequest);

        const resultObject = await this.frontendService.getLinkAction (paramsObject, this.logTool.trace ());

        expressResponse.redirect (resultObject.getRedirect ());

        this.logTool.response (resultObject);
        this.logTool.finalize ();

    }

    private async getFileAction (expressRequest: express.Request, expressResponse: express.Response, paramsObject: JsonObject): Promise<void> {

        const stackStringArray = CommonsTool.getStackStringArray ();

        this.logTool.initialize (stackStringArray);
        this.logTool.request (expressRequest);

        const resultObject = await this.frontendService.getFileAction (paramsObject, this.logTool.trace ());

        if (resultObject.hasOutgoing ()) {

            expressResponse.setHeader ('content-type', resultObject.getOutgoing () ['txt_mime']);
            expressResponse.send (resultObject.getOutgoing () ['txt_vcard']);

        } else {

            expressResponse.redirect ('/');

        }

        this.logTool.response (resultObject);
        this.logTool.finalize ();

    }

}