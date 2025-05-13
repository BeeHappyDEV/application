import {JsonObject} from '../object/JsonObject';
import {container} from "tsyringe";

export class ExceptionTool {

    public static SUCCESSFUL () {

        let jsonObject = container.resolve (JsonObject);

        let statusObject = {
            sys_result: 0,
            sys_message: 'Successful',
            sys_carry: false
        }

        jsonObject.set ('status', statusObject);

        return jsonObject.all ();

    }

    public static POSTGRES_EXCEPTION (reflectionStrings: string []) {

        let jsonObject = container.resolve (JsonObject);

        let statusObject = {
            sys_result: 100,
            sys_message: 'Postgres Exception: ' + reflectionStrings [0] + '.' + reflectionStrings [1],
            sys_carry: true
        }

        jsonObject.set ('status', statusObject);

        return jsonObject.all ();

    }

    public static REBUILD_EXCEPTION (fileString: string) {

        let jsonObject = container.resolve (JsonObject);

        let statusObject = {
            sys_result: 200,
            sys_message: 'Rebuild Exception: ' + fileString,
            sys_carry: true
        }

        jsonObject.set ('status', statusObject);

        return jsonObject.all ();

    }

    public static INDICATORS_EXCEPTION (reflectionStrings: string []) {

        let jsonObject = container.resolve (JsonObject);

        let statusObject = {
            sys_result: 300,
            sys_message: 'Indicators Exception: ' + reflectionStrings [0] + '.' + reflectionStrings [1],
            sys_carry: true
        }

        jsonObject.set ('status', statusObject);

        return jsonObject;

    }

    public static FUNCTION_EXCEPTION (functionString: string) {

        let jsonObject = container.resolve (JsonObject);

        let statusObject = {
            sys_result: 400,
            sys_message: 'Function Exception: ' + functionString,
            sys_carry: true
        }

        jsonObject.set ('status', statusObject);

        return jsonObject.all ();

    }

    public static SERVICE_EXCEPTION (reflectionStrings: string []) {

        let jsonObject = container.resolve (JsonObject);

        let statusObject = {
            sys_result: 500,
            sys_message: 'Service Exception: ' + reflectionStrings [0] + '.' + reflectionStrings [1],
            sys_carry: true
        }

        jsonObject.set ('status', statusObject);

        return jsonObject.all ();

    }

    public static DISCORD_EXCEPTION (reflectionStrings: string []) {

        let jsonObject = container.resolve (JsonObject);

        let statusObject = {
            sys_result: 600,
            sys_message: 'Discord Exception: ' + reflectionStrings [0] + '.' + reflectionStrings [1],
            sys_carry: true
        }

        jsonObject.set ('status', statusObject);

        return jsonObject.all ();

    }

    public static AUTH0_EXCEPTION (reflectionStrings: string []) {

        let jsonObject = container.resolve (JsonObject);

        let statusObject = {
            sys_result: 700,
            sys_message: 'Auth0 Exception: ' + reflectionStrings [0] + '.' + reflectionStrings [1],
            sys_carry: true
        }

        jsonObject.set ('status', statusObject);

        return jsonObject.all ();

    }

    public static APPLICATION_EXCEPTION (reflectionStrings: string []) {

        let jsonObject = container.resolve (JsonObject);

        let statusObject = {
            sys_result: 900,
            sys_message: 'Application Exception: ' + reflectionStrings [0] + '.' + reflectionStrings [1],
            sys_carry: true
        }

        jsonObject.set ('status', statusObject);

        return jsonObject;

    }

}