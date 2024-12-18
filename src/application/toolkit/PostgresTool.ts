import pg from "pg";

import ExceptionTool from "../toolkit/ExceptionTool";
import JsonObject from "../object/JsonObject";
import LogTool from "../toolkit/LogTool";
import PropertiesTool from "../toolkit/PropertiesTool";
import ReflectionTool from "./ReflectionTool";
import ResultObject from "../object/ResultObject";

class PostgresTool {

    private static instance: PostgresTool;

    public static getInstance () {

        if (!this.instance) {

            this.instance = new PostgresTool ();

        }

        return this.instance;

    }

    private constructor () {
    }

    public async exe (paramsObject: JsonObject, traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        let postgresPool = new pg.Pool ({
            database: await PropertiesTool.get ("integration.postgres.database"),
            host: await PropertiesTool.get ("integration.postgres.host"),
            max: await PropertiesTool.get ("integration.postgres.connections"),
            password: await PropertiesTool.get ("integration.postgres.pass"),
            port: await PropertiesTool.get ("integration.postgres.port"),
            user: await PropertiesTool.get ("integration.postgres.user")
        });

        let resultObject = new ResultObject ();

        try {

            await postgresPool.query (paramsObject.get ("txt_content"));

            resultObject.result (ExceptionTool.SUCCESSFUL ());

        } catch (exception) {

            resultObject.result (ExceptionTool.REBUILD_EXCEPTION (paramsObject.get ("txt_line")));

            logTool.exception ();

        }

        await postgresPool.end ();

        logTool.finalize ();

        return resultObject;

    }

    public async run (paramsObject: JsonObject, traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        let postgresPool = new pg.Pool ({
            database: await PropertiesTool.get ("integration.postgres.database"),
            host: await PropertiesTool.get ("integration.postgres.host"),
            max: await PropertiesTool.get ("integration.postgres.connections"),
            password: await PropertiesTool.get ("integration.postgres.pass"),
            port: await PropertiesTool.get ("integration.postgres.port"),
            user: await PropertiesTool.get ("integration.postgres.user")
        });

        let resultObject = new ResultObject ();

        try {

            let functionString = paramsObject.get ("txt_function");

            logTool.resource (functionString);

            paramsObject.del ("txt_function");

            let postgresObject = await postgresPool.query ("select * from " + functionString + " ($1)", [paramsObject.all ()]);
            postgresObject = postgresObject.rows [0];

            let databaseObject = Object.values (postgresObject) [0];

            if (databaseObject ["status"] ["boo_exception"] === false) {

                resultObject.result (databaseObject);

            } else {

                resultObject.result (ExceptionTool.FUNCTION_EXCEPTION (functionString));

            }

        } catch (exception) {

            resultObject.result (ExceptionTool.POSTGRES_EXCEPTION (reflectionStrings));

            logTool.exception ();

        } finally {

            await postgresPool.end ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

}

export default PostgresTool;