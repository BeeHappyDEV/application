import {Writable} from 'stream';

import {hrtime} from 'process';
import {inject, injectable} from 'tsyringe';
import {v4 as uuidv4} from 'uuid';

import express from 'express';
import kleur from 'kleur';
import pino from 'pino';
import url from 'url';

import {MongoDbModule} from '../middleware/MongoDbModule';

import {LogConstants} from "../constants/LogConstants";
import {CommonsTool} from "./CommonsTool";

@injectable ()
export class LogTool {

    private contextRecord: Record<string, any> = {};
    private logger: pino.Logger;

    constructor (
        @inject (MongoDbModule) private mongoDbModule: MongoDbModule
    ) {

        const date = new Date ();

        this.contextRecord.starting = this.getDatetime (date);
        this.contextRecord.transaction = this.getUuid ();
        this.contextRecord.environment = process.argv [2].slice (2).toUpperCase ();
        this.contextRecord.depth = 1;
        this.contextRecord.overwrite = true;

        const consoleStream = new Writable ({

            write: (_chunk: { toString: () => string }, _encoding: any, callback: () => void) => {

                let logString = ''
                logString += this.getPrefix ();
                logString += this.getSuffix ();

                process.stdout.write (logString + '\n');

                callback ();

            }

        });

        const mongoStream = new Writable ({

            write: async (_chunk: any, _encoding: any, callback: (error?: Error) => void) => {

                const logRecord = this.getJson (this.contextRecord);

                await this.mongoDbModule.insertTracking (logRecord);

                callback ();

            },
            autoDestroy: true,
            emitClose: true

        });

        this.logger = pino ({
            level: 'info',
            base: null
        }, pino.multistream ([
            {stream: consoleStream},
            {stream: mongoStream}
        ]));

    }

    public OK (keyString?: any, valueString?: string): void {

        this.contextRecord.level = LogConstants.OK;
        this.contextRecord.event = LogConstants.OK_EXECUTE.event;

        if (keyString) {

            this.contextRecord.message = keyString;

        }

        if (valueString) {

            this.contextRecord.data = valueString;

        }

        this.setEnding (4);

        this.logger.info (this.contextRecord);

    }

    public NOK (keyString?: any, valueString?: string): void {

        this.contextRecord.level = LogConstants.NOK;
        this.contextRecord.event = LogConstants.NOK_EXECUTE.event;

        if (keyString) {

            this.contextRecord.message = keyString;

        }

        if (valueString) {

            this.contextRecord.data = valueString;

        }

        this.setEnding (4);

        this.logger.info (this.contextRecord);

    }

    public ERR (keyString?: any, valueString?: string): void {

        this.contextRecord.level = LogConstants.ERR;
        this.contextRecord.event = LogConstants.ERR_EXECUTE.event;

        if (keyString) {

            this.contextRecord.message = keyString;

        }

        if (valueString) {

            this.contextRecord.data = valueString;

        }

        this.setEnding (4);

        this.logger.info (this.contextRecord);

    }

    public INITIALIZE (): void {

        this.contextRecord.level = LogConstants.DBG;
        this.contextRecord.event = LogConstants.DBG_INITIALIZE.event;
        this.contextRecord.phase = LogConstants.DBG_INITIALIZE.message;

        this.setEnding (4);

        this.logger.info (this.contextRecord);

    }

    public FINALIZE (): void {

        this.contextRecord.level = LogConstants.DBG;
        this.contextRecord.event = LogConstants.DBG_FINALIZE.event;
        this.contextRecord.phase = LogConstants.DBG_FINALIZE.message;

        this.setEnding (4);

        this.logger.info (this.contextRecord);

    }

    public setScpExecute (fileString: string, contentString: string) {

        this.contextRecord.level = LogConstants.OK;
        this.contextRecord.event = LogConstants.SCP_EXECUTE.event;
        this.contextRecord.file = fileString;
        this.contextRecord.content = contentString;
        this.contextRecord.message = LogConstants.SCP_EXECUTE.message;
        this.contextRecord.data = fileString;

        this.setEnding (4);

        this.logger.info (this.contextRecord);

    }

    public setScpSuccess (fileString: string) {

        this.contextRecord.level = LogConstants.OK;
        this.contextRecord.event = LogConstants.SCP_SUCCESS.event;
        this.contextRecord.file = fileString;
        delete this.contextRecord.content;
        this.contextRecord.message = LogConstants.SCP_SUCCESS.message;
        this.contextRecord.data = fileString;

        this.setEnding (4);

        this.logger.info (this.contextRecord);

    }

