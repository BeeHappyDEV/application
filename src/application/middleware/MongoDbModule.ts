import {inject, injectable} from 'tsyringe';

import {MongoClient} from 'mongodb';

import {ExceptionTool} from 'src/application/toolkit/ExceptionTool';
import {PropertiesTool} from 'src/application/toolkit/PropertiesTool';

import {JsonObject} from 'src/application/object/JsonObject';
import {ResultObject} from 'src/application/object/ResultObject';

@injectable ()
export class MongoDbModule {

    constructor (
        @inject (PropertiesTool) private propertiesTool: PropertiesTool
    ) {
    }

    // @ts-ignore
    public async insertTrace (logObject: JsonObject): Promise<void> {

        //console.log(logObject.all());

        /*
        let mongoClient = new MongoClient (await this.propertiesTool.get ('integration.mongo.host'));

        try {

            await mongoClient.connect ();

            const documentObject = {
                ...logObject.all (),
                _id: new ObjectId ()
            };

            delete documentObject._id;

            let mongoDatabase = mongoClient.db (await this.propertiesTool.get ('integration.mongo.database'));

            let mongoCollection = mongoDatabase.collection (await this.propertiesTool.get ('integration.mongo.traces'));

            await mongoCollection.insertOne (documentObject);

        } catch (exception) {
            console.log (exception)
        } finally {

            await mongoClient.close ();

        }
        */

    }

    // @ts-ignore
    public async rebuild (traceObject: JsonObject) {

        //const reflectionStringArray = await CommonsTool.getStackStringArray ();

        //let logTool = new LogTool (this, this.propertiesTool);
        //logTool.initialize (traceObject, reflectionStringArray);

        let resultObject =  new ResultObject ();

        let mongoClient = new MongoClient (await this.propertiesTool.get ('integration.mongo.host'));
        await mongoClient.connect ();

        let mongoDatabase = mongoClient.db (await this.propertiesTool.get ('integration.mongo.database'));
        await mongoDatabase.dropCollection (await this.propertiesTool.get ('integration.mongo.collection'));
        await mongoDatabase.createCollection (await this.propertiesTool.get ('integration.mongo.collection'));

        await mongoClient.close ();

        resultObject.setResult (ExceptionTool.SUCCESSFUL ());

        //logTool.finalize ();

        return resultObject;

    }

}