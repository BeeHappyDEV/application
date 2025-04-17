import {inject, injectable} from 'tsyringe';

import superagent from 'superagent';

import {ExceptionTool} from '@toolkit/ExceptionTool';
import {JsonObject} from '@object/JsonObject';
import {LogTool} from '@toolkit/LogTool';
import {ResultObject} from '@object/ResultObject';
import {ReflectionTool} from '@toolkit/ReflectionTool';

@injectable ()
export class WebserviceModule {

    constructor (
        @inject (ReflectionTool) private readonly reflectionTool: ReflectionTool
    ) {
    }

    public async delete (hostString: String, headersObject: JsonObject | null, queryObject: JsonObject | null, bodyObject: JsonObject | null, traceObject: JsonObject): Promise<ResultObject> {

        const reflectionStrings = await this.reflectionTool.getStackStrings ();

        let logTool = new LogTool ();
        logTool.initialize (traceObject, reflectionStrings);

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

            resultObject.result (ExceptionTool.SERVICE_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    public async get (hostString: String, headersObject: JsonObject | null, queryObject: JsonObject | null, bodyObject: JsonObject | null, traceObject: JsonObject): Promise<ResultObject> {

        const reflectionStrings = await this.reflectionTool.getStackStrings ();

        let logTool = new LogTool ();
        logTool.initialize (traceObject, reflectionStrings);

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

            resultObject.result (ExceptionTool.SERVICE_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    public async post (hostString: String, headersObject: JsonObject | null, queryObject: JsonObject | null, bodyObject: JsonObject | null, traceObject: JsonObject): Promise<ResultObject> {

        const reflectionStrings = await this.reflectionTool.getStackStrings ();

        let logTool = new LogTool ();
        logTool.initialize (traceObject, reflectionStrings);

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

            resultObject.setServiceException ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

}