import ExceptionTool from "../toolkit/ExceptionTool";
import JsonObject from "../object/JsonObject";
import LogTool from "../toolkit/LogTool";
import PostgresTool from "../toolkit/PostgresTool";
import ResultObject from "../object/ResultObject";
import ReflectionTool from "../toolkit/ReflectionTool";

class FrontendModule {

    private static instance: FrontendModule;

    public static getInstance () {

        if (!this.instance) {

            this.instance = new FrontendModule ();

        }

        return this.instance;

    }

    private constructor () {
    }

    public async execute (paramsObject: JsonObject, traceObject: JsonObject) {

        switch (traceObject.use ()) {

            case "getLandingPage": return this.getLandingPage (paramsObject, traceObject);
            case "getCallUsLink": return this.getCallUsLink (paramsObject, traceObject);
            case "getWriteUsLink": return this.getWriteUsLink (paramsObject, traceObject);
            case "getTextUsLink": return this.getTextUsLink (paramsObject, traceObject);
            case "getVisitUsLink": return this.getVisitUsLink (paramsObject, traceObject);
            case "getFacebookLink": return this.getFacebookLink (paramsObject, traceObject);
            case "getInstagramLink": return this.getInstagramLink (paramsObject, traceObject);
            case "getXLink": return this.getXLink (paramsObject, traceObject);
            case "getLinkedinLink": return this.getLinkedinLink (paramsObject, traceObject);
            case "getPolicyPage": return this.getPolicyPage (paramsObject, traceObject);
            case "getPolicyVideoLink": return this.getPolicyVideoLink (paramsObject, traceObject);
            case "getTermsPage": return this.getTermsPage (paramsObject, traceObject);
            case "getTermsVideoLink": return this.getTermsVideoLink (paramsObject, traceObject);
            case "getCollaboratorPage": return this.getCollaboratorPage (paramsObject, traceObject);
            case "getVcardFile": return this.getVcardFile (paramsObject, traceObject);
            case "getCallMeLink": return this.getCallMeLink (paramsObject, traceObject);
            case "getWriteMeLink": return this.getWriteMeLink (paramsObject, traceObject);
            case "getTextMeLink": return this.getTextMeLink (paramsObject, traceObject);
            case "getQRCodePage": return this.getQRCodePage (paramsObject, traceObject);
            default: return this.getRedirectPage (paramsObject, traceObject);

        }

    }

