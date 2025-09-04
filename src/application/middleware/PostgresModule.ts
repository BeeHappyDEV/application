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

    public async execute (traceRecord: Record<string, any>, paramsRecord: Record<string, any>): Promise<Record<string, any>> {

        const logTool = this.logToolFactory ();
        logTool.setTrace (traceRecord);
        logTool.INITIALIZE ();

        let resultRecord: Record<string, any> = {};

        await this.initialize ();

        const poolClient = await this.pgPool.connect ();

        if (paramsRecord.txt_script != null) {

            try {

                const fileString = paramsRecord.txt_path + paramsRecord.txt_folder + paramsRecord.txt_script;

                logTool.setScpExecute (fileString, paramsRecord.txt_content);

                await poolClient.query (paramsRecord.txt_content);

                resultRecord.status = {};
                resultRecord.status.boo_exception = false;
                resultRecord.status.num_exception = LogConstants.SUCCESS.num_exception;
                resultRecord.status.txt_exception = LogConstants.SUCCESS.txt_exception;

                logTool.setScpSuccess (fileString);

            } catch (exception) {

                resultRecord.status = {};
                resultRecord.status.boo_exception = true;
                resultRecord.status.num_exception = LogConstants.SCRIPT.num_exception;
                resultRecord.status.txt_exception = LogConstants.SCRIPT.txt_exception;

                logTool.setScpPostgres ();

            }

        }

        if (paramsRecord.txt_schema != null && paramsRecord.txt_function != null) {

            try {

                const functionString = paramsRecord.txt_schema + '.' + paramsRecord.txt_function;

                delete paramsRecord.txt_schema;
                delete paramsRecord.txt_function;

                logTool.setFncExecute (functionString, paramsRecord)

                let postgresRecord = await poolClient.query ('select * from ' + functionString + ' ($1)', [paramsRecord]);
                postgresRecord = postgresRecord.rows [0];

                resultRecord = Object.values (postgresRecord) [0];

                if (resultRecord.status.boo_exception === false) {

                    resultRecord.status.num_exception = LogConstants.SUCCESS.num_exception;
                    resultRecord.status.txt_exception = LogConstants.SUCCESS.txt_exception;

                    logTool.setFncSuccess (functionString);

                } else {

                    resultRecord.status.num_exception = LogConstants.FUNCTION.num_exception;
                    resultRecord.status.txt_exception = LogConstants.FUNCTION.txt_exception;

                    logTool.setFncFunction (functionString);

                }

            } catch (exception) {

                resultRecord.status = {};
                resultRecord.status.boo_exception = true;
                resultRecord.status.num_exception = LogConstants.POSTGRES.num_exception;
                resultRecord.status.txt_exception = LogConstants.POSTGRES.txt_exception;

                logTool.setFncPostgres ();

            }

        }

        poolClient.release ();

        logTool.FINALIZE ();

        return resultRecord;

    }

}