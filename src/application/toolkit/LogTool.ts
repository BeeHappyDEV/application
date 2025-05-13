import {container, inject, injectable} from 'tsyringe';

import crypto from 'crypto';
import express from 'express';
import kleur from 'kleur';
import url from 'url';

import {MongoDbModule} from '../middleware/MongoDbModule';
import {PropertiesModule} from '../middleware/PropertiesModule';
import {JsonObject} from '../object/JsonObject';
import {ResultObject} from '../object/ResultObject';

@injectable ()
export class LogTool {

    private logObject: any = null;

    constructor (
        @inject (MongoDbModule) private mongoDbModule: MongoDbModule,
        @inject (PropertiesModule) private propertiesModule: PropertiesModule
    ) {
    }

    public initialize (stackStrings: string[], traceObject: JsonObject | null = null, depthNumber?: number): void {

        if (traceObject === null) {

            this.logObject = container.resolve (JsonObject);

        } else {

            this.logObject = traceObject;

        }

        this.logObject.set ('exception', false);
        this.logObject.set ('carry', false);
        this.logObject.set ('starting', Date.now ());
        this.logObject.set ('offset', crypto.randomUUID ().split ('-').join (''));
        this.logObject.set ('class', stackStrings [0]);
        this.logObject.set ('method', stackStrings [1]);

        switch (stackStrings [2]) {

            case 'frontend':
            case 'backend':
            case 'schedule':

                this.logObject.set ('source', stackStrings [2]);

                break;

            case 'launcher':

                this.logObject.set ('source', 'start');

                break;

            default:

                this.logObject.set ('source', 'tool');

        }

        if (traceObject === null) {

            this.logObject.set ('depth', 1);
            this.logObject.set ('thread', crypto.randomUUID ().split ('-').join (''));

        } else {

            if (depthNumber !== null && depthNumber !== undefined) {

                this.logObject.set ('depth', depthNumber);

            } else {

                if (this.logObject.get ('depth') === null) {

                    this.logObject.set ('depth', 1);

                } else {

                    this.logObject.set ('depth', Number (Number (traceObject.get ('depth')) + 1));

                }

            }

        }

    }

    public contextualize (expressRequest: typeof express.request): void {

        if (Object.keys (expressRequest.query).length !== 0) {

            let depthNumber = Number (expressRequest.query ['depth']);

            this.logObject.set ('depth', depthNumber + 1);
            this.logObject.set ('thread', expressRequest.query ['thread'] || {});

        }

    }

    public request (expressRequest: typeof express.request) {

        let urlObject = url.parse (expressRequest.url, true);

        this.logObject.set ('verb', expressRequest.method);

        if (urlObject.pathname != null) {

            this.logObject.set ('url', urlObject.pathname);

        }

        if (Object.keys (urlObject.query).length > 0) {

            this.logObject.set ('query', urlObject.query);

        }

        if (Object.keys (expressRequest.params).length !== 0) {

            let arrayObject = [];

            for (let [keyString, valueString] of Object.entries (expressRequest.params)) {

                arrayObject.push ({
                    key: keyString,
                    value: valueString
                });

            }

            this.logObject.set ('params', arrayObject);

        }

    }

    public response (resultObject: ResultObject): void {

        if (resultObject.getCarry () == true) {

            this.logObject.set ('carry', true);

        } else {

            this.logObject.set ('carry', false);

        }

        if (resultObject.hasOutgoing ()) {

            let redirectString = resultObject.getRedirect ();
            let renderString = resultObject.getRender ();
            let statusString = resultObject.getStatus ();

            if (redirectString != null) {

                this.logObject.set ('redirect', redirectString);

            }

            if (renderString != null) {

                this.logObject.set ('render', renderString);

            }

            if (redirectString == null && renderString == null) {

                this.logObject.set ('status', statusString);

            }

        }

    }

    public resource (resourceString: string): void {

        this.logObject.set ('resource', resourceString);

    }

    public exception (): void {

        this.logObject.set ('carry', true);
        this.logObject.set ('exception', true);

    }

    public comment (commentString: string, highlightString: string, exceptionBoolean?: boolean): void {

        if (exceptionBoolean) {

            this.logObject.set ('carry', true);

        }

        this.logObject.set ('comment', commentString);
        this.logObject.set ('highlight', highlightString);

    }

    public trace (): JsonObject {

        let traceObject = container.resolve (JsonObject);

        traceObject.set ('thread', this.logObject.get ('thread'));
        traceObject.set ('depth', this.logObject.get ('depth'));
        traceObject.set ('method', this.logObject.get ('method'));

        return traceObject;

    }

