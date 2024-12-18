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

            let superAgent = superagent.delete (hostString.toString ());

            if (headersObject !== null && !headersObject.empty ()) {

                superAgent.set (headersObject.all ());

            }

            if (paramsObject !== null && !paramsObject.empty ()) {

                superAgent.query (paramsObject.all ());

            }

            if (bodyObject !== null && !bodyObject.empty ()) {

                superAgent.send (bodyObject.all ());

            }

            let serviceObject = await superAgent.then ();

            resultObject.setServiceObject (paramsObject, serviceObject);

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

            let superAgent = superagent.get (hostString.toString ());

            logTool.resource (hostString.toString ());

            if (headersObject !== null) {

                superAgent.set (headersObject.all ());

            }

            if (paramsObject !== null) {

                superAgent.query (paramsObject.all ());

            }

            if (bodyObject !== null && !bodyObject.empty ()) {

                superAgent.send (bodyObject.all ());

            }

            let serviceObject = await superAgent.then ();

            resultObject.setServiceObject (paramsObject, serviceObject);

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

            let superAgent = superagent.post (hostString.toString ());

            logTool.resource (hostString.toString ());

            if (headersObject !== null) {

                superAgent.set (headersObject.all ());

            }

            if (paramsObject !== null) {

                superAgent.query (paramsObject.all ());

            }

            if (bodyObject !== null && !bodyObject.empty ()) {

                superAgent.send (bodyObject.all ());

            }

            let serviceObject = await superAgent.then ();

            resultObject.setServiceObject (paramsObject, serviceObject);

        } catch (exception) {

            resultObject.setServiceException ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

}

export default ServiceTool;