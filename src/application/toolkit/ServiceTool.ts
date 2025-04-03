import superagent from "superagent";

import ExceptionTool from "../toolkit/ExceptionTool";
import JsonObject from "../object/JsonObject";
import LogTool from "../toolkit/LogTool";
import ResultObject from "../object/ResultObject";
import ReflectionTool from "../toolkit/ReflectionTool";

class ServiceTool {

    private static instance: ServiceTool;

    public static getInstance () {

        if (!this.instance) {

            this.instance = new ServiceTool ();

        }

        return this.instance;

    }

    private constructor () {
    }

    public async delete (hostString: String, headersObject: JsonObject | null, paramsObject: JsonObject | null, bodyObject: JsonObject | null, traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        let resultObject = new ResultObject ();

        try {

            let requestObject = superagent.delete (hostString.toString ());

            if (headersObject !== null && !headersObject.empty ()) {

                requestObject.set (headersObject.all ());

            }

            if (paramsObject !== null && !paramsObject.empty ()) {

                requestObject.query (paramsObject.all ());

            }

            if (bodyObject !== null && !bodyObject.empty ()) {

                requestObject.send (bodyObject.all ());

            }

            let responseObject = await requestObject.then ();

            resultObject.setServiceObject (paramsObject, responseObject);

        } catch (exception) {

            //resultObject.result (ExceptionTool.SERVICE_EXCEPTION (this.classString, methodString));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    public async get (hostString: String, headersObject: JsonObject | null, paramsObject: JsonObject | null, bodyObject: JsonObject | null, traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        let resultObject = new ResultObject ();

        try {

            let requestObject = superagent.get (hostString.toString ());

            logTool.resource (hostString.toString ());

            if (headersObject !== null) {

                requestObject.set (headersObject.all ());

            }

            if (paramsObject !== null) {

                requestObject.query (paramsObject.all ());

            }

            if (bodyObject !== null && !bodyObject.empty ()) {

                requestObject.send (bodyObject.all ());

            }

            let responseObject = await requestObject.then ();

            resultObject.setServiceObject (paramsObject, responseObject);

        } catch (exception) {

            resultObject.result (ExceptionTool.SERVICE_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    public async post (hostString: String, headersObject: JsonObject | null, paramsObject: JsonObject | null, bodyObject: JsonObject | null, traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        let resultObject = new ResultObject ();

        try {

            let requestObject = superagent.post (hostString.toString ());

            logTool.resource (hostString.toString ());

            if (headersObject !== null) {

                requestObject.set (headersObject.all ());

            }

            if (paramsObject !== null) {

                requestObject.query (paramsObject.all ());

            }

            if (bodyObject !== null && !bodyObject.empty ()) {

                requestObject.send (bodyObject.all ());

            }

            let responseObject = await requestObject.then ();

            resultObject.setServiceObject (paramsObject, responseObject);

        } catch (exception) {

            resultObject.setServiceException ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

}

export default ServiceTool;