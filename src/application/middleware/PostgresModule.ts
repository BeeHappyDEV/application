import {container, inject, injectable} from 'tsyringe';

import pg from 'pg';

import {CommonsTool} from '../toolkit/CommonsTool';
import {ExceptionTool} from '../toolkit/ExceptionTool';
import {JsonObject} from '../object/JsonObject';
import {LogTool} from '../toolkit/LogTool';
import {PropertiesModule} from './PropertiesModule';
import {ResultObject} from '../object/ResultObject';

@injectable ()
export class PostgresModule {

    constructor (
        @inject (PropertiesModule) private propertiesModule: PropertiesModule
    ) {
        propertiesModule.initialize ().then ();
    }

    public async execute (paramsObject: JsonObject, traceObject: JsonObject): Promise<ResultObject> {

        await this.propertiesModule.initialize ();

        const stackStrings = await CommonsTool.getStackStrings ();

        const logTool = container.resolve (LogTool);
        logTool.initialize (stackStrings, traceObject);

        const postgresPool = new pg.Pool ({
            database: await this.propertiesModule.get ('integration.postgres.database'),
            host: await this.propertiesModule.get ('integration.postgres.host'),
            max: Number (await this.propertiesModule.get ('integration.postgres.connections')),
            password: await this.propertiesModule.get ('integration.postgres.pass'),
            port: Number (await this.propertiesModule.get ('integration.postgres.port')),
            user: await this.propertiesModule.get ('integration.postgres.user')
        });

        const resultObject = container.resolve (ResultObject);

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

        if (paramsObject.get ('txt_schema') != null && paramsObject.get ('txt_function') != null) {

            try {

                const objectString = paramsObject.get ('txt_schema') + '.' + paramsObject.get ('txt_function');

                logTool.resource (objectString);

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