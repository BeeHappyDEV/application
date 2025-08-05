import {inject, injectable} from 'tsyringe';

import pg from 'pg';

import {LogConstants} from '../constants/LogConstants';
import {LogTool} from '../toolkit/LogTool';
import {PropertiesTool} from '../toolkit/PropertiesTool';

@injectable ()
export class PostgresModule {

    private initializedBoolean = false;
    private pgPool!: pg.Pool;

    constructor (
        @inject ('LogToolFactory') private logToolFactory: () => LogTool,
        @inject (PropertiesTool) private propertiesTool: PropertiesTool
    ) {
    }

    public async initialize (): Promise<void> {

        if (this.initializedBoolean) {

            return;

        }

        try {

            if (!this.pgPool) {

                this.pgPool = new pg.Pool ({
                    database: await this.propertiesTool.get ('integration.postgres.database'),
                    host: await this.propertiesTool.get ('integration.postgres.host'),
                    max: Number (await this.propertiesTool.get ('integration.postgres.connections')),
                    password: await this.propertiesTool.get ('integration.postgres.pass'),
                    port: Number (await this.propertiesTool.get ('integration.postgres.port')),
                    user: await this.propertiesTool.get ('integration.postgres.user')
                });

            }

            this.initializedBoolean = true;

        } catch (error) {

            this.initializedBoolean = false;

        }

    }

    public async isInitialized (): Promise<boolean> {

        return this.initializedBoolean;

    }

    public async execute (traceObject: Record<string, any>, paramsObject: Record<string, any>): Promise<Record<string, any>> {

        const logTool = this.logToolFactory ();
        logTool.setTrace (traceObject);
        logTool.INITIALIZE ();

        let resultObject: Record<string, any> = {};

        await this.initialize ();

        const poolClient = await this.pgPool.connect ();

        if (paramsObject.txt_script != null) {

            try {

                const fileString = paramsObject.txt_path + paramsObject.txt_folder + paramsObject.txt_script;

                logTool.setScpExecute (fileString, paramsObject.txt_content);

                await poolClient.query (paramsObject.txt_content);

                resultObject.status = {};
                resultObject.status.boo_exception = false;
                resultObject.status.num_exception = LogConstants.SUCCESS.num_exception;
                resultObject.status.txt_exception = LogConstants.SUCCESS.txt_exception;

                logTool.setScpSuccess (fileString);

            } catch (exception) {

                resultObject.status = {};
                resultObject.status.boo_exception = true;
                resultObject.status.num_exception = LogConstants.SCRIPT.num_exception;
                resultObject.status.txt_exception = LogConstants.SCRIPT.txt_exception;

                logTool.setScpPostgres ();

            }

        }

        if (paramsObject.txt_schema != null && paramsObject.txt_function != null) {

            try {

                const functionString = paramsObject.txt_schema + '.' + paramsObject.txt_function;

                delete paramsObject.txt_schema;
                delete paramsObject.txt_function;

                logTool.setFncExecute (functionString, paramsObject)

                let postgresObject = await poolClient.query ('select * from ' + functionString + ' ($1)', [paramsObject]);
                postgresObject = postgresObject.rows [0];

                resultObject = Object.values (postgresObject) [0];

                if (resultObject.status.boo_exception === false) {

                    resultObject.status.num_exception = LogConstants.SUCCESS.num_exception;
                    resultObject.status.txt_exception = LogConstants.SUCCESS.txt_exception;

                    logTool.setFncSuccess (functionString);

                } else {

                    resultObject.status.num_exception = LogConstants.FUNCTION.num_exception;
                    resultObject.status.txt_exception = LogConstants.FUNCTION.txt_exception;

                    logTool.setFncFunction (functionString);

                }

            } catch (exception) {

                resultObject.status = {};
                resultObject.status.boo_exception = true;
                resultObject.status.num_exception = LogConstants.POSTGRES.num_exception;
                resultObject.status.txt_exception = LogConstants.POSTGRES.txt_exception;

                logTool.setFncPostgres ();

            }

        }

        poolClient.release ();

        logTool.FINALIZE ();

        return resultObject;

    }

}