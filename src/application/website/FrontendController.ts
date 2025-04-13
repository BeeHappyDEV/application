import {inject, singleton} from "tsyringe";

import express from "express";

import {FrontendService} from "./FrontendService";
import JsonObject from "../object/JsonObject";
import LogTool from "../toolkit/LogTool";
import PropertiesTool from "../toolkit/PropertiesTool";
import {ReflectionTool} from "../toolkit/ReflectionTool";

@singleton ()
export class FrontendController {

    constructor (
        @inject (FrontendService) private frontendModule: FrontendService
    ) {}

    public async execute (expressApplication: typeof express.application) {

        //expressApplication.all ("/", this.getLandingPage.bind (this));
        expressApplication.get ("/", this.getLandingPage.bind (this));
        expressApplication.get ("/contacto/llamanos", this.getCallUsLink.bind (this));
        expressApplication.get ("/contacto/escribenos", this.getWriteUsLink.bind (this));
        expressApplication.get ("/contacto/texteanos", this.getTextUsLink.bind (this));
        expressApplication.get ("/contacto/visitanos", this.getVisitUsLink.bind (this));
        expressApplication.get ("/social/facebook", this.getFacebookLink.bind (this));
        expressApplication.get ("/social/instagram", this.getInstagramLink.bind (this));
        expressApplication.get ("/social/x", this.getXLink.bind (this));
        expressApplication.get ("/social/linkedin", this.getLinkedinLink.bind (this));
        expressApplication.get ("/politica-de-privacidad", this.getPolicyPage.bind (this));
        expressApplication.get ("/politica-de-privacidad/video", this.getPolicyVideoLink.bind (this));
        expressApplication.get ("/terminos-y-condiciones", this.getTermsPage.bind (this));
        expressApplication.get ("/terminos-y-condiciones/video", this.getTermsVideoLink.bind (this));
        expressApplication.get ("/colaborador/:name", this.getCollaboratorPage.bind (this));
        expressApplication.get ("/colaborador/:name/vcard", this.getVcardFile.bind (this));
        expressApplication.get ("/colaborador/:name/llamame", this.getCallMeLink.bind (this));
        expressApplication.get ("/colaborador/:name/escribeme", this.getWriteMeLink.bind (this));
        expressApplication.get ("/colaborador/:name/texteame", this.getTextMeLink.bind (this));
        expressApplication.get ("/colaborador/:name/qr", this.getQRCodePage.bind (this));
        expressApplication.use (this.getRedirectPage.bind (this));

    }

