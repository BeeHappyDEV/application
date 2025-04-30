import {JsonObject} from '../object/JsonObject';

export class ExceptionTool {

    //0
    public static SUCCESSFUL () {

        let jsonObject = new JsonObject ();

        let statusObject = {
            sys_result: 0,
            sys_message: 'Successful',
            sys_carry: false
        }

        jsonObject.set ('status', statusObject);

        return jsonObject.all ();

    }

    //100
    public static POSTGRES_EXCEPTION (reflectionStrings: string []) {

        let jsonObject = new JsonObject ();

        let statusObject = {
            sys_result: 100,
            sys_message: 'Postgres Exception: ' + reflectionStrings [0] + '.' + reflectionStrings [1],
            sys_carry: true
        }

        jsonObject.set ('status', statusObject);

        return jsonObject.all ();

    }

    //200
    public static REBUILD_EXCEPTION (fileString: string) {

        let jsonObject = new JsonObject ();

        let statusObject = {
            sys_result: 200,
            sys_message: 'Rebuild Exception: ' + fileString,
            sys_carry: true
        }

        jsonObject.set ('status', statusObject);

        return jsonObject.all ();

    }

    //300
    public static INDICATORS_EXCEPTION (reflectionStrings: string []) {

        let jsonObject = new JsonObject ();

        let statusObject = {
            sys_result: 300,
            sys_message: 'Indicators Exception: ' + reflectionStrings [0] + '.' + reflectionStrings [1],
            sys_carry: true
        }

        jsonObject.set ('status', statusObject);

        return jsonObject;

    }

    //400
    public static FUNCTION_EXCEPTION (functionString: string) {

        let jsonObject = new JsonObject ();

        let statusObject = {
            sys_result: 400,
            sys_message: 'Function Exception: ' + functionString,
            sys_carry: true
        }

        jsonObject.set ('status', statusObject);

        return jsonObject.all ();

    }

    //500
    public static SERVICE_EXCEPTION (reflectionStrings: string []) {

        let jsonObject = new JsonObject ();

        let statusObject = {
            sys_result: 500,
            sys_message: 'Service Exception: ' + reflectionStrings [0] + '.' + reflectionStrings [1],
            sys_carry: true
        }

        jsonObject.set ('status', statusObject);

        return jsonObject.all ();

    }

    //600
    public static DISCORD_EXCEPTION (reflectionStrings: string []) {

        let jsonObject = new JsonObject ();

        let statusObject = {
            sys_result: 600,
            sys_message: 'Discord Exception: ' + reflectionStrings [0] + '.' + reflectionStrings [1],
            sys_carry: true
        }

        jsonObject.set ('status', statusObject);

        return jsonObject.all ();

    }

    //700
    public static AUTH0_EXCEPTION (reflectionStrings: string []) {

        let jsonObject = new JsonObject ();

        let statusObject = {
            sys_result: 700,
            sys_message: 'Auth0 Exception: ' + reflectionStrings [0] + '.' + reflectionStrings [1],
            sys_carry: true
        }

        jsonObject.set ('status', statusObject);

        return jsonObject.all ();

    }

    //900
    public static APPLICATION_EXCEPTION (reflectionStrings: string []) {

        let jsonObject = new JsonObject ();

        let statusObject = {
            sys_result: 900,
            sys_message: 'Application Exception: ' + reflectionStrings [0] + '.' + reflectionStrings [1],
            sys_carry: true
        }

        jsonObject.set ('status', statusObject);

        return jsonObject;

    }

}