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

    public async delete (traceRecord: Record<string, any>, hostString: string, headersRecord?: Record<string, any>, queryRecord?: Record<string, any>, bodyRecord?: Record<string, any>): Promise<Record<string, any>> {

        const logTool = this.logToolFactory ();
        logTool.setTrace (traceRecord);
        logTool.INITIALIZE ();

        let resultRecord: Record<string, any> = {};
        resultRecord.incoming = {};

        try {

            let requestRecord = superagent.delete (hostString.toString ());

            if (headersRecord !== undefined && Object.keys (headersRecord).length > 0) {

                requestRecord.set (headersRecord);

            }

            if (queryRecord !== undefined && Object.keys (queryRecord).length > 0) {

                resultRecord.incoming.query = queryRecord;

                requestRecord.query (queryRecord);

            }

            if (bodyRecord !== undefined && Object.keys (bodyRecord).length > 0) {

                resultRecord.incoming.body = bodyRecord;

                requestRecord.send (bodyRecord);

            }

            logTool.setWsvExecute ('DELETE', hostString, headersRecord, queryRecord, bodyRecord);

            resultRecord.outgoing = await requestRecord.then ();

            resultRecord.status = {};
            resultRecord.status.boo_exception = false;
            resultRecord.status.num_exception = LogConstants.SUCCESS.num_exception;
            resultRecord.status.txt_exception = LogConstants.SUCCESS.txt_exception;

            logTool.setWsvSuccess ('DELETE', hostString);

        } catch (exception) {

            resultRecord.status = {};
            resultRecord.status.boo_exception = true;
            resultRecord.status.num_exception = LogConstants.WEBSERVICE.num_exception;
            resultRecord.status.txt_exception = LogConstants.WEBSERVICE.txt_exception;

            logTool.setWsvWebservice (hostString);

        }

        logTool.FINALIZE ();

        return resultRecord;

    }

    public async get (traceRecord: Record<string, any>, hostString: string, headersRecord?: Record<string, any>, queryRecord?: Record<string, any>, bodyRecord?: Record<string, any>): Promise<Record<string, any>> {

        const logTool = this.logToolFactory ();
        logTool.setTrace (traceRecord);
        logTool.INITIALIZE ();

        let resultRecord: Record<string, any> = {};
        resultRecord.incoming = {};

        try {

            let requestRecord = superagent.get (hostString.toString ());

            if (headersRecord !== undefined && Object.keys (headersRecord).length > 0) {

                requestRecord.set (headersRecord);

            }

            if (queryRecord !== undefined && Object.keys (queryRecord).length > 0) {

                resultRecord.incoming.query = queryRecord;

                requestRecord.query (queryRecord);

            }

            if (bodyRecord !== undefined && Object.keys (bodyRecord).length > 0) {

                resultRecord.incoming.body = bodyRecord;

                requestRecord.send (bodyRecord);

            }

            logTool.setWsvExecute ('GET', hostString, headersRecord, queryRecord, bodyRecord);

            resultRecord.outgoing = await requestRecord.then ();

            resultRecord.status = {};
            resultRecord.status.boo_exception = false;
            resultRecord.status.num_exception = LogConstants.SUCCESS.num_exception;
            resultRecord.status.txt_exception = LogConstants.SUCCESS.txt_exception;

            logTool.setWsvSuccess ('GET', hostString);

        } catch (exception) {

            resultRecord.status = {};
            resultRecord.status.boo_exception = true;
            resultRecord.status.num_exception = LogConstants.WEBSERVICE.num_exception;
            resultRecord.status.txt_exception = LogConstants.WEBSERVICE.txt_exception;

            logTool.setWsvWebservice (hostString);

        }

        logTool.FINALIZE ();

        return resultRecord;

    }

    public async post (traceRecord: Record<string, any>, hostString: string, headersRecord?: Record<string, any>, queryRecord?: Record<string, any>, bodyRecord?: Record<string, any>): Promise<Record<string, any>> {

        const logTool = this.logToolFactory ();
        logTool.setTrace (traceRecord);
        logTool.INITIALIZE ();

        let resultRecord: Record<string, any> = {};
        resultRecord.incoming = {};

        try {

            let requestRecord = superagent.post (hostString.toString ());

            if (headersRecord !== undefined && Object.keys (headersRecord).length > 0) {

                requestRecord.set (headersRecord);

            }

            if (queryRecord !== undefined && Object.keys (queryRecord).length > 0) {

                resultRecord.incoming.query = queryRecord;

                requestRecord.query (queryRecord);

            }

            if (bodyRecord !== undefined && Object.keys (bodyRecord).length > 0) {

                resultRecord.incoming.body = bodyRecord;

                requestRecord.send (bodyRecord);

            }

            logTool.setWsvExecute ('POST', hostString, headersRecord, queryRecord, bodyRecord);

            resultRecord.outgoing = await requestRecord.then ();

            resultRecord.status = {};
            resultRecord.status.boo_exception = false;
            resultRecord.status.num_exception = LogConstants.SUCCESS.num_exception;
            resultRecord.status.txt_exception = LogConstants.SUCCESS.txt_exception;

            logTool.setWsvSuccess ('POST', hostString);

        } catch (exception) {

            resultRecord.status = {};
            resultRecord.status.boo_exception = true;
            resultRecord.status.num_exception = LogConstants.WEBSERVICE.num_exception;
            resultRecord.status.txt_exception = LogConstants.WEBSERVICE.txt_exception;

            logTool.setWsvWebservice (hostString);

        }

        logTool.FINALIZE ();

        return resultRecord;

    }
    
}