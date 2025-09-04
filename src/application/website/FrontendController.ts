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

        const paramsRecord: Record<string, any> = {};

        expressApplication.get ('/', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsRecord.txt_action = 'landing';
            paramsRecord.txt_render = 'landing';

            this.getPageAction (expressRequest, expressResponse, paramsRecord);

        });

        expressApplication.get ('/contacto/llamanos', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsRecord.txt_action = 'call_us';

            this.getLinkAction (expressRequest, expressResponse, paramsRecord);

        });

        expressApplication.get ('/contacto/escribenos', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsRecord.txt_action = 'write_us';

            this.getLinkAction (expressRequest, expressResponse, paramsRecord);

        });

        expressApplication.get ('/contacto/texteanos', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsRecord.txt_action = 'text_us';

            this.getLinkAction (expressRequest, expressResponse, paramsRecord);

        });

        expressApplication.get ('/contacto/visitanos', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsRecord.txt_action = 'visit_us';

            this.getLinkAction (expressRequest, expressResponse, paramsRecord);

        });

        expressApplication.get ('/social/facebook', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsRecord.txt_action = 'facebook';

            this.getLinkAction (expressRequest, expressResponse, paramsRecord);

        });

        expressApplication.get ('/social/instagram', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsRecord.txt_action = 'instagram';

            this.getLinkAction (expressRequest, expressResponse, paramsRecord);

        });

        expressApplication.get ('/social/x', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsRecord.txt_action = 'x';

            this.getLinkAction (expressRequest, expressResponse, paramsRecord);

        });

        expressApplication.get ('/social/linkedin', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsRecord.txt_action = 'linkedin';

            this.getLinkAction (expressRequest, expressResponse, paramsRecord);

        });

        expressApplication.get ('/social/discord', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsRecord.txt_action = 'discord';

            this.getLinkAction (expressRequest, expressResponse, paramsRecord);

        });

        expressApplication.get ('/politica-de-privacidad', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsRecord.txt_action = 'privacy_policy';
            paramsRecord.txt_render = 'policy';

            this.getPageAction (expressRequest, expressResponse, paramsRecord);

        });

        expressApplication.get ('/politica-de-privacidad/video', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsRecord.txt_action = 'privacy_policy_video';

            this.getLinkAction (expressRequest, expressResponse, paramsRecord);

        });

        expressApplication.get ('/terminos-y-condiciones', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsRecord.txt_action = 'terms_and_conditions';
            paramsRecord.txt_render = 'terms';

            this.getPageAction (expressRequest, expressResponse, paramsRecord);

        });

        expressApplication.get ('/terminos-y-condiciones/video', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsRecord.txt_action = 'terms_and_conditions_video';

            this.getLinkAction (expressRequest, expressResponse, paramsRecord);

        });

        expressApplication.get ('/colaborador/:name', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsRecord.txt_action = 'collaborator';
            paramsRecord.txt_name = expressRequest.params ['name'];
            paramsRecord.txt_render = 'collaborator';

            this.getPageAction (expressRequest, expressResponse, paramsRecord);

        });

        expressApplication.get ('/colaborador/:name/vcard', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsRecord.txt_action = 'vcard';
            paramsRecord.txt_name = expressRequest.params ['name'];

            this.getFileAction (expressRequest, expressResponse, paramsRecord);

        });

        expressApplication.get ('/colaborador/:name/qr', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsRecord.txt_action = 'qr';
            paramsRecord.txt_name = expressRequest.params ['name'];
            paramsRecord.txt_render = 'qr';

            this.getPageAction (expressRequest, expressResponse, paramsRecord);

        });

        expressApplication.get ('/colaborador/:name/llamame', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsRecord.txt_action = 'call_me';
            paramsRecord.txt_name = expressRequest.params ['name'];

            this.getLinkAction (expressRequest, expressResponse, paramsRecord);

        });

        expressApplication.get ('/colaborador/:name/escribeme', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsRecord.txt_action = 'write_me';
            paramsRecord.txt_name = expressRequest.params ['name'];

            this.getLinkAction (expressRequest, expressResponse, paramsRecord);

        });

        expressApplication.get ('/colaborador/:name/texteame', (expressRequest: express.Request, expressResponse: express.Response): void => {

            paramsRecord.txt_action = 'text_me';
            paramsRecord.txt_name = expressRequest.params ['name'];

            this.getLinkAction (expressRequest, expressResponse, paramsRecord);

        });

        this.initializedBoolean = true;

    }

    public async isInitialized (): Promise<boolean> {

        return this.initializedBoolean;

    }



    private async getPageAction (expressRequest: express.Request, expressResponse: express.Response, paramsRecord: Record<string, any>): Promise<void> {

        const logTool = this.logToolFactory ();
        logTool.setRequest (expressRequest);
        logTool.INITIALIZE ();

        let resultRecord: Record<string, any> = {};

        try {

            resultRecord = await this.frontendService.getPageAction (logTool.getTrace (), paramsRecord);

            if (resultRecord.outgoing) {

                const environmentString = process.argv [2].slice (2);

                switch (environmentString) {

                    case 'dev':

                        resultRecord.outgoing.txt_path = await this.propertiesTool.get ('system.host') + ':' + await this.propertiesTool.get ('system.port');

                        break;

                    case 'prd':

                        resultRecord.outgoing.txt_path = await this.propertiesTool.get ('system.host');

                        break;

                }

                resultRecord.outgoing.txt_render = paramsRecord.txt_render.trim ().split ('/') [0];
                resultRecord.outgoing.txt_version = CommonsTool.getApplicationVersion ();
                resultRecord.outgoing.txt_website = await this.propertiesTool.get ('application.name') + await this.propertiesTool.get ('application.domain');

                if (resultRecord.status.num_exception === 0) {

                    expressResponse.render (resultRecord.outgoing.txt_render, resultRecord.outgoing);

                    logTool.OK ('Render', resultRecord.outgoing.txt_render);

                } else {

                    resultRecord.outgoing.txt_redirect = '/';

                    expressResponse.removeHeader ('cache-control');
                    expressResponse.removeHeader ('pragma');
                    expressResponse.redirect (resultRecord.outgoing.txt_redirect);

                    logTool.NOK ('Redirect', resultRecord.outgoing.txt_redirect);

                }

            } else {

                resultRecord.outgoing = {};
                resultRecord.outgoing.txt_redirect = '/';

                expressResponse.removeHeader ('cache-control');
                expressResponse.removeHeader ('pragma');
                expressResponse.redirect (resultRecord.outgoing.txt_redirect);

                logTool.NOK ('Redirect', resultRecord.outgoing.txt_redirect);

            }

        } catch (exception) {

            if (!resultRecord.status) {

                resultRecord.status = {};

            }

            resultRecord.status.boo_exception = true;
            resultRecord.status.num_exception = LogConstants.CONTROLLER.num_exception;
            resultRecord.status.txt_exception = LogConstants.CONTROLLER.txt_exception;

            logTool.ERR (LogConstants.CONTROLLER);

        }

        logTool.FINALIZE ();

    }

    private async getLinkAction (expressRequest: express.Request, expressResponse: express.Response, paramsRecord: Record<string, any>): Promise<void> {

        const logTool = this.logToolFactory ();
        logTool.setRequest (expressRequest);
        logTool.INITIALIZE ();

        let resultRecord: Record<string, any> = {};

        try {

            resultRecord = await this.frontendService.getLinkAction (logTool.getTrace (), paramsRecord);

            if (resultRecord.outgoing) {

                expressResponse.removeHeader ('cache-control');
                expressResponse.removeHeader ('pragma');

                if (resultRecord.status.num_exception === 0) {

                    expressResponse.redirect (resultRecord.outgoing.txt_redirect);

                    logTool.OK ('Redirect', resultRecord.outgoing.txt_redirect);

                } else {

                    resultRecord.outgoing.txt_redirect = '/';

                    expressResponse.redirect (resultRecord.outgoing.txt_redirect);

                    logTool.NOK ('Redirect', resultRecord.outgoing.txt_redirect);

                }

            } else {

                resultRecord.outgoing = {};
                resultRecord.outgoing.txt_redirect = '/';

                expressResponse.removeHeader ('cache-control');
                expressResponse.removeHeader ('pragma');
                expressResponse.redirect (resultRecord.outgoing.txt_redirect);

                logTool.NOK ('Redirect', resultRecord.outgoing.txt_redirect);

            }

        } catch (exception) {

            if (!resultRecord.status) {

                resultRecord.status = {};

            }

            resultRecord.status.boo_exception = true;
            resultRecord.status.num_exception = LogConstants.CONTROLLER.num_exception;
            resultRecord.status.txt_exception = LogConstants.CONTROLLER.txt_exception;

            logTool.ERR (LogConstants.CONTROLLER);

        }

        logTool.FINALIZE ();

    }

    private async getFileAction (expressRequest: express.Request, expressResponse: express.Response, paramsRecord: Record<string, any>): Promise<void> {

        const logTool = this.logToolFactory ();
        logTool.setRequest (expressRequest);
        logTool.INITIALIZE ();

        let resultRecord: Record<string, any> = {};

        try {

            resultRecord = await this.frontendService.getFileAction (logTool.getTrace (), paramsRecord);

            if (resultRecord.outgoing) {

                if (resultRecord.status.num_exception === 0) {

                    expressResponse.setHeader ('content-type', resultRecord.outgoing.txt_mime);
                    expressResponse.send (resultRecord.outgoing.txt_vcard);

                    logTool.OK ('Vcard');

                } else {

                    resultRecord.outgoing.txt_redirect = '/';

                    expressResponse.removeHeader ('cache-control');
                    expressResponse.removeHeader ('pragma');
                    expressResponse.redirect (resultRecord.outgoing.txt_redirect);

                    logTool.NOK ('Redirect', resultRecord.outgoing.txt_redirect);

                }

            } else {

                resultRecord.outgoing = {};
                resultRecord.outgoing.txt_redirect = '/';

                expressResponse.removeHeader ('cache-control');
                expressResponse.removeHeader ('pragma');
                expressResponse.redirect (resultRecord.outgoing.txt_redirect);

                logTool.NOK ('Redirect', resultRecord.outgoing.txt_redirect);

            }

        } catch (exception) {

            if (!resultRecord.status) {

                resultRecord.status = {};

            }

            resultRecord.status.boo_exception = true;
            resultRecord.status.num_exception = LogConstants.CONTROLLER.num_exception;
            resultRecord.status.txt_exception = LogConstants.CONTROLLER.txt_exception;

            logTool.ERR (LogConstants.CONTROLLER);

        }

        logTool.FINALIZE ();

    }

}