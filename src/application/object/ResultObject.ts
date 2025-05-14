import superagent from 'superagent';

import {JsonObject} from 'src/application/object/JsonObject';

export class ResultObject {

    private resultObject: any = null;

    public constructor () {

        this.resultObject = {
            incoming: null,
            outgoing: null,
            status: null
        }

    }

    public all () {

        return this.resultObject;

    }

    public get (keyArray: any) {

        if (typeof keyArray === 'string') {

            return this.resultObject [keyArray.toString ()];

        }

        let resultObject = this.resultObject;

        for (let keyString of keyArray) {

            resultObject = resultObject [keyString];

        }

        return resultObject;

    }

    public set (keyString: string, valueString: object) {

        this.resultObject [keyString] = valueString;

    }

    public rename (oldString: string, newString: string) {

        let resultObject = JSON.stringify (this.resultObject, null, 0);
        resultObject = resultObject.replaceAll (oldString, newString);

        this.resultObject = JSON.parse (resultObject);

    }

    public setPath (valueString: string) {

        if (!this.resultObject.outgoing) {

            this.resultObject.outgoing = {};

        }

        this.resultObject.outgoing ['txt_path'] = valueString;

    }

    public setVersion (valueString: string) {

        if (!this.resultObject.outgoing) {

            this.resultObject.outgoing = {};

        }

        this.resultObject.outgoing ['txt_version'] = valueString;

    }

    public setWebsite (valueString: string) {

        if (!this.resultObject.outgoing) {

            this.resultObject.outgoing = {};

        }

        this.resultObject.outgoing ['txt_website'] = valueString;

    }

    public getCarry () {

        if (!this.resultObject.status || Object.keys (this.resultObject.status).length === 0) {

            return false;

        } else {

            return this.resultObject.status ['sys_carry'];

        }

    }

    public getOutgoing () {

        return this.resultObject ['outgoing'];

    }

    public getRedirect () {

        return this.resultObject.outgoing ['txt_redirect'];

    }

    public getRender () {

        return this.resultObject.outgoing ['txt_render'];

    }

    public getStatus () {

        return this.resultObject.outgoing ['status'];

    }

    public hasOutgoing () {

        return this.resultObject.outgoing != null;

    }

    public setRedirect (valueString: string) {

        if (!this.resultObject.outgoing) {

            this.resultObject.outgoing = {};

        }

        this.resultObject.outgoing ['txt_redirect'] = valueString;

    }

    public setRender (valueString: String) {

        if (!this.resultObject.outgoing) {

            this.resultObject.outgoing = {};

        }

        if (this.resultObject.outgoing ['txt_version'] == null) {

            this.resultObject.outgoing ['txt_render'] = 'error/index.ejs';
            this.resultObject.outgoing ['txt_version'] = '1.0.0';

        } else {

            this.resultObject.outgoing ['txt_render'] = valueString.trim ().split ('/') [0];

        }

    }

    public setServiceObject (paramsObject: JsonObject | null, serviceObject: superagent.Response) {

        if (paramsObject !== null) {

            this.resultObject = {
                incoming: paramsObject.all (),
                outgoing: JSON.parse (serviceObject.text),
                status: {
                    sys_result: 0,
                    sys_message: 'OK'
                }
            }

        } else {

            this.resultObject = {
                outgoing: JSON.parse (serviceObject.text),
                status: {
                    sys_result: 0,
                    sys_message: 'OK'
                }
            }

        }

    }

    public setWebsocket (valueString: String) {

        this.resultObject.outgoing ['txt_websocket'] = valueString.trim ();

    }

    public setResult (jsonObject: JsonObject) {

        this.resultObject = jsonObject;

    }

}