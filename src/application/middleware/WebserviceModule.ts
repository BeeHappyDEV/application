import {container, injectable} from 'tsyringe';

import superagent from 'superagent';

import {CommonsTool} from '../toolkit/CommonsTool';
import {ExceptionTool} from '../toolkit/ExceptionTool';
import {LogTool} from '../toolkit/LogTool';
import {JsonObject} from '../object/JsonObject';
import {ResultObject} from '../object/ResultObject';

@injectable ()
export class WebserviceModule {

    public async delete (hostString: String, headersObject: JsonObject | null, queryObject: JsonObject | null, bodyObject: JsonObject | null, traceObject: JsonObject): Promise<ResultObject> {

        const stackStrings = await CommonsTool.getStackStrings ();

        const logTool = container.resolve (LogTool);
        logTool.initialize (stackStrings, traceObject);

        let resultObject = new ResultObject ();

        try {

            let requestObject = superagent.delete (hostString.toString ());

            if (headersObject !== null && !headersObject.empty ()) {

                requestObject.set (headersObject.all ());

            }

            if (queryObject !== null && !queryObject.empty ()) {

                requestObject.query (queryObject.all ());

            }

            if (bodyObject !== null && !bodyObject.empty ()) {

                requestObject.send (bodyObject.all ());

            }

            let responseObject = await requestObject.then ();

            resultObject.setServiceObject (queryObject, responseObject);

        } catch (exception) {

            resultObject.setResult (ExceptionTool.SERVICE_EXCEPTION (stackStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    public async get (hostString: String, headersObject: JsonObject | null, queryObject: JsonObject | null, bodyObject: JsonObject | null, traceObject: JsonObject): Promise<ResultObject> {

        const stackStrings = await CommonsTool.getStackStrings ();

        const logTool = container.resolve (LogTool);
        logTool.initialize (stackStrings, traceObject);

        let resultObject = new ResultObject ();

        try {

            let requestObject = superagent.get (hostString.toString ());

            logTool.resource (hostString.toString ());

            if (headersObject !== null) {

                requestObject.set (headersObject.all ());

            }

            if (queryObject !== null) {

                requestObject.query (queryObject.all ());

            }

            if (bodyObject !== null && !bodyObject.empty ()) {

                requestObject.send (bodyObject.all ());

            }

            let responseObject = await requestObject.then ();
            resultObject.setServiceObject (queryObject, responseObject);

        } catch (exception) {

            resultObject.setResult (ExceptionTool.SERVICE_EXCEPTION (stackStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    public async post (hostString: String, headersObject: JsonObject | null, queryObject: JsonObject | null, bodyObject: JsonObject | null, traceObject: JsonObject): Promise<ResultObject> {

        const stackStrings = await CommonsTool.getStackStrings ();

        const logTool = container.resolve (LogTool);
        logTool.initialize (stackStrings, traceObject);

        let resultObject = new ResultObject ();

        try {

            let requestObject = superagent.post (hostString.toString ());

            logTool.resource (hostString.toString ());

            if (headersObject !== null) {

                requestObject.set (headersObject.all ());

            }

            if (queryObject !== null) {

                requestObject.query (queryObject.all ());

            }

            if (bodyObject !== null && !bodyObject.empty ()) {

                requestObject.send (bodyObject.all ());

            }

            let responseObject = await requestObject.then ();

            resultObject.setServiceObject (queryObject, responseObject);

        } catch (exception) {

            resultObject.setResult (ExceptionTool.SERVICE_EXCEPTION (stackStrings));

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

}