    public setScpPostgres () {

        this.contextRecord.level = LogConstants.ERR;
        this.contextRecord.event = LogConstants.SCP_POSTGRES.event;
        delete this.contextRecord.file;
        delete this.contextRecord.content;
        this.contextRecord.message = LogConstants.SCP_POSTGRES.message;

        this.setEnding (4);

        this.logger.info (this.contextRecord);

    }

    public setFncExecute (functionString: string, paramsRecord: Record<string, any>) {

        this.contextRecord.level = LogConstants.OK;
        this.contextRecord.event = LogConstants.FNC_EXECUTE.event;
        this.contextRecord.function = functionString;

        if (paramsRecord) {

            this.contextRecord.params = JSON.stringify (paramsRecord);

        }

        this.contextRecord.message = LogConstants.FNC_EXECUTE.message;
        this.contextRecord.data = functionString;

        this.setEnding (4);

        this.logger.info (this.contextRecord);

    }

    public setFncSuccess (functionString: string) {

        this.contextRecord.level = LogConstants.OK;
        this.contextRecord.event = LogConstants.FNC_SUCCESS.event;
        this.contextRecord.function = functionString;
        delete this.contextRecord.params;
        this.contextRecord.message = LogConstants.FNC_SUCCESS.message;
        this.contextRecord.data = functionString;

        this.setEnding (4);

        this.logger.info (this.contextRecord);

    }

    public setFncFunction (functionString: string) {

        this.contextRecord.level = LogConstants.ERR;
        this.contextRecord.event = LogConstants.FNC_FUNCTION.event;
        this.contextRecord.function = functionString;
        this.contextRecord.message = LogConstants.FNC_FUNCTION.message;
        this.contextRecord.data = functionString;

        this.setEnding (4);

        this.logger.error (this.contextRecord);

    }

    public setFncPostgres () {

        this.contextRecord.level = LogConstants.ERR;
        this.contextRecord.event = LogConstants.FNC_POSTGRES.event;
        delete this.contextRecord.function;
        this.contextRecord.message = LogConstants.FNC_POSTGRES.message;

        this.setEnding (4);

        this.logger.info (this.contextRecord);

    }

    public setWsvExecute (verbString: string, hostString: string, headersRecord?: Record<string, any>, queryRecord?: Record<string, any>, bodyRecord?: Record<string, any>) {

        this.contextRecord.level = LogConstants.OK;
        this.contextRecord.event = LogConstants.WSV_EXECUTE.event;
        this.contextRecord.verb = verbString;
        this.contextRecord.host = hostString;

        if (headersRecord) {

            this.contextRecord.headers = CommonsTool.getSafeStringify (headersRecord);

        }

        if (queryRecord) {

            this.contextRecord.query = CommonsTool.getSafeStringify (queryRecord);

        }

        if (bodyRecord) {

            this.contextRecord.body = CommonsTool.getSafeStringify (bodyRecord);

        }

        this.contextRecord.message = LogConstants.WSV_EXECUTE.message;
        this.contextRecord.data = verbString + ' ' + hostString;

        this.setEnding (4);

        this.logger.info (this.contextRecord);

    }

    public setWsvSuccess (verbString: string, hostString: string) {

        this.contextRecord.level = LogConstants.OK;
        this.contextRecord.event = LogConstants.WSV_SUCCESS.event;
        this.contextRecord.verb = verbString;
        this.contextRecord.host = hostString;
        delete this.contextRecord.headers;
        delete this.contextRecord.query;
        delete this.contextRecord.body;
        this.contextRecord.message = LogConstants.WSV_SUCCESS.message;
        this.contextRecord.data = verbString + ' ' + hostString;

        this.setEnding (4);

        this.logger.info (this.contextRecord);

    }

    public setWsvWebservice (hostString: string) {

        this.contextRecord.level = LogConstants.ERR;
        this.contextRecord.host = hostString;

    }

    public setRequest (expressRequest: express.Request): void {

        let urlWithParsedQuery = url.parse (expressRequest.url, true);

        this.contextRecord.verb = expressRequest.method;

        if (urlWithParsedQuery.pathname != null) {

            this.contextRecord.url = urlWithParsedQuery.pathname;

        }

        if (Object.keys (expressRequest.params).length !== 0) {

            const paramsRecord: Record<string, any> = {};

            for (const paramsEntry of Object.entries (expressRequest.params)) {

                paramsRecord [paramsEntry [0]] = paramsEntry [1];

            }

            this.contextRecord.params = paramsRecord;

        }

        if (Object.keys (expressRequest.query).length !== 0) {

            const queryRecord: Record<string, any> = {};

            for (const queryEntry of Object.entries (expressRequest.query)) {

                if (typeof queryEntry [1] === 'string') {

                    queryRecord [queryEntry [0]] = queryEntry [1];

                }

            }

            this.contextRecord.query = queryRecord;

        }

    }

