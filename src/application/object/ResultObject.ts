import superagent from "superagent";

import {JsonObject} from "@object/JsonObject";

export class ResultObject {

    private resultObject: any;

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

        if (typeof keyArray === "string") {

            return this.resultObject [keyArray.toString ()];

        }

        let resultObject = this.resultObject;

        for (let keyString of keyArray) {

            resultObject = resultObject [keyString];

        }

        return resultObject;

    }

    public set (keyString: String, valueString: Object) {

        this.resultObject [keyString.toString ()] = valueString;

    }

    public rename (oldString: String, newString: String) {

        let resultObject = JSON.stringify (this.resultObject, null, 0);
        resultObject = resultObject.replaceAll (oldString.toString (), newString.toString ());

        this.resultObject = JSON.parse (resultObject);

    }

    public setPath (valueString: String) {

        if (!this.resultObject.outgoing) {

            this.resultObject.outgoing = {};

        }

        this.resultObject.outgoing ["txt_path"] = valueString.trim ();

    }

    public setVersion (valueString: String) {

        if (!this.resultObject.outgoing) {

            this.resultObject.outgoing = {};

        }

        this.resultObject.outgoing ["txt_version"] = valueString.trim ();

    }

    public setWebsite (valueString: String) {

        if (!this.resultObject.outgoing) {

            this.resultObject.outgoing = {};

        }

        this.resultObject.outgoing ["txt_website"] = valueString.trim ();

    }

    public getCarry () {

        return this.resultObject.status ["sys_carry"];

    }

    public getOutgoing () {

        return this.resultObject ["outgoing"];

    }

    public getRedirect () {

        return this.resultObject.outgoing ["txt_redirect"];

    }

    public getRender () {

        return this.resultObject.outgoing ["txt_render"];

    }

    public getStatus () {

        return this.resultObject.outgoing ["status"];

    }

    public hasOutgoing () {

        return this.resultObject.outgoing != null;

    }

    public setRedirect (valueString: String) {

        if (!this.resultObject.outgoing) {

            this.resultObject.outgoing = {};

        }

        this.resultObject.outgoing ["txt_redirect"] = valueString.trim ();

    }

    public setRender (valueString: String) {

        if (!this.resultObject.outgoing) {

            this.resultObject.outgoing = {};

        }

        if (this.resultObject.outgoing ["txt_version"] == null) {

            this.resultObject.outgoing ["txt_render"] = "error/index.ejs";
            this.resultObject.outgoing ["txt_version"] = "1.0.0";

        } else {

            this.resultObject.outgoing ["txt_render"] = valueString.trim ().split ("/") [0];

        }

    }

    public setServiceObject (paramsObject: JsonObject | null, serviceObject: superagent.Response) {

        if (paramsObject !== null) {

            this.resultObject = {
                incoming: paramsObject.all (),
                outgoing: JSON.parse (serviceObject.text),
                status: {
                    sys_result: 0,
                    sys_message: "OK"
                }
            }

        } else {

            this.resultObject = {
                outgoing: JSON.parse (serviceObject.text),
                status: {
                    sys_result: 0,
                    sys_message: "OK"
                }
            }

        }

    }

    public setServiceException () {

        this.resultObject = {
            status: {
                sys_result: 200,
                sys_message: "Service Exception"
            }
        }

    }

    public setWebsocket (valueString: String) {

        this.resultObject.outgoing ["txt_websocket"] = valueString.trim ();

    }

    public result (jsonObject: JsonObject) {

        this.resultObject = jsonObject;

    }

}