    private async getLandingPage (expressRequest: typeof express.request, expressResponse: typeof express.response) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings);
        logTool.request (expressRequest);

        let paramsObject = new JsonObject ();

        let resultObject = await this.frontendModule.execute (paramsObject, logTool.trace ());

        let environmentString = process.argv [2].slice (2);

        switch (environmentString) {

            case "dev":

                resultObject.setPath (await PropertiesTool.get ("system.host") + ":" + await PropertiesTool.get ("system.port"));

                break;

            case "prd":

                resultObject.setPath (await PropertiesTool.get ("system.host"));

                break;

        }

        resultObject.setVersion (await PropertiesTool.get ("application.version"));
        resultObject.setWebsite (await PropertiesTool.get ("application.name") + await PropertiesTool.get ("application.domain"));
        resultObject.setRender ("landing/index.ejs");

        expressResponse.render (resultObject.getRender (), resultObject.getOutgoing ());

        logTool.response (resultObject);
        logTool.finalize ();

    }

    private async getCallUsLink (expressRequest: typeof express.request, expressResponse: typeof express.response) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings);
        logTool.request (expressRequest);

        let paramsObject = new JsonObject ();

        let resultObject = await this.frontendModule.execute (paramsObject, logTool.trace ());

        expressResponse.redirect (resultObject.getRedirect ());

        logTool.response (resultObject);
        logTool.finalize ();

    }

    private async getWriteUsLink (expressRequest: typeof express.request, expressResponse: typeof express.response) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings);
        logTool.request (expressRequest);

        let paramsObject = new JsonObject ();

        let resultObject = await this.frontendModule.execute (paramsObject, logTool.trace ());

        expressResponse.redirect (resultObject.getRedirect ());

        logTool.response (resultObject);
        logTool.finalize ();

    }

    private async getTextUsLink (expressRequest: typeof express.request, expressResponse: typeof express.response) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings);
        logTool.request (expressRequest);

        let paramsObject = new JsonObject ();

        let resultObject = await this.frontendModule.execute (paramsObject, logTool.trace ());

        expressResponse.redirect (resultObject.getRedirect ());

        logTool.response (resultObject);
        logTool.finalize ();

    }

    private async getVisitUsLink (expressRequest: typeof express.request, expressResponse: typeof express.response) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings);
        logTool.request (expressRequest);

        let paramsObject = new JsonObject ();

        let resultObject = await this.frontendModule.execute (paramsObject, logTool.trace ());

        expressResponse.redirect (resultObject.getRedirect ());

        logTool.response (resultObject);
        logTool.finalize ();

    }

    private async getFacebookLink (expressRequest: typeof express.request, expressResponse: typeof express.response) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings);
        logTool.request (expressRequest);

        let paramsObject = new JsonObject ();

        let resultObject = await this.frontendModule.execute (paramsObject, logTool.trace ());

        expressResponse.redirect (resultObject.getRedirect ());

        logTool.response (resultObject);
        logTool.finalize ();

    }

    private async getInstagramLink (expressRequest: typeof express.request, expressResponse: typeof express.response) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings);
        logTool.request (expressRequest);

        let paramsObject = new JsonObject ();

        let resultObject = await this.frontendModule.execute (paramsObject, logTool.trace ());

        expressResponse.redirect (resultObject.getRedirect ());

        logTool.response (resultObject);
        logTool.finalize ();

    }

    private async getXLink (expressRequest: typeof express.request, expressResponse: typeof express.response) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings);
        logTool.request (expressRequest);

        let paramsObject = new JsonObject ();

        let resultObject = await this.frontendModule.execute (paramsObject, logTool.trace ());

        expressResponse.redirect (resultObject.getRedirect ());

        logTool.response (resultObject);
        logTool.finalize ();

    }

    private async getLinkedinLink (expressRequest: typeof express.request, expressResponse: typeof express.response) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings);
        logTool.request (expressRequest);

        let paramsObject = new JsonObject ();

        let resultObject = await this.frontendModule.execute (paramsObject, logTool.trace ());

        expressResponse.redirect (resultObject.getRedirect ());

        logTool.response (resultObject);
        logTool.finalize ();

    }

    private async getPolicyPage (expressRequest: typeof express.request, expressResponse: typeof express.response) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings);
        logTool.request (expressRequest);

        let paramsObject = new JsonObject ();

        let resultObject = await this.frontendModule.execute (paramsObject, logTool.trace ());

        let environmentString = process.argv [2].slice (2);

        switch (environmentString) {

            case "dev":

                resultObject.setPath (await PropertiesTool.get ("system.host") + ":" + await PropertiesTool.get ("system.port"));

                break;

            case "prd":

                resultObject.setPath (await PropertiesTool.get ("system.host"));

                break;

        }

        resultObject.setVersion (await PropertiesTool.get ("application.version"));
        resultObject.setWebsite (await PropertiesTool.get ("application.name") + await PropertiesTool.get ("application.domain"));
        resultObject.setRender ("policy/index.ejs");

        expressResponse.render (resultObject.getRender (), resultObject.getOutgoing ());

        logTool.response (resultObject);
        logTool.finalize ();

    }

    private async getPolicyVideoLink (expressRequest: typeof express.request, expressResponse: typeof express.response) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings);
        logTool.request (expressRequest);

        let paramsObject = new JsonObject ();

        let resultObject = await this.frontendModule.execute (paramsObject, logTool.trace ());

        expressResponse.redirect (resultObject.getRedirect ());

        logTool.response (resultObject);
        logTool.finalize ();

    }

    private async getTermsPage (expressRequest: typeof express.request, expressResponse: typeof express.response) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings);
        logTool.request (expressRequest);

        let paramsObject = new JsonObject ();

        let resultObject = await this.frontendModule.execute (paramsObject, logTool.trace ());

        let environmentString = process.argv [2].slice (2);

        switch (environmentString) {

            case "dev":

                resultObject.setPath (await PropertiesTool.get ("system.host") + ":" + await PropertiesTool.get ("system.port"));

                break;

            case "prd":

                resultObject.setPath (await PropertiesTool.get ("system.host"));

                break;

        }

        resultObject.setVersion (await PropertiesTool.get ("application.version"));
        resultObject.setWebsite (await PropertiesTool.get ("application.name") + await PropertiesTool.get ("application.domain"));
        resultObject.setRender ("terms/index.ejs");

        expressResponse.render (resultObject.getRender (), resultObject.getOutgoing ());

        logTool.response (resultObject);
        logTool.finalize ();

    }

    private async getTermsVideoLink (expressRequest: typeof express.request, expressResponse: typeof express.response) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings);
        logTool.request (expressRequest);

        let paramsObject = new JsonObject ();

        let resultObject = await this.frontendModule.execute (paramsObject, logTool.trace ());

        expressResponse.redirect (resultObject.getRedirect ());

        logTool.response (resultObject);
        logTool.finalize ();

    }

    private async getCollaboratorPage (expressRequest: typeof express.request, expressResponse: typeof express.response) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings);
        logTool.request (expressRequest);

        let paramsObject = new JsonObject ();
        paramsObject.set ("txt_name", expressRequest.params ["name"]);
        paramsObject.set ("txt_path", await PropertiesTool.get ("system.path"));

        let resultObject = await this.frontendModule.execute (paramsObject, logTool.trace ());

        if (resultObject.hasOutgoing ()) {

            let environmentString = process.argv [2].slice (2);

            switch (environmentString) {

                case "dev":

                    resultObject.setPath (await PropertiesTool.get ("system.host") + ":" + await PropertiesTool.get ("system.port"));

                    break;

                case "prd":

                    resultObject.setPath (await PropertiesTool.get ("system.host"));

                    break;

            }

            resultObject.setVersion (await PropertiesTool.get ("application.version"));
            resultObject.setWebsite (await PropertiesTool.get ("application.name") + await PropertiesTool.get ("application.domain"));
            resultObject.setRender ("collaborator/index.ejs");

            expressResponse.render (resultObject.getRender (), resultObject.getOutgoing ());

        } else {

            resultObject.setRedirect ("/");

            expressResponse.redirect (resultObject.getRedirect ());

        }

        logTool.response (resultObject);
        logTool.finalize ();

    }

    private async getVcardFile (expressRequest: typeof express.request, expressResponse: typeof express.response) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings);
        logTool.request (expressRequest);

        let paramsObject = new JsonObject ();
        paramsObject.set ("txt_name", expressRequest.params ["name"]);

        let resultObject = await this.frontendModule.execute (paramsObject, logTool.trace ());

        if (resultObject.hasOutgoing ()) {

            expressResponse.setHeader ("content-type", "text/x-vcard");
            expressResponse.send (resultObject.getOutgoing () ["txt_vcard"]);

        } else {

            expressResponse.redirect ("/");

        }

        logTool.response (resultObject);
        logTool.finalize ();

    }

    private async getCallMeLink (expressRequest: typeof express.request, expressResponse: typeof express.response) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings);
        logTool.request (expressRequest);

        let paramsObject = new JsonObject ();
        paramsObject.set ("txt_name", expressRequest.params ["name"]);

        let resultObject = await this.frontendModule.execute (paramsObject, logTool.trace ());

        expressResponse.redirect (resultObject.getRedirect ());

        logTool.response (resultObject);
        logTool.finalize ();

    }

    private async getWriteMeLink (expressRequest: typeof express.request, expressResponse: typeof express.response) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings);
        logTool.request (expressRequest);

        let paramsObject = new JsonObject ();
        paramsObject.set ("txt_name", expressRequest.params ["name"]);

        let resultObject = await this.frontendModule.execute (paramsObject, logTool.trace ());

        expressResponse.redirect (resultObject.getRedirect ());

        logTool.response (resultObject);
        logTool.finalize ();

    }

    private async getTextMeLink (expressRequest: typeof express.request, expressResponse: typeof express.response) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings);
        logTool.request (expressRequest);

        let paramsObject = new JsonObject ();
        paramsObject.set ("txt_name", expressRequest.params ["name"]);

        let resultObject = await this.frontendModule.execute (paramsObject, logTool.trace ());

        expressResponse.redirect (resultObject.getRedirect ());

        logTool.response (resultObject);
        logTool.finalize ();

    }

    private async getQRCodePage (expressRequest: typeof express.request, expressResponse: typeof express.response) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings);
        logTool.request (expressRequest);

        let paramsObject = new JsonObject ();
        paramsObject.set ("txt_name", expressRequest.params ["name"]);
        paramsObject.set ("txt_path", await PropertiesTool.get ("system.path"));

        let resultObject = await this.frontendModule.execute (paramsObject, logTool.trace ());

        if (resultObject.hasOutgoing ()) {

            let environmentString = process.argv [2].slice (2);

            switch (environmentString) {

                case "dev":

                    resultObject.setPath (await PropertiesTool.get ("system.host") + ":" + await PropertiesTool.get ("system.port"));

                    break;

                case "prd":

                    resultObject.setPath (await PropertiesTool.get ("system.host"));

                    break;

            }

            resultObject.setVersion (await PropertiesTool.get ("application.version"));
            resultObject.setWebsite (await PropertiesTool.get ("application.name") + await PropertiesTool.get ("application.domain"));
            resultObject.setRender ("qr/index.ejs");

            expressResponse.render (resultObject.getRender (), resultObject.getOutgoing ());

        } else {

            expressResponse.redirect ("/");

        }

        logTool.response (resultObject);
        logTool.finalize ();

    }

    private async getRedirectPage (expressRequest: typeof express.request, expressResponse: typeof express.response) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings);
        logTool.request (expressRequest);

        let paramsObject = new JsonObject ();

        let resultObject = await this.frontendModule.execute (paramsObject, logTool.trace ());

        expressResponse.redirect (await PropertiesTool.get ("system.path"));

        logTool.response (resultObject);
        logTool.finalize ();

    }

}