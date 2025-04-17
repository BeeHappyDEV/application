import {inject, injectable} from 'tsyringe';
import {MongoClient} from 'mongodb';

import {ExceptionTool} from '@toolkit/ExceptionTool';
import {LogTool} from '@toolkit/LogTool';
import {PropertiesTool} from '@toolkit/PropertiesTool';
import {ReflectionTool} from '@toolkit/ReflectionTool';
import {ResultObject} from '@object/ResultObject';
import {JsonObject} from '@object/JsonObject';

@injectable ()
export class MongoDbModule {

    constructor (
        @inject (PropertiesTool) private readonly propertiesTool: PropertiesTool,
        @inject (ReflectionTool) private readonly reflectionTool: ReflectionTool
    ) {
    }
/*
    public async insertMetric (logObject: JsonObject) {

        let mongoClient = new MongoClient (await this.propertiesTool.get ('integration.mongo.host'));
        await mongoClient.connect ();

        let mongoDatabase = await mongoClient.db (await this.propertiesTool.get ('integration.mongo.database'));

        let mongoCollection = await mongoDatabase.collection (await this.propertiesTool.get ('integration.mongo.metrics'));

        await mongoCollection.insertOne (logObject.all ());

        await mongoClient.close ();

    }
*/
    public async insertTrace (logObject: JsonObject) {

        let mongoClient = new MongoClient (await this.propertiesTool.get ('integration.mongo.host'));
        await mongoClient.connect ();

        let mongoDatabase = await mongoClient.db (await this.propertiesTool.get ('integration.mongo.database'));

        let mongoCollection = await mongoDatabase.collection (await this.propertiesTool.get ('integration.mongo.traces'));

        await mongoCollection.insertOne (logObject.all ());

        await mongoClient.close ();

    }

    public async rebuild (traceObject: JsonObject) {

        const reflectionStrings = await this.reflectionTool.getStackStrings ();

        let logTool = new LogTool ();
        logTool.initialize (traceObject, reflectionStrings);

        let resultObject = new ResultObject ();

        let mongoClient = new MongoClient (await this.propertiesTool.get ('integration.mongo.host'));
        await mongoClient.connect ();

        let mongoDatabase = mongoClient.db (await this.propertiesTool.get ('integration.mongo.database'));
        await mongoDatabase.dropCollection (await this.propertiesTool.get ('integration.mongo.collection'));
        await mongoDatabase.createCollection (await this.propertiesTool.get ('integration.mongo.collection'));

        await mongoClient.close ();

        resultObject.result (ExceptionTool.SUCCESSFUL ());

        logTool.finalize ();

        return resultObject;

    }

}