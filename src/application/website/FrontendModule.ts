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

    public async getLandingPage (paramsObject: JsonObject, traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        paramsObject.set ("txt_function", "frontend_landing_page");

        let resultObject = new ResultObject ();

        try {

            let postgresTool = PostgresTool.getInstance ();
            resultObject = await postgresTool.run (paramsObject, logTool.trace ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }


    public async getCallUsLink (paramsObject: JsonObject, traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        paramsObject.set ("txt_function", "frontend_call_us_link");

        let resultObject = new ResultObject ();

        try {

            let postgresTool = PostgresTool.getInstance ();
            resultObject = await postgresTool.run (paramsObject, logTool.trace ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    public async getWriteUsLink (paramsObject: JsonObject, traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        paramsObject.set ("txt_function", "frontend_write_us_link");

        let resultObject = new ResultObject ();

        try {

            let postgresTool = PostgresTool.getInstance ();
            resultObject = await postgresTool.run (paramsObject, logTool.trace ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    public async getTextUsLink (paramsObject: JsonObject, traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        paramsObject.set ("txt_function", "frontend_text_us_link");

        let resultObject = new ResultObject ();

        try {

            let postgresTool = PostgresTool.getInstance ();
            resultObject = await postgresTool.run (paramsObject, logTool.trace ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    public async getVisitUsLink (paramsObject: JsonObject, traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        paramsObject.set ("txt_function", "frontend_visit_us_link");

        let resultObject = new ResultObject ();

        try {

            let postgresTool = PostgresTool.getInstance ();
            resultObject = await postgresTool.run (paramsObject, logTool.trace ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    public async getFacebookLink (paramsObject: JsonObject, traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        paramsObject.set ("txt_function", "frontend_facebook_link");

        let resultObject = new ResultObject ();

        try {

            let postgresTool = PostgresTool.getInstance ();
            resultObject = await postgresTool.run (paramsObject, logTool.trace ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    public async getInstagramLink (paramsObject: JsonObject, traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        paramsObject.set ("txt_function", "frontend_instagram_link");

        let resultObject = new ResultObject ();

        try {

            let postgresTool = PostgresTool.getInstance ();
            resultObject = await postgresTool.run (paramsObject, logTool.trace ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    public async getXLink (paramsObject: JsonObject, traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        paramsObject.set ("txt_function", "frontend_x_link");

        let resultObject = new ResultObject ();

        try {

            let postgresTool = PostgresTool.getInstance ();
            resultObject = await postgresTool.run (paramsObject, logTool.trace ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    public async getLinkedinLink (paramsObject: JsonObject, traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        paramsObject.set ("txt_function", "frontend_linkedin_link");

        let resultObject = new ResultObject ();

        try {

            let postgresTool = PostgresTool.getInstance ();
            resultObject = await postgresTool.run (paramsObject, logTool.trace ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    public async getPolicyPage (paramsObject: JsonObject, traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        paramsObject.set ("txt_function", "frontend_policy_page");

        let resultObject = new ResultObject ();

        try {

            let postgresTool = PostgresTool.getInstance ();
            resultObject = await postgresTool.run (paramsObject, logTool.trace ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    public async getPolicyVideoLink (paramsObject: JsonObject, traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        paramsObject.set ("txt_function", "frontend_policy_video_link");

        let resultObject = new ResultObject ();

        try {

            let postgresTool = PostgresTool.getInstance ();
            resultObject = await postgresTool.run (paramsObject, logTool.trace ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    public async getTermsPage (paramsObject: JsonObject, traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        paramsObject.set ("txt_function", "frontend_terms_page");

        let resultObject = new ResultObject ();

        try {

            let postgresTool = PostgresTool.getInstance ();
            resultObject = await postgresTool.run (paramsObject, logTool.trace ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    public async getTermsVideoLink (paramsObject: JsonObject, traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        paramsObject.set ("txt_function", "frontend_terms_video_link");

        let resultObject = new ResultObject ();

        try {

            let postgresTool = PostgresTool.getInstance ();
            resultObject = await postgresTool.run (paramsObject, logTool.trace ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    public async getCollaboratorPage (paramsObject: JsonObject, traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        paramsObject.set ("txt_function", "frontend_collaborator_page");

        let resultObject = new ResultObject ();

        try {

            let postgresTool = PostgresTool.getInstance ();
            resultObject = await postgresTool.run (paramsObject, logTool.trace ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    public async getVcardFile (paramsObject: JsonObject, traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        paramsObject.set ("txt_function", "frontend_vcard_file");

        let resultObject = new ResultObject ();

        try {

            let postgresTool = PostgresTool.getInstance ();
            resultObject = await postgresTool.run (paramsObject, logTool.trace ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    public async getCallMeLink (paramsObject: JsonObject, traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        paramsObject.set ("txt_function", "frontend_call_me_link");

        let resultObject = new ResultObject ();

        try {

            let postgresTool = PostgresTool.getInstance ();
            resultObject = await postgresTool.run (paramsObject, logTool.trace ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    public async getTextMeLink (paramsObject: JsonObject, traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        paramsObject.set ("txt_function", "frontend_text_me_link");

        let resultObject = new ResultObject ();

        try {

            let postgresTool = PostgresTool.getInstance ();
            resultObject = await postgresTool.run (paramsObject, logTool.trace ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    public async getWriteMeLink (paramsObject: JsonObject, traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        paramsObject.set ("txt_function", "frontend_write_me_link");

        let resultObject = new ResultObject ();

        try {

            let postgresTool = PostgresTool.getInstance ();
            resultObject = await postgresTool.run (paramsObject, logTool.trace ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    public async getQrcodePage (paramsObject: JsonObject, traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        paramsObject.set ("txt_function", "frontend_qrcode_page");

        let resultObject = new ResultObject ();

        try {

            let postgresTool = PostgresTool.getInstance ();
            resultObject = await postgresTool.run (paramsObject, logTool.trace ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    public async getDocumentationPage (paramsObject: JsonObject, traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        paramsObject.set ("txt_function", "frontend_documentation_page");

        let resultObject = new ResultObject ();

        try {

            let postgresTool = PostgresTool.getInstance ();
            resultObject = await postgresTool.run (paramsObject, logTool.trace ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    public async useRedirectPage (paramsObject: JsonObject, traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        paramsObject.set ("txt_function", "frontend_redirect_page");

        let resultObject = new ResultObject ();

        try {

            let postgresTool = PostgresTool.getInstance ();
            resultObject = await postgresTool.run (paramsObject, logTool.trace ());

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