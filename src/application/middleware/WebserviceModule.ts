import {inject, injectable} from 'tsyringe';

import superagent from 'superagent';

import {CommonsTool} from '../toolkit/CommonsTool';
import {ExceptionTool} from '../toolkit/ExceptionTool';
import {LogTool} from '../toolkit/LogTool';

import {JsonObject} from '../object/JsonObject';
import {ResultObject} from '../object/ResultObject';

@injectable ()
export class WebserviceModule {

    constructor (
        @inject (LogTool) private logTool: LogTool
    ) {
    }

    public async delete (hostString: String, headersObject: JsonObject | null, queryObject: JsonObject | null, bodyObject: JsonObject | null, traceObject: JsonObject): Promise<ResultObject> {

        const stackStringArray = CommonsTool.getStackStringArray ();

        this.logTool.initialize (stackStringArray, traceObject);

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

            resultObject.setResult (ExceptionTool.SERVICE_EXCEPTION (stackStringArray));

            this.logTool.exception ();

        }

        this.logTool.response (resultObject);
        this.logTool.finalize ();

        return resultObject;

    }

    public async get (hostString: String, headersObject: JsonObject | null, queryObject: JsonObject | null, bodyObject: JsonObject | null, traceObject: JsonObject): Promise<ResultObject> {

        const stackStringArray = CommonsTool.getStackStringArray ();

        this.logTool.initialize (stackStringArray, traceObject);

        let resultObject = new ResultObject ();

        try {

            let requestObject = superagent.get (hostString.toString ());

            this.logTool.resource (hostString.toString ());

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

            resultObject.setResult (ExceptionTool.SERVICE_EXCEPTION (stackStringArray));

            this.logTool.exception ();

        }

        this.logTool.response (resultObject);
        this.logTool.finalize ();

        return resultObject;

    }

    public async post (hostString: String, headersObject: JsonObject | null, queryObject: JsonObject | null, bodyObject: JsonObject | null, traceObject: JsonObject): Promise<ResultObject> {

        const stackStringArray = CommonsTool.getStackStringArray ();

        this.logTool.initialize (stackStringArray, traceObject);

        let resultObject =  new ResultObject ();

        try {

            let requestObject = superagent.post (hostString.toString ());

            this.logTool.resource (hostString.toString ());

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

            resultObject.setResult (ExceptionTool.SERVICE_EXCEPTION (stackStringArray));

        }

        this.logTool.response (resultObject);
        this.logTool.finalize ();

        return resultObject;

    }

}