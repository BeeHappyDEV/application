import {container, inject, injectable} from 'tsyringe';

import pg from 'pg';

import {CommonsTool} from '../toolkit/CommonsTool';
import {ExceptionTool} from '../toolkit/ExceptionTool';
import {JsonObject} from '../object/JsonObject';
import {LogTool} from '../toolkit/LogTool';
import {PropertiesTool} from '../toolkit/PropertiesTool';
import {ResultObject} from '../object/ResultObject';

@injectable ()
export class PostgresModule {

    constructor (
        @inject (PropertiesTool) private propertiesTool: PropertiesTool
    ) {
        propertiesTool.initialize ().then ();
    }

    public async execute (paramsObject: JsonObject, traceObject: JsonObject): Promise<ResultObject> {

        await this.propertiesTool.initialize ();

        const stackStrings = await CommonsTool.getStackStrings ();

        const logTool = container.resolve (LogTool);
        logTool.initialize (stackStrings, traceObject);

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

                logTool.exception ();

            }

            await postgresPool.end ();

        }

        if (paramsObject.get ('txt_function') != null) {

            try {

                const functionString = paramsObject.get ('txt_function');

                logTool.resource (functionString);

                paramsObject.del ('txt_function');

                let postgresObject = await postgresPool.query ('select * from ' + functionString + ' ($1)', [paramsObject.all ()]);
                postgresObject = postgresObject.rows [0];

                const databaseObject = Object.values (postgresObject) [0];

                if (databaseObject ['status'] ['boo_exception'] === false) {

                    resultObject.setResult (databaseObject);

                } else {

                    resultObject.setResult (ExceptionTool.FUNCTION_EXCEPTION (functionString));

                }

            } catch (exception) {

                resultObject.setResult (ExceptionTool.POSTGRES_EXCEPTION (stackStrings));

                logTool.exception ();

            } finally {

                await postgresPool.end ();

            }

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

}