import {container, inject, singleton} from 'tsyringe';

import {JsonObject} from '../object/JsonObject';
import {ResultObject} from '../object/ResultObject';
import {WebserviceModule} from "./WebserviceModule";
import {CommonsTool} from "../toolkit/CommonsTool";
import {ExceptionTool} from "../toolkit/ExceptionTool";
//import {PropertiesTool} from "../toolkit/PropertiesTool";

@singleton ()
export class Auth0Module {

    constructor (
        @inject (WebserviceModule) private webserviceModule: WebserviceModule
        //@inject (PropertiesTool) private propertiesTool: PropertiesTool
    ) {
    }

    public async test (): Promise<ResultObject> {

        const stackStrings = await CommonsTool.getStackStrings ();

        const headersObject = container.resolve (JsonObject);
        headersObject.set ('content-type', 'application/json');

        const bodyObject = container.resolve (JsonObject);
        bodyObject.set ('client_id', '7QMq4WvuXvz9Yzomz4yfUaHATM4ElAUR');
        bodyObject.set ('client_secret', 'noybo0dKQtflkVr_IzA6WGDUZ15jGqLrih-EqS69wrq2mVD5kQj_UNgRiOQpHRxX');
        bodyObject.set ('audience', 'https://beehappydev.us.auth0.com/api/v2/');
        bodyObject.set ('grant_type', 'client_credentials');

        const resultObject = container.resolve (ResultObject);

        try {

            let resultObject = await this.webserviceModule.post ('https://beehappydev.us.auth0.com/oauth/token', headersObject, null, bodyObject, new JsonObject());

            let tokenString = resultObject.getOutgoing () ['access_token'];

            headersObject.set ('authorization', 'Bearer ' + tokenString);

            resultObject = await this.webserviceModule.get ('https://beehappydev.us.auth0.com/api/v2/users-by-email?email=56991220195111@user.beehappy.dev', headersObject, null, null, new JsonObject());
            console.log(resultObject.getOutgoing());

            //resultObject.setResult (ExceptionTool.SUCCESSFUL ());

        } catch (exception) {

            resultObject.setResult (ExceptionTool.APPLICATION_EXCEPTION (stackStrings));

        }

        return resultObject;

        /*
                const reflectionStrings = await this.reflectionTool.getStackStrings ();

                const logTool = new LogTool ();
                logTool.initialize (traceObject, reflectionStrings);

                const queryObject = new JsonObject ();
                queryObject.set ('depth', '3');
                queryObject.set ('thread', logTool.trace ().get ('thread'));

                let resultObject = new ResultObject ();

                try {

                    resultObject = await this.webserviceModule.post (paramsObject.get ('txt_webservice'), null, queryObject, null, logTool.trace ());

                } catch (exception) {

                    resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

                    logTool.exception ();

                }

                logTool.response (resultObject);
                logTool.finalize ();

                return resultObject;
        */
    }

}