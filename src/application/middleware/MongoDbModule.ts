import {Db, MongoClient} from 'mongodb';
import {inject, injectable} from 'tsyringe';

import {PropertiesTool} from '../toolkit/PropertiesTool';

@injectable ()
export class MongoDbModule {

    private initializedBoolean = false;
    private mongoClient!: MongoClient;
    private mongoDatabase!: Db;
    private mongoBuffer: any [] = [];
    private flushInterval!: NodeJS.Timeout;
    private readonly bufferSize = 100;
    private readonly flushIntervalMs = 5000;

    constructor (
        @inject (PropertiesTool) private propertiesTool: PropertiesTool
    ) {
    }

    public async initialize (): Promise<void> {

        if (this.initializedBoolean) {

            return;

        }

        try {

            if (!this.mongoClient) {

                this.mongoClient = new MongoClient (
                    await this.propertiesTool.get ('integration.mongodb.host'),
                    {
                        maxPoolSize: 10,
                        connectTimeoutMS: 5000,
                        socketTimeoutMS: 30000
                    }
                );

                await this.mongoClient.connect ();

                this.mongoDatabase = this.mongoClient.db (
                    await this.propertiesTool.get ('integration.mongodb.database')
                );

            }

            this.flushInterval = setInterval (async () => {

                if (this.mongoBuffer.length > 0) {

                    await this.flushTracking ();

                }

            }, this.flushIntervalMs);

            this.initializedBoolean = true;

        } catch (error) {

            this.initializedBoolean = false;

        }

    }

    public async isInitialized (): Promise<boolean> {

        return this.initializedBoolean;

    }

    public async insertTracking (logRecord: Record<string, any>): Promise<void> {

        await this.initialize ();

        this.mongoBuffer.push (logRecord);

        if (this.mongoBuffer.length >= this.bufferSize) {

            await this.flushTracking ();

        }

    }

    public async rebuildTraces (): Promise<void> {

        await this.initialize ();

        const collectionString = await this.propertiesTool.get ('integration.mongodb.traces');

        await this.mongoDatabase.dropCollection (collectionString);

        await this.mongoDatabase.createCollection (collectionString);

    }

    private async flushTracking (): Promise<void> {

        const trackingArray = this.mongoBuffer.splice (0, this.mongoBuffer.length);

        try {

            const documentCollection = this.mongoDatabase.collection (await this.propertiesTool.get ('integration.mongo.traces'));

            await documentCollection.insertMany (trackingArray);

        } catch (error) {

            this.mongoBuffer.unshift (...trackingArray);

        }

    }

    public async close (): Promise<void> {

        clearInterval (this.flushInterval);

        if (this.mongoClient) {

            await this.flushTracking ();
            await this.mongoClient.close ();

        }

    }

}