    public finalize (): void {

        this.logObject.set ('ending', Date.now ());
        this.logObject.set ('interval', ((new Date (this.logObject.get ('ending')).getTime () - new Date (this.logObject.get ('starting')).getTime ()) / 1000).toFixed (3));

        let startingString = this.logObject.get ('starting');

        let startingDate: Date;

        if (startingString instanceof Date) {

            startingDate = startingString;

        } else if (typeof startingString === 'number') {

            startingDate = new Date (startingString);

        } else if (typeof startingString === 'string') {

            startingDate = new Date (startingString.includes ('T') ? startingString : startingString.replace (' ', 'T'));

        } else {

            throw new Error ();

        }

        const yyStartingString = String (startingDate.getFullYear ());
        const mmStartingString = String (startingDate.getMonth () + 1).padStart (2, '0');
        const ddStartingString = String (startingDate.getDate ()).padStart (2, '0');
        const hhStartingString = String (startingDate.getHours ()).padStart (2, '0');
        const miStartingString = String (startingDate.getMinutes ()).padStart (2, '0');
        const ssStartingString = String (startingDate.getSeconds ()).padStart (2, '0');
        const msStartingString = String (startingDate.getMilliseconds ()).padStart (3, '0');

        startingString = '';
        startingString = startingString + yyStartingString + '-';
        startingString = startingString + mmStartingString + '-';
        startingString = startingString + ddStartingString + ' ';
        startingString = startingString + hhStartingString + ':';
        startingString = startingString + miStartingString + ':';
        startingString = startingString + ssStartingString + '.';
        startingString = startingString + msStartingString;

        this.logObject.set ('starting', startingString);

        let endingString = this.logObject.get ('ending');

        let endingDate: Date;

        if (endingString instanceof Date) {

            endingDate = endingString;

        } else if (typeof endingString === 'number') {

            endingDate = new Date (endingString);

        } else if (typeof endingString === 'string') {

            endingDate = new Date (endingString.includes ('T') ? endingString : endingString.replace (' ', 'T'));

        } else {

            throw new Error ();

        }

        const yyEndingString = String (endingDate.getFullYear ());
        const mmEndingString = String (endingDate.getMonth () + 1).padStart (2, '0');
        const ddEndingString = String (endingDate.getDate ()).padStart (2, '0');
        const hhEndingString = String (endingDate.getHours ()).padStart (2, '0');
        const miEndingString = String (endingDate.getMinutes ()).padStart (2, '0');
        const ssEndingString = String (endingDate.getSeconds ()).padStart (2, '0');
        const msEndingString = String (endingDate.getMilliseconds ()).padStart (3, '0');

        endingString = '';
        endingString = endingString + yyEndingString + '-';
        endingString = endingString + mmEndingString + '-';
        endingString = endingString + ddEndingString + ' ';
        endingString = endingString + hhEndingString + ':';
        endingString = endingString + miEndingString + ':';
        endingString = endingString + ssEndingString + '.';
        endingString = endingString + msEndingString;

        this.logObject.set ('ending', endingString);

        let captionString = '';
        captionString = captionString + kleur.magenta (this.logObject.get ('thread')) + ' [';

        if (this.logObject.get ('exception')) {

            this.logObject.set ('status', 'ERR');

            captionString = captionString + kleur.red ('ERR') + '] [';

        } else {

            if (this.logObject.get ('carry') == true) {

                this.logObject.set ('status', 'NOK');

                captionString = captionString + kleur.yellow ('NOK') + '] [';

            } else {

                this.logObject.set ('status', 'OK');

                captionString = captionString + kleur.green ('OK ') + '] [';

            }

        }

        this.logObject.del ('carry');
        this.logObject.del ('exception');

        captionString = captionString + kleur.cyan (this.logObject.get ('interval')) + '] [';
        captionString = captionString + kleur.cyan (this.logObject.get ('depth')) + '] ';
        captionString = captionString + this.logObject.get ('class') + '.';
        captionString = captionString + this.logObject.get ('method');

        let continueBoolean = true;

        if (this.logObject.get ('comment') != null || this.logObject.get ('highlight') != null) {

            captionString = captionString + ' - ' + (this.logObject.get ('comment') + ' ' + kleur.blue (this.logObject.get ('highlight')).trim ());

            continueBoolean = false;

        }

        if (continueBoolean) {

            if (this.logObject.get ('class').endsWith ('Controller')) {

                if (this.logObject.get ('params') != null) {

                    let paramsString = '{';

                    for (const paramObject of this.logObject.get ('params')) {

                        paramsString = paramsString + paramObject.key + ': ';
                        paramsString = paramsString + paramObject.value + ', ';

                    }

                    paramsString = paramsString.slice (0, paramsString.length - 2);
                    paramsString = paramsString + '}';

                    captionString = captionString + ' - Params: ' + kleur.blue (paramsString);

                }

                if (this.logObject.get ('redirect') != null) {

                    captionString = captionString + ' - Redirect: ' + kleur.blue (this.logObject.get ('redirect'));

                }

                if (this.logObject.get ('render') != null) {

                    captionString = captionString + ' - View: ' + kleur.blue (this.logObject.get ('render'));

                }

                if (this.logObject.get ('redirect') == null && this.logObject.get ('render') == null) {

                    let outgoingString = JSON.stringify (this.logObject.get ('outgoing'));

                    if (outgoingString == null) {

                        outgoingString = 'void';

                    }

                    captionString = captionString + ' - Return: ' + kleur.blue (outgoingString);

                }

            }

            if (this.logObject.get ('class').endsWith ('PostgresModule')) {

                if (this.logObject.get ('resource') != null) {

                    captionString = captionString + ' - Function: ' + kleur.blue (this.logObject.get ('resource'));

                }

            }

            if (this.logObject.get ('class').endsWith ('WebserviceModule')) {

                captionString = captionString + ' - Endpoint: ' + kleur.blue (this.logObject.get ('resource'));

            }

        }

        this.logObject.set ('interval', parseFloat (this.logObject.get ('interval')));

        console.log (captionString);

        if (Boolean (this.propertiesModule.get ('system.log.persist'))) {

            this.mongoDbModule.insertTrace (this.logObject).then ();

        }

    }

}