import {inject, injectable} from 'tsyringe';

import express from 'express';

import {FrontendService} from './FrontendService';

import {CommonsTool} from '../toolkit/CommonsTool';
import {LogTool} from '../toolkit/LogTool';
import {PropertiesTool} from '../toolkit/PropertiesTool';

import {LogConstants} from '../constants/LogConstants';

@injectable ()
export class FrontendController {

    private initializedBoolean = false;

    constructor (
        @inject ('LogToolFactory') private logToolFactory: () => LogTool,
        @inject (PropertiesTool) private propertiesTool: PropertiesTool,
        @inject (FrontendService) private frontendService: FrontendService
    ) {
    }

    public async initialize (expressApplication: express.Application): Promise<void> {

        const paramsObject: Record<string, any> = {};

        expressApplication.get ('/', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsObject.txt_action = 'landing';
            paramsObject.txt_render = 'landing';

            this.getPageAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.get ('/contacto/llamanos', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsObject.txt_action = 'call_us';

            this.getLinkAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.get ('/contacto/escribenos', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsObject.txt_action = 'write_us';

            this.getLinkAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.get ('/contacto/texteanos', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsObject.txt_action = 'text_us';

            this.getLinkAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.get ('/contacto/visitanos', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsObject.txt_action = 'visit_us';

            this.getLinkAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.get ('/social/facebook', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsObject.txt_action = 'facebook';

            this.getLinkAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.get ('/social/instagram', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsObject.txt_action = 'instagram';

            this.getLinkAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.get ('/social/x', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsObject.txt_action = 'x';

            this.getLinkAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.get ('/social/linkedin', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsObject.txt_action = 'linkedin';

            this.getLinkAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.get ('/social/discord', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsObject.txt_action = 'discord';

            this.getLinkAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.get ('/politica-de-privacidad', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsObject.txt_action = 'privacy_policy';
            paramsObject.txt_render = 'policy';

            this.getPageAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.get ('/politica-de-privacidad/video', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsObject.txt_action = 'privacy_policy_video';

            this.getLinkAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.get ('/terminos-y-condiciones', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsObject.txt_action = 'terms_and_conditions';
            paramsObject.txt_render = 'terms';

            this.getPageAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.get ('/terminos-y-condiciones/video', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsObject.txt_action = 'terms_and_conditions_video';

            this.getLinkAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.get ('/colaborador/:name', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsObject.txt_action = 'collaborator';
            paramsObject.txt_name = expressRequest.params ['name'];
            paramsObject.txt_render = 'collaborator';

            this.getPageAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.get ('/colaborador/:name/vcard', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsObject.txt_action = 'vcard';
            paramsObject.txt_name = expressRequest.params ['name'];

            this.getFileAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.get ('/colaborador/:name/qr', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsObject.txt_action = 'qr';
            paramsObject.txt_name = expressRequest.params ['name'];
            paramsObject.txt_render = 'qr';

            this.getPageAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.get ('/colaborador/:name/llamame', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsObject.txt_action = 'call_me';
            paramsObject.txt_name = expressRequest.params ['name'];

            this.getLinkAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.get ('/colaborador/:name/escribeme', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsObject.txt_action = 'write_me';
            paramsObject.txt_name = expressRequest.params ['name'];

            this.getLinkAction (expressRequest, expressResponse, paramsObject);

        });

        expressApplication.get ('/colaborador/:name/texteame', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsObject.txt_action = 'text_me';
            paramsObject.txt_name = expressRequest.params ['name'];

            this.getLinkAction (expressRequest, expressResponse, paramsObject);

        });

        this.initializedBoolean = true;

    }

    public async isInitialized (): Promise<boolean> {

        return this.initializedBoolean;

    }

    private async getPageAction (expressRequest: express.Request, expressResponse: express.Response, paramsObject: Record<string, any>): Promise<void> {

        const logTool = this.logToolFactory ();
        logTool.setRequest (expressRequest);
        logTool.INITIALIZE ();

        let resultObject: Record<string, any> = {};

        try {

            resultObject = await this.frontendService.getPageAction (logTool.getTrace (), paramsObject);

            if (resultObject.outgoing) {

                const environmentString = process.argv [2].slice (2);

                switch (environmentString) {

                    case 'dev':

                        resultObject.outgoing.txt_path = await this.propertiesTool.get ('system.host') + ':' + await this.propertiesTool.get ('system.port');

                        break;

                    case 'prd':

                        resultObject.outgoing.txt_path = await this.propertiesTool.get ('system.host');

                        break;

                }

                resultObject.outgoing.txt_render = paramsObject.txt_render.trim ().split ('/') [0];
                resultObject.outgoing.txt_version = CommonsTool.getApplicationVersion ();
                resultObject.outgoing.txt_website = await this.propertiesTool.get ('application.name') + await this.propertiesTool.get ('application.domain');

                if (resultObject.status.num_exception === 0) {

                    expressResponse.render (resultObject.outgoing.txt_render, resultObject.outgoing);

                    logTool.OK ('Render', resultObject.outgoing.txt_render);

                } else {

                    resultObject.outgoing.txt_redirect = '/';

                    expressResponse.removeHeader ('cache-control');
                    expressResponse.removeHeader ('pragma');
                    expressResponse.redirect (resultObject.outgoing.txt_redirect);

                    logTool.NOK ('Redirect', resultObject.outgoing.txt_redirect);

                }

            } else {

                resultObject.outgoing = {};
                resultObject.outgoing.txt_redirect = '/';

                expressResponse.removeHeader ('cache-control');
                expressResponse.removeHeader ('pragma');
                expressResponse.redirect (resultObject.outgoing.txt_redirect);

                logTool.NOK ('Redirect', resultObject.outgoing.txt_redirect);

            }

        } catch (exception) {

            if (!resultObject.status) {

                resultObject.status = {};

            }

            resultObject.status.boo_exception = true;
            resultObject.status.num_exception = LogConstants.CONTROLLER.num_exception;
            resultObject.status.txt_exception = LogConstants.CONTROLLER.txt_exception;

            logTool.ERR (LogConstants.CONTROLLER);

        }

        logTool.FINALIZE ();

    }

    private async getLinkAction (expressRequest: express.Request, expressResponse: express.Response, paramsObject: Record<string, any>): Promise<void> {

        const logTool = this.logToolFactory ();
        logTool.setRequest (expressRequest);
        logTool.INITIALIZE ();

        let resultObject: Record<string, any> = {};

        try {

            resultObject = await this.frontendService.getLinkAction (logTool.getTrace (), paramsObject);

            if (resultObject.outgoing) {

                expressResponse.removeHeader ('cache-control');
                expressResponse.removeHeader ('pragma');

                if (resultObject.status.num_exception === 0) {

                    expressResponse.redirect (resultObject.outgoing.txt_redirect);

                    logTool.OK ('Redirect', resultObject.outgoing.txt_redirect);

                } else {

                    resultObject.outgoing.txt_redirect = '/';

                    expressResponse.redirect (resultObject.outgoing.txt_redirect);

                    logTool.NOK ('Redirect', resultObject.outgoing.txt_redirect);

                }

            } else {

                resultObject.outgoing = {};
                resultObject.outgoing.txt_redirect = '/';

                expressResponse.removeHeader ('cache-control');
                expressResponse.removeHeader ('pragma');
                expressResponse.redirect (resultObject.outgoing.txt_redirect);

                logTool.NOK ('Redirect', resultObject.outgoing.txt_redirect);

            }

        } catch (exception) {

            if (!resultObject.status) {

                resultObject.status = {};

            }

            resultObject.status.boo_exception = true;
            resultObject.status.num_exception = LogConstants.CONTROLLER.num_exception;
            resultObject.status.txt_exception = LogConstants.CONTROLLER.txt_exception;

            logTool.ERR (LogConstants.CONTROLLER);

        }

        logTool.FINALIZE ();

    }

    private async getFileAction (expressRequest: express.Request, expressResponse: express.Response, paramsObject: Record<string, any>): Promise<void> {

        const logTool = this.logToolFactory ();
        logTool.setRequest (expressRequest);
        logTool.INITIALIZE ();

        let resultObject: Record<string, any> = {};

        try {

            resultObject = await this.frontendService.getFileAction (logTool.getTrace (), paramsObject);

            if (resultObject.outgoing) {

                if (resultObject.status.num_exception === 0) {

                    expressResponse.setHeader ('content-type', resultObject.outgoing.txt_mime);
                    expressResponse.send (resultObject.outgoing.txt_vcard);

                    logTool.OK ('Vcard');

                } else {

                    resultObject.outgoing.txt_redirect = '/';

                    expressResponse.removeHeader ('cache-control');
                    expressResponse.removeHeader ('pragma');
                    expressResponse.redirect (resultObject.outgoing.txt_redirect);

                    logTool.NOK ('Redirect', resultObject.outgoing.txt_redirect);

                }

            } else {

                resultObject.outgoing = {};
                resultObject.outgoing.txt_redirect = '/';

                expressResponse.removeHeader ('cache-control');
                expressResponse.removeHeader ('pragma');
                expressResponse.redirect (resultObject.outgoing.txt_redirect);

                logTool.NOK ('Redirect', resultObject.outgoing.txt_redirect);

            }

        } catch (exception) {

            if (!resultObject.status) {

                resultObject.status = {};

            }

            resultObject.status.boo_exception = true;
            resultObject.status.num_exception = LogConstants.CONTROLLER.num_exception;
            resultObject.status.txt_exception = LogConstants.CONTROLLER.txt_exception;

            logTool.ERR (LogConstants.CONTROLLER);

        }

        logTool.FINALIZE ();

    }

}