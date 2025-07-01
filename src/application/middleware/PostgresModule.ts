import {inject, injectable} from 'tsyringe';

import pg from 'pg';

import {CommonsTool} from '../toolkit/CommonsTool';
import {ExceptionTool} from '../toolkit/ExceptionTool';
import {LogTool} from '../toolkit/LogTool';
import {PropertiesTool} from '../toolkit/PropertiesTool';

import {JsonObject} from '../object/JsonObject';
import {ResultObject} from '../object/ResultObject';

@injectable ()
export class PostgresModule {

    constructor (
        @inject (LogTool) private logTool: LogTool,
        @inject (PropertiesTool) private propertiesTool: PropertiesTool
    ) {
    }

    public async execute (paramsObject: JsonObject, traceObject: JsonObject): Promise<ResultObject> {

        const stackStringArray = CommonsTool.getStackStringArray ();

        this.logTool.initialize (stackStringArray, traceObject);

        const postgresPool = new pg.Pool ({
            database: await this.propertiesTool.get ('integration.postgres.database'),
            host: await this.propertiesTool.get ('integration.postgres.host'),
            max: Number (await this.propertiesTool.get ('integration.postgres.connections')),
            password: await this.propertiesTool.get ('integration.postgres.pass'),
            port: Number (await this.propertiesTool.get ('integration.postgres.port')),
            user: await this.propertiesTool.get ('integration.postgres.user')
        });

        const resultObject = new ResultObject ();

        if (paramsObject.get ('txt_content') != null) {

            try {

                await postgresPool.query (paramsObject.get ('txt_content'));

                resultObject.setResult (ExceptionTool.SUCCESSFUL ());

            } catch (exception) {

                resultObject.setResult (ExceptionTool.REBUILD_EXCEPTION (paramsObject.get ('txt_line')));

                this.logTool.exception ();

            }

            await postgresPool.end ();

        }

        if (paramsObject.get ('txt_schema') != null && paramsObject.get ('txt_function') != null) {

            try {

                const objectString = paramsObject.get ('txt_schema') + '.' + paramsObject.get ('txt_function');

                this.logTool.resource (objectString);

                paramsObject.del ('txt_schema');
                paramsObject.del ('txt_function');

                let postgresObject = await postgresPool.query ('select * from ' + objectString + ' ($1)', [paramsObject.all ()]);
                postgresObject = postgresObject.rows [0];

                const databaseObject = Object.values (postgresObject) [0];

                if (databaseObject ['status'] ['boo_exception'] === false) {

                    resultObject.setResult (databaseObject);

                } else {

                    resultObject.setResult (ExceptionTool.FUNCTION_EXCEPTION (objectString));

                }

            } catch (exception) {

                resultObject.setResult (ExceptionTool.POSTGRES_EXCEPTION (stackStringArray));

                this.logTool.exception ();

            }

        }

        this.logTool.response (resultObject);
        this.logTool.finalize ();

        return resultObject;

    }

}