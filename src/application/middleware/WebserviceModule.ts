import {inject, injectable} from 'tsyringe';

import superagent from 'superagent';

import {LogTool} from '../toolkit/LogTool';

import {LogConstants} from '../constants/LogConstants';

@injectable ()
export class WebserviceModule {

    constructor (
        @inject ('LogToolFactory') private logToolFactory: () => LogTool
    ) {
    }

    public async delete (traceObject: Record<string, any>, hostString: string, headersObject?: Record<string, any>, queryObject?: Record<string, any>, bodyObject?: Record<string, any>): Promise<Record<string, any>> {

        const logTool = this.logToolFactory ();
        logTool.setTrace (traceObject);
        logTool.INITIALIZE ();

        let resultObject: Record<string, any> = {};
        resultObject.incoming = {};

        try {

            let requestObject = superagent.delete (hostString.toString ());

            if (headersObject !== undefined && Object.keys (headersObject).length > 0) {

                requestObject.set (headersObject);

            }

            if (queryObject !== undefined && Object.keys (queryObject).length > 0) {

                resultObject.incoming.query = queryObject;

                requestObject.query (queryObject);

            }

            if (bodyObject !== undefined && Object.keys (bodyObject).length > 0) {

                resultObject.incoming.body = bodyObject;

                requestObject.send (bodyObject);

            }

            logTool.setWsvExecute ('DELETE', hostString, headersObject, queryObject, bodyObject);

            resultObject.outgoing = await requestObject.then ();

            resultObject.status = {};
            resultObject.status.boo_exception = false;
            resultObject.status.num_exception = LogConstants.SUCCESS.num_exception;
            resultObject.status.txt_exception = LogConstants.SUCCESS.txt_exception;

            logTool.setWsvSuccess ('DELETE', hostString);

        } catch (exception) {

            resultObject.status = {};
            resultObject.status.boo_exception = true;
            resultObject.status.num_exception = LogConstants.WEBSERVICE.num_exception;
            resultObject.status.txt_exception = LogConstants.WEBSERVICE.txt_exception;

            logTool.setWsvWebservice (hostString);

        }

        logTool.FINALIZE ();

        return resultObject;

    }

    public async get (traceObject: Record<string, any>, hostString: string, headersObject?: Record<string, any>, queryObject?: Record<string, any>, bodyObject?: Record<string, any>): Promise<Record<string, any>> {

        const logTool = this.logToolFactory ();
        logTool.setTrace (traceObject);
        logTool.INITIALIZE ();

        let resultObject: Record<string, any> = {};
        resultObject.incoming = {};

        try {

            let requestObject = superagent.get (hostString.toString ());

            if (headersObject !== undefined && Object.keys (headersObject).length > 0) {

                requestObject.set (headersObject);

            }

            if (queryObject !== undefined && Object.keys (queryObject).length > 0) {

                resultObject.incoming.query = queryObject;

                requestObject.query (queryObject);

            }

            if (bodyObject !== undefined && Object.keys (bodyObject).length > 0) {

                resultObject.incoming.body = bodyObject;

                requestObject.send (bodyObject);

            }

            logTool.setWsvExecute ('GET', hostString, headersObject, queryObject, bodyObject);

            resultObject.outgoing = await requestObject.then ();

            resultObject.status = {};
            resultObject.status.boo_exception = false;
            resultObject.status.num_exception = LogConstants.SUCCESS.num_exception;
            resultObject.status.txt_exception = LogConstants.SUCCESS.txt_exception;

            logTool.setWsvSuccess ('GET', hostString);

        } catch (exception) {

            resultObject.status = {};
            resultObject.status.boo_exception = true;
            resultObject.status.num_exception = LogConstants.WEBSERVICE.num_exception;
            resultObject.status.txt_exception = LogConstants.WEBSERVICE.txt_exception;

            logTool.setWsvWebservice (hostString);

        }

        logTool.FINALIZE ();

        return resultObject;

    }

    public async post (traceObject: Record<string, any>, hostString: string, headersObject?: Record<string, any>, queryObject?: Record<string, any>, bodyObject?: Record<string, any>): Promise<Record<string, any>> {

        const logTool = this.logToolFactory ();
        logTool.setTrace (traceObject);
        logTool.INITIALIZE ();

        let resultObject: Record<string, any> = {};
        resultObject.incoming = {};

        try {

            let requestObject = superagent.post (hostString.toString ());

            if (headersObject !== undefined && Object.keys (headersObject).length > 0) {

                requestObject.set (headersObject);

            }

            if (queryObject !== undefined && Object.keys (queryObject).length > 0) {

                resultObject.incoming.query = queryObject;

                requestObject.query (queryObject);

            }

            if (bodyObject !== undefined && Object.keys (bodyObject).length > 0) {

                resultObject.incoming.body = bodyObject;

                requestObject.send (bodyObject);

            }

            logTool.setWsvExecute ('POST', hostString, headersObject, queryObject, bodyObject);

            resultObject.outgoing = await requestObject.then ();

            resultObject.status = {};
            resultObject.status.boo_exception = false;
            resultObject.status.num_exception = LogConstants.SUCCESS.num_exception;
            resultObject.status.txt_exception = LogConstants.SUCCESS.txt_exception;

            logTool.setWsvSuccess ('POST', hostString);

        } catch (exception) {

            resultObject.status = {};
            resultObject.status.boo_exception = true;
            resultObject.status.num_exception = LogConstants.WEBSERVICE.num_exception;
            resultObject.status.txt_exception = LogConstants.WEBSERVICE.txt_exception;

            logTool.setWsvWebservice (hostString);

        }

        logTool.FINALIZE ();

        return resultObject;

    }


}