    public getTrace (): Record<string, any> {

        return this.contextRecord;

    }

    public setTrace (traceRecord: Record<string, any>): void {

        this.contextRecord.starting = traceRecord.starting;
        this.contextRecord.transaction = traceRecord.transaction;
        this.contextRecord.depth = Number (traceRecord.depth) + 1;

    }

    public setSoftTrace (traceRecord: Record<string, any>): void {

        this.contextRecord.transaction = traceRecord.transaction;
        this.contextRecord.depth = Number (traceRecord.depth);

    }

    public setHardTrace (traceRecord: Record<string, any>): void {

        this.contextRecord.starting = traceRecord.starting;
        this.contextRecord.transaction = traceRecord.transaction;
        this.contextRecord.depth = Number (traceRecord.depth);
        this.contextRecord.overwrite = false;
        this.contextRecord.class = traceRecord.class;
        this.contextRecord.method = traceRecord.method;

    }

    private getDatetime (date: Date): string {

        let datetimeString = '';
        datetimeString += date.getFullYear ();
        datetimeString += '/';
        datetimeString += (date.getMonth () + 1).toString ().padStart (2, '0');
        datetimeString += '/';
        datetimeString += date.getDate ().toString ().padStart (2, '0');
        datetimeString += ' ';
        datetimeString += date.getHours ().toString ().padStart (2, '0');
        datetimeString += ':';
        datetimeString += date.getMinutes ().toString ().padStart (2, '0');
        datetimeString += ':';
        datetimeString += date.getSeconds ().toString ().padStart (2, '0');
        datetimeString += '.';
        datetimeString += date.getMilliseconds ().toString ().padStart (3, '0');

        return datetimeString;

    }

    private getDifference (endingString: string, startingString: string): string {

        return ((this.getTimestamp (endingString) - this.getTimestamp (startingString)) / 1000).toFixed (3);

    }

    private getId (date: Date): bigint {

        let datetimeNumber = date.getTime ();

        const nanoBigint = hrtime.bigint () % 1_000_000n;

        const currentNumber = Date.now ();

        if (currentNumber !== datetimeNumber) {

            datetimeNumber = currentNumber;

        }

        return (BigInt (datetimeNumber) * 1_000_000n + nanoBigint) / 1000n;

    }

    private getJson (logRecord: Record<string, any>): Record<string, any> {

        return Object.entries (logRecord).reduce ((resultRecord: Record<string, any>, [keyString, valueAny]: [string, any]): Record<string, any> => {

            if (typeof valueAny === 'bigint') {

                resultRecord [keyString] = valueAny.toString ();

            } else if (typeof valueAny === 'object' && valueAny !== null) {

                resultRecord [keyString] = this.getJson (valueAny);

            } else {

                resultRecord [keyString] = valueAny;

            }

            return resultRecord;

        }, {} as Record<string, any>);

    }

    private getLocation (depthNumber: number): string [] {

        const stackStringArray = new Error ().stack?.split ('\n');

        if (!stackStringArray || stackStringArray.length <= 3) {

            return [];

        }

        const regExpMatchArray = stackStringArray [depthNumber].match (/\sat\s(\w+)\.(\w+)/);

        if (!regExpMatchArray) {

            return [];

        }

        const [_, classString, methodString] = regExpMatchArray;

        return [classString, methodString];

    }

    private getPrefix (): string {

        let outputString = '';
        outputString += kleur.magenta (this.contextRecord.transaction);
        outputString += ' [';

        switch (this.contextRecord.level) {

            case LogConstants.OK:

                outputString += kleur.green (this.contextRecord.level + ' ');

                break;

            case LogConstants.NOK:

                outputString += kleur.yellow (this.contextRecord.level);

                break;

            case LogConstants.ERR:

                outputString += kleur.red (this.contextRecord.level);

                break;

            case LogConstants.DBG:

                outputString += kleur.gray (this.contextRecord.level);

                break;

        }

        outputString += '] [';
        outputString += kleur.cyan (this.contextRecord.difference);
        outputString += '] [';
        outputString += kleur.cyan (this.contextRecord.depth);
        outputString += '] ';

        if (this.contextRecord.level === LogConstants.DBG) {

            outputString += '[';
            outputString += kleur.gray (this.contextRecord.phase);
            outputString += '] ';

        }

        outputString += this.contextRecord.class;
        outputString += '.';
        outputString += this.contextRecord.method;

        return outputString;

    }