    private async getLandingPage (paramsObject: JsonObject, traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        paramsObject.set ("txt_function", "frontend_landing_page");

        let resultObject = new ResultObject ();

        try {

            let postgresTool = PostgresTool.getInstance ();
            resultObject = await postgresTool.execute (paramsObject, logTool.trace ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    private async getCallUsLink (paramsObject: JsonObject, traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        paramsObject.set ("txt_function", "frontend_call_us_link");

        let resultObject = new ResultObject ();

        try {

            let postgresTool = PostgresTool.getInstance ();
            resultObject = await postgresTool.execute (paramsObject, logTool.trace ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    private async getWriteUsLink (paramsObject: JsonObject, traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        paramsObject.set ("txt_function", "frontend_write_us_link");

        let resultObject = new ResultObject ();

        try {

            let postgresTool = PostgresTool.getInstance ();
            resultObject = await postgresTool.execute (paramsObject, logTool.trace ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    private async getTextUsLink (paramsObject: JsonObject, traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        paramsObject.set ("txt_function", "frontend_text_us_link");

        let resultObject = new ResultObject ();

        try {

            let postgresTool = PostgresTool.getInstance ();
            resultObject = await postgresTool.execute (paramsObject, logTool.trace ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    private async getVisitUsLink (paramsObject: JsonObject, traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        paramsObject.set ("txt_function", "frontend_visit_us_link");

        let resultObject = new ResultObject ();

        try {

            let postgresTool = PostgresTool.getInstance ();
            resultObject = await postgresTool.execute (paramsObject, logTool.trace ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    private async getFacebookLink (paramsObject: JsonObject, traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        paramsObject.set ("txt_function", "frontend_facebook_link");

        let resultObject = new ResultObject ();

        try {

            let postgresTool = PostgresTool.getInstance ();
            resultObject = await postgresTool.execute (paramsObject, logTool.trace ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    private async getInstagramLink (paramsObject: JsonObject, traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        paramsObject.set ("txt_function", "frontend_instagram_link");

        let resultObject = new ResultObject ();

        try {

            let postgresTool = PostgresTool.getInstance ();
            resultObject = await postgresTool.execute (paramsObject, logTool.trace ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    private async getXLink (paramsObject: JsonObject, traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        paramsObject.set ("txt_function", "frontend_x_link");

        let resultObject = new ResultObject ();

        try {

            let postgresTool = PostgresTool.getInstance ();
            resultObject = await postgresTool.execute (paramsObject, logTool.trace ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    private async getLinkedinLink (paramsObject: JsonObject, traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        paramsObject.set ("txt_function", "frontend_linkedin_link");

        let resultObject = new ResultObject ();

        try {

            let postgresTool = PostgresTool.getInstance ();
            resultObject = await postgresTool.execute (paramsObject, logTool.trace ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    private async getPolicyPage (paramsObject: JsonObject, traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        paramsObject.set ("txt_function", "frontend_policy_page");

        let resultObject = new ResultObject ();

        try {

            let postgresTool = PostgresTool.getInstance ();
            resultObject = await postgresTool.execute (paramsObject, logTool.trace ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    private async getPolicyVideoLink (paramsObject: JsonObject, traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        paramsObject.set ("txt_function", "frontend_policy_video_link");

        let resultObject = new ResultObject ();

        try {

            let postgresTool = PostgresTool.getInstance ();
            resultObject = await postgresTool.execute (paramsObject, logTool.trace ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    private async getTermsPage (paramsObject: JsonObject, traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        paramsObject.set ("txt_function", "frontend_terms_page");

        let resultObject = new ResultObject ();

        try {

            let postgresTool = PostgresTool.getInstance ();
            resultObject = await postgresTool.execute (paramsObject, logTool.trace ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    private async getTermsVideoLink (paramsObject: JsonObject, traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        paramsObject.set ("txt_function", "frontend_terms_video_link");

        let resultObject = new ResultObject ();

        try {

            let postgresTool = PostgresTool.getInstance ();
            resultObject = await postgresTool.execute (paramsObject, logTool.trace ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    private async getCollaboratorPage (paramsObject: JsonObject, traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        paramsObject.set ("txt_function", "frontend_collaborator_page");

        let resultObject = new ResultObject ();

        try {

            let postgresTool = PostgresTool.getInstance ();
            resultObject = await postgresTool.execute (paramsObject, logTool.trace ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    private async getVcardFile (paramsObject: JsonObject, traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        paramsObject.set ("txt_function", "frontend_vcard_file");

        let resultObject = new ResultObject ();

        try {

            let postgresTool = PostgresTool.getInstance ();
            resultObject = await postgresTool.execute (paramsObject, logTool.trace ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    private async getCallMeLink (paramsObject: JsonObject, traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        paramsObject.set ("txt_function", "frontend_call_me_link");

        let resultObject = new ResultObject ();

        try {

            let postgresTool = PostgresTool.getInstance ();
            resultObject = await postgresTool.execute (paramsObject, logTool.trace ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    private async getWriteMeLink (paramsObject: JsonObject, traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        paramsObject.set ("txt_function", "frontend_write_me_link");

        let resultObject = new ResultObject ();

        try {

            let postgresTool = PostgresTool.getInstance ();
            resultObject = await postgresTool.execute (paramsObject, logTool.trace ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    private async getTextMeLink (paramsObject: JsonObject, traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        paramsObject.set ("txt_function", "frontend_text_me_link");

        let resultObject = new ResultObject ();

        try {

            let postgresTool = PostgresTool.getInstance ();
            resultObject = await postgresTool.execute (paramsObject, logTool.trace ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    private async getQRCodePage (paramsObject: JsonObject, traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        paramsObject.set ("txt_function", "frontend_qrcode_page");

        let resultObject = new ResultObject ();

        try {

            let postgresTool = PostgresTool.getInstance ();
            resultObject = await postgresTool.execute (paramsObject, logTool.trace ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    private async getRedirectPage (paramsObject: JsonObject, traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        paramsObject.set ("txt_function", "frontend_redirect_page");

        let resultObject = new ResultObject ();

        try {

            let postgresTool = PostgresTool.getInstance ();
            resultObject = await postgresTool.execute (paramsObject, logTool.trace ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

}

export default FrontendModule;