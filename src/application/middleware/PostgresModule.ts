import {inject, injectable} from 'tsyringe';

import pg from 'pg';

import {ExceptionTool} from '@toolkit/ExceptionTool';
import {JsonObject} from '@object/JsonObject';
import {LogTool} from '@toolkit/LogTool';
import {PropertiesTool} from '@toolkit/PropertiesTool';
import {ReflectionTool} from '@toolkit/ReflectionTool';
import {ResultObject} from '@object/ResultObject';

@injectable ()
export class PostgresModule {

    constructor (
        @inject (PropertiesTool) private readonly propertiesTool: PropertiesTool,
        @inject (ReflectionTool) private readonly reflectionTool: ReflectionTool
    ) {
    }

    public async execute (paramsObject: JsonObject, traceObject: JsonObject): Promise<ResultObject> {

        const reflectionStrings = await this.reflectionTool.getStackStrings ();

        const logTool = new LogTool ();
        logTool.initialize (traceObject, reflectionStrings);

        const postgresPool = new pg.Pool ({
            database: await this.propertiesTool.get ('integration.postgres.database'),
            host: await this.propertiesTool.get ('integration.postgres.host'),
            max: await this.propertiesTool.get ('integration.postgres.connections'),
            password: await this.propertiesTool.get ('integration.postgres.pass'),
            port: await this.propertiesTool.get ('integration.postgres.port'),
            user: await this.propertiesTool.get ('integration.postgres.user')
        });

        const resultObject = new ResultObject ();

        if (paramsObject.get ('txt_content') != null) {

            try {

                await postgresPool.query (paramsObject.get ('txt_content'));

                resultObject.result (ExceptionTool.SUCCESSFUL ());

            } catch (exception) {

                resultObject.result (ExceptionTool.REBUILD_EXCEPTION (paramsObject.get ('txt_line')));

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

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

}