    private getSuffix (): string {

        let outputString = '';

        switch (this.contextRecord.event) {

            case LogConstants.OK_EXECUTE.event:

                if (this.contextRecord.message) {

                    outputString += ' - ';
                    outputString += this.contextRecord.message;
                    outputString += ': ';
                    outputString += kleur.blue (this.contextRecord.data);

                }

                break;

            case LogConstants.NOK_EXECUTE.event:

                if (this.contextRecord.message) {

                    outputString += ' - ';
                    outputString += this.contextRecord.message;
                    outputString += ': ';
                    outputString += kleur.blue (this.contextRecord.data);

                }

                break;

            case LogConstants.ERR_EXECUTE.event:

                if (this.contextRecord.message) {

                    outputString += ' - ';
                    outputString += this.contextRecord.message;

                }

                if (this.contextRecord.data) {

                    outputString += ': ';
                    outputString += kleur.blue (this.contextRecord.data);

                }

                break;

            case LogConstants.SCP_EXECUTE.event:

                outputString += ' - ';
                outputString += this.contextRecord.message;
                outputString += ': ';
                outputString += kleur.blue (this.contextRecord.data);

                break;

            case LogConstants.SCP_SUCCESS.event:

                outputString += ' - ';
                outputString += this.contextRecord.message;
                outputString += ': ';
                outputString += kleur.blue (this.contextRecord.data);

                break;

            case LogConstants.SCP_POSTGRES.event:

                outputString += ' - ';
                outputString += LogConstants.SCP_POSTGRES.message;
                outputString += ': ';
                outputString += kleur.blue (this.contextRecord.data);

                break;

            case LogConstants.FNC_EXECUTE.event:

                outputString += ' - ';
                outputString += this.contextRecord.message;
                outputString += ': ';
                outputString += kleur.blue (this.contextRecord.data);

                break;

            case LogConstants.FNC_SUCCESS.event:

                outputString += ' - ';
                outputString += this.contextRecord.message;
                outputString += ': ';
                outputString += kleur.blue (this.contextRecord.data);

                break;

            case LogConstants.FNC_FUNCTION.event:

                outputString += ' - ';
                outputString += LogConstants.FNC_FUNCTION.message;
                outputString += ': ';
                outputString += kleur.blue (this.contextRecord.data);

                break;

            case LogConstants.FNC_POSTGRES.event:

                outputString += ' - ';
                outputString += LogConstants.FNC_POSTGRES.message;
                outputString += ': ';
                outputString += kleur.blue (this.contextRecord.data);

                break;

            case LogConstants.WSV_EXECUTE.event:

                outputString += ' - ';
                outputString += LogConstants.WSV_EXECUTE.message;
                outputString += ': ';
                outputString += kleur.blue (this.contextRecord.data);

                break;

            case LogConstants.WSV_SUCCESS.event:

                outputString += ' - ';
                outputString += LogConstants.WSV_SUCCESS.message;
                outputString += ': ';
                outputString += kleur.blue (this.contextRecord.data);

                break;

        }

        return outputString;

    }

    private getTimestamp (datetimeString: string): number {

        const [date, time] = datetimeString.split (' ');
        const [yy, mm, dd] = date.split ('/').map (Number);
        const [hms, ms] = time.split ('.');
        const [hh, mi, ss] = hms.split (':').map (Number);
        const zz = Number (ms);

        return new Date (yy, mm - 1, dd, hh, mi, ss, zz).getTime ();

    }

    private getUuid (): string {

        return uuidv4 ().replace (/-/g, '');

    }

    private setEnding (depthNumber: number) {

        const locationStringArray: string [] = this.getLocation (depthNumber);

        const date = new Date ();

        this.contextRecord.ending = this.getDatetime (date);
        this.contextRecord._id = this.getId (date);
        this.contextRecord.operation = this.getUuid ();
        this.contextRecord.difference = this.getDifference (this.contextRecord.ending, this.contextRecord.starting);

        if (this.contextRecord.overwrite === true) {

            this.contextRecord.class = locationStringArray [0];
            this.contextRecord.method = locationStringArray [1];

        }

    }

}