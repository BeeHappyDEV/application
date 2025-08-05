export class ResultObject {

    private resultObject: Record<string, any> = {};

    public getContain (): Record<string, any> {

        return this.resultObject;

    }

    public getElement (keyString: string) {

        return this.resultObject [keyString];

    }

    public getElements (keyArray: any) {

        let resultObject = this.resultObject;

        for (let keyString of keyArray) {

            resultObject = resultObject [keyString];

        }

        return resultObject;

    }

    public getNumException (): any {

        return this.resultObject.status.num_exception;

    }

    public getTxtException (): any {

        return this.resultObject.status.txt_exception;

    }

    public getOutgoing (): any {

        return this.resultObject.outgoing;

    }

    public getRedirect (): any {

        return this.resultObject.outgoing.txt_redirect;

    }

    public getRender (): any {

        return this.resultObject.outgoing.txt_render;

    }

    public hasOutgoing (): boolean {

        return this.resultObject.outgoing != null;

    }

    public setElement (keyString: string, valueObject: object) {

        this.resultObject [keyString] = valueObject;

    }

    public setException (resultObject: Record<string, any>): void {

        if (!this.resultObject.status) {

            this.resultObject.status = {};

        }

        this.resultObject.status.num_exception = resultObject.num_exception;
        this.resultObject.status.txt_exception = resultObject.txt_exception;

    }

    public setObject (resultObject: Record<string, any>): void {

        this.resultObject = resultObject;

    }

    public setPath (valueString: string): void {

        if (!this.resultObject.outgoing) {

            this.resultObject.outgoing = {};

        }

        this.resultObject.outgoing.txt_path = valueString;

    }

    public setRedirect (valueString: string): any {

        if (!this.resultObject.outgoing) {

            this.resultObject.outgoing = {};

        }

        this.resultObject.outgoing.txt_redirect = valueString;

    }

    public setRename (oldString: string, newString: string) {

        let resultObject = JSON.stringify (this.resultObject, null, 0);
        resultObject = resultObject.replaceAll (oldString, newString);

        this.resultObject = JSON.parse (resultObject);

    }

    public setRender (valueString: String): void {

        if (!this.resultObject.outgoing) {

            this.resultObject.outgoing = {};

        }

        if (this.resultObject.outgoing.txt_version == null) {

            this.resultObject.outgoing.txt_render = 'error/index.ejs';
            this.resultObject.outgoing.txt_version = '1.0.0';

        } else {

            this.resultObject.outgoing.txt_render = valueString.trim ().split ('/') [0];

        }

    }

    public setResult (resultObject: Record<string, any>): void {

        this.resultObject = resultObject.resultObject;

    }

    public setVersion (valueString: string): void {

        if (!this.resultObject.outgoing) {

            this.resultObject.outgoing = {};

        }

        this.resultObject.outgoing.txt_version = valueString;

    }

    public setWebsite (valueString: string): void {

        if (!this.resultObject.outgoing) {

            this.resultObject.outgoing = {};

        }

        this.resultObject.outgoing.txt_website = valueString;

    }


    /*
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

    public getCarry () {

        if (!this.resultObject.status || Object.keys (this.resultObject.status).length === 0) {

            return false;

        } else {

            return this.resultObject.status ['sys_carry'];

        }

    }



    public getStatus () {

        return this.resultObject.outgoing ['status'];

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
*/
}