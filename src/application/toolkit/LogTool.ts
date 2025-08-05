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

    private context: Record<string, any> = {};
    private logger: pino.Logger;

    constructor (
        @inject (MongoDbModule) private mongoDbModule: MongoDbModule
    ) {

        const date = new Date ();

        this.context.starting = this.getDatetime (date);
        this.context.transaction = this.getUuid ();
        this.context.environment = process.argv [2].slice (2).toUpperCase ();
        this.context.depth = 1;
        this.context.overwrite = true;

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

                const logObject = this.getJson (this.context);

                await this.mongoDbModule.insertTracking (logObject);

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

        this.context.level = LogConstants.OK;
        this.context.event = LogConstants.OK_EXECUTE.event;

        if (keyString) {

            this.context.message = keyString;

        }

        if (valueString) {

            this.context.data = valueString;

        }

        this.setEnding (4);

        this.logger.info (this.context);

    }

    public NOK (keyString?: any, valueString?: string): void {

        this.context.level = LogConstants.NOK;
        this.context.event = LogConstants.NOK_EXECUTE.event;

        if (keyString) {

            this.context.message = keyString;

        }

        if (valueString) {

            this.context.data = valueString;

        }

        this.setEnding (4);

        this.logger.info (this.context);

    }

    public ERR (keyString?: any, valueString?: string): void {

        this.context.level = LogConstants.ERR;
        this.context.event = LogConstants.ERR_EXECUTE.event;

        if (keyString) {

            this.context.message = keyString;

        }

        if (valueString) {

            this.context.data = valueString;

        }

        this.setEnding (4);

        this.logger.info (this.context);

    }

    public INITIALIZE (): void {

        this.context.level = LogConstants.DBG;
        this.context.event = LogConstants.DBG_INITIALIZE.event;
        this.context.phase = LogConstants.DBG_INITIALIZE.message;

        this.setEnding (4);

        this.logger.info (this.context);

    }

    public FINALIZE (): void {

        this.context.level = LogConstants.DBG;
        this.context.event = LogConstants.DBG_FINALIZE.event;
        this.context.phase = LogConstants.DBG_FINALIZE.message;

        this.setEnding (4);

        this.logger.info (this.context);

    }

    /*
    *
    *
    *
    *
    *
    */

    public setScpExecute (fileString: string, contentString: string) {

        this.context.level = LogConstants.OK;
        this.context.event = LogConstants.SCP_EXECUTE.event;
        this.context.file = fileString;
        this.context.content = contentString;
        this.context.message = LogConstants.SCP_EXECUTE.message;
        this.context.data = fileString;

        this.setEnding (4);

        this.logger.info (this.context);

    }

    public setScpSuccess (fileString: string) {

        this.context.level = LogConstants.OK;
        this.context.event = LogConstants.SCP_SUCCESS.event;
        this.context.file = fileString;
        delete this.context.content;
        this.context.message = LogConstants.SCP_SUCCESS.message;
        this.context.data = fileString;

        this.setEnding (4);

        this.logger.info (this.context);

    }

    public setScpPostgres () {

        this.context.level = LogConstants.ERR;
        this.context.event = LogConstants.SCP_POSTGRES.event;
        delete this.context.file;
        delete this.context.content;
        this.context.message = LogConstants.SCP_POSTGRES.message;

        this.setEnding (4);

        this.logger.info (this.context);

    }

    public setFncExecute (functionString: string, paramsObject: Record<string, any>) {

        this.context.level = LogConstants.OK;
        this.context.event = LogConstants.FNC_EXECUTE.event;
        this.context.function = functionString;

        if (paramsObject) {

            this.context.params = JSON.stringify (paramsObject);

        }

        this.context.message = LogConstants.FNC_EXECUTE.message;
        this.context.data = functionString;

        this.setEnding (4);

        this.logger.info (this.context);

    }

    public setFncSuccess (functionString: string) {

        this.context.level = LogConstants.OK;
        this.context.event = LogConstants.FNC_SUCCESS.event;
        this.context.function = functionString;
        delete this.context.params;
        this.context.message = LogConstants.FNC_SUCCESS.message;
        this.context.data = functionString;

        this.setEnding (4);

        this.logger.info (this.context);

    }

    public setFncFunction (functionString: string) {

        this.context.level = LogConstants.ERR;
        this.context.event = LogConstants.FNC_FUNCTION.event;
        this.context.function = functionString;
        this.context.message = LogConstants.FNC_FUNCTION.message;
        this.context.data = functionString;

        this.setEnding (4);

        this.logger.error (this.context);

    }

    public setFncPostgres () {

        this.context.level = LogConstants.ERR;
        this.context.event = LogConstants.FNC_POSTGRES.event;
        delete this.context.function;
        this.context.message = LogConstants.FNC_POSTGRES.message;

        this.setEnding (4);

        this.logger.info (this.context);

    }

    public setWsvExecute (verbString: string, hostString: string, headersObject?: Record<string, any>, queryObject?: Record<string, any>, bodyObject?: Record<string, any>) {

        this.context.level = LogConstants.OK;
        this.context.event = LogConstants.WSV_EXECUTE.event;
        this.context.verb = verbString;
        this.context.host = hostString;

        if (headersObject) {

            this.context.headers = CommonsTool.getSafeStringify (headersObject);

        }

        if (queryObject) {

            this.context.query = CommonsTool.getSafeStringify (queryObject);

        }

        if (bodyObject) {

            this.context.body = CommonsTool.getSafeStringify (bodyObject);

        }

        this.context.message = LogConstants.WSV_EXECUTE.message;
        this.context.data = verbString + ' ' + hostString;

        this.setEnding (4);

        this.logger.info (this.context);

    }

    public setWsvSuccess (verbString: string, hostString: string) {

        this.context.level = LogConstants.OK;
        this.context.event = LogConstants.WSV_SUCCESS.event;
        this.context.verb = verbString;
        this.context.host = hostString;
        delete this.context.headers;
        delete this.context.query;
        delete this.context.body;
        this.context.message = LogConstants.WSV_SUCCESS.message;
        this.context.data = verbString + ' ' + hostString;

        this.setEnding (4);

        this.logger.info (this.context);

    }

    public setWsvWebservice (hostString: string) {

        this.context.level = LogConstants.ERR;
        this.context.host = hostString;

    }

    /*
    *
    *
    *
    *
    *
    *
    *
    *
    *
    *
    *
    *
    */

    public setRequest (expressRequest: express.Request): void {

        let urlWithParsedQuery = url.parse (expressRequest.url, true);

        this.context.verb = expressRequest.method;

        if (urlWithParsedQuery.pathname != null) {

            this.context.url = urlWithParsedQuery.pathname;

        }

        if (Object.keys (expressRequest.params).length !== 0) {

            const paramsObject: { [key: string]: string } = {};

            for (const [keyString, valueString] of Object.entries (expressRequest.params)) {

                paramsObject [keyString] = valueString;

            }

            this.context.params = paramsObject;

        }

        if (Object.keys (expressRequest.query).length !== 0) {

            const queryObject: { [key: string]: string } = {};

            for (const [keyString, valueString] of Object.entries (expressRequest.query)) {

                if (typeof valueString === 'string') {

                    queryObject [keyString] = valueString;

                }

            }

            this.context.query = queryObject;

        }

    }

    /*
    *
    *
    *
    *
    *
    *
    *
    *
    *
    *
    *
    *
    */

    public getTrace (): Record<string, any> {

        return this.context;

    }

    public setTrace (traceObject: Record<string, any>): void {

        this.context.starting = traceObject.starting;
        this.context.transaction = traceObject.transaction;
        this.context.depth = Number (traceObject.depth) + 1;

    }

    public setSoftTrace (traceObject: Record<string, any>): void {

        this.context.transaction = traceObject.transaction;
        this.context.depth = Number (traceObject.depth);

    }

    public setHardTrace (traceObject: Record<string, any>): void {

        this.context.starting = traceObject.starting;
        this.context.transaction = traceObject.transaction;
        this.context.depth = Number (traceObject.depth);
        this.context.overwrite = false;
        this.context.class = traceObject.class;
        this.context.method = traceObject.method;

    }

    /*
    *
    *
    *
    *
    *
    */

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

    private getJson (logObject: Record<string, any>): Record<string, any> {

        return Object.entries (logObject).reduce ((recordStringAny: Record<string, any>, [keyString, valueAny]: [string, any]): Record<string, any> => {

            if (typeof valueAny === 'bigint') {

                recordStringAny [keyString] = valueAny.toString ();

            } else if (typeof valueAny === 'object' && valueAny !== null) {

                recordStringAny [keyString] = this.getJson (valueAny);

            } else {

                recordStringAny[keyString] = valueAny;

            }

            return recordStringAny;

        }, {} as Record<string, any>);

    }

    private getLocation (depthNumber: number): string[] {

        const stackString = new Error ().stack?.split ('\n');

        if (!stackString || stackString.length <= 3) {

            return [];

        }

        const regExpMatchArray = stackString [depthNumber].match (/\sat\s(\w+)\.(\w+)/);

        if (!regExpMatchArray) {

            return [];

        }

        const [_, classString, methodString] = regExpMatchArray;

        return [classString, methodString];

    }

    private getPrefix (): string {

        let outputString = '';
        outputString += kleur.magenta (this.context.transaction);
        outputString += ' [';

        switch (this.context.level) {

            case LogConstants.OK:

                outputString += kleur.green (this.context.level + ' ');

                break;

            case LogConstants.NOK:

                outputString += kleur.yellow (this.context.level);

                break;

            case LogConstants.ERR:

                outputString += kleur.red (this.context.level);

                break;

            case LogConstants.DBG:

                outputString += kleur.gray (this.context.level);

                break;

        }

        outputString += '] [';
        outputString += kleur.cyan (this.context.difference);
        outputString += '] [';
        outputString += kleur.cyan (this.context.depth);
        outputString += '] ';

        if (this.context.level === LogConstants.DBG) {

            outputString += '[';
            outputString += kleur.gray (this.context.phase);
            outputString += '] ';

        }

        outputString += this.context.class;
        outputString += '.';
        outputString += this.context.method;

        return outputString;

    }

    private getSuffix (): string {

        let outputString = '';

        switch (this.context.event) {

            case LogConstants.OK_EXECUTE.event:

                if (this.context.message) {

                    outputString += ' - ';
                    outputString += this.context.message;
                    outputString += ': ';
                    outputString += kleur.blue (this.context.data);

                }

                break;

            case LogConstants.NOK_EXECUTE.event:

                if (this.context.message) {

                    outputString += ' - ';
                    outputString += this.context.message;
                    outputString += ': ';
                    outputString += kleur.blue (this.context.data);

                }

                break;

            case LogConstants.ERR_EXECUTE.event:

                if (this.context.message) {

                    outputString += ' - ';
                    outputString += this.context.message;

                }

                if (this.context.data) {

                    outputString += ': ';
                    outputString += kleur.blue (this.context.data);

                }

                break;

            case LogConstants.SCP_EXECUTE.event:

                outputString += ' - ';
                outputString += this.context.message;
                outputString += ': ';
                outputString += kleur.blue (this.context.data);

                break;

            case LogConstants.SCP_SUCCESS.event:

                outputString += ' - ';
                outputString += this.context.message;
                outputString += ': ';
                outputString += kleur.blue (this.context.data);

                break;

            case LogConstants.SCP_POSTGRES.event:

                outputString += ' - ';
                outputString += LogConstants.SCP_POSTGRES.message;
                outputString += ': ';
                outputString += kleur.blue (this.context.data);

                break;

            case LogConstants.FNC_EXECUTE.event:

                outputString += ' - ';
                outputString += this.context.message;
                outputString += ': ';
                outputString += kleur.blue (this.context.data);

                break;

            case LogConstants.FNC_SUCCESS.event:

                outputString += ' - ';
                outputString += this.context.message;
                outputString += ': ';
                outputString += kleur.blue (this.context.data);

                break;

            case LogConstants.FNC_FUNCTION.event:

                outputString += ' - ';
                outputString += LogConstants.FNC_FUNCTION.message;
                outputString += ': ';
                outputString += kleur.blue (this.context.data);

                break;

            case LogConstants.FNC_POSTGRES.event:

                outputString += ' - ';
                outputString += LogConstants.FNC_POSTGRES.message;
                outputString += ': ';
                outputString += kleur.blue (this.context.data);

                break;

            case LogConstants.WSV_EXECUTE.event:

                outputString += ' - ';
                outputString += LogConstants.WSV_EXECUTE.message;
                outputString += ': ';
                outputString += kleur.blue (this.context.data);

                break;

            case LogConstants.WSV_SUCCESS.event:

                outputString += ' - ';
                outputString += LogConstants.WSV_SUCCESS.message;
                outputString += ': ';
                outputString += kleur.blue (this.context.data);

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

        this.context.ending = this.getDatetime (date);
        this.context._id = this.getId (date);
        this.context.operation = this.getUuid ();
        this.context.difference = this.getDifference (this.context.ending, this.context.starting);

        if (this.context.overwrite === true) {

            this.context.class = locationStringArray [0];
            this.context.method = locationStringArray [1];

        }

    }

}