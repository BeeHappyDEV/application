import {container, inject, injectable} from 'tsyringe';
import {MongoClient} from 'mongodb';

//import {CommonsTool} from '../toolkit/CommonsTool';
import {ExceptionTool} from '../toolkit/ExceptionTool';
//import {LogTool} from '../toolkit/LogTool';
import {PropertiesModule} from './PropertiesModule';
import {ResultObject} from '../object/ResultObject';
import {JsonObject} from '../object/JsonObject';

@injectable ()
export class MongoDbModule {

    constructor (
        @inject (PropertiesModule) private propertiesModule: PropertiesModule
    ) {
        propertiesModule.initialize ().then ();
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

        //const reflectionStrings = await CommonsTool.getStackStrings ();

        //let logTool = new LogTool (this, this.propertiesTool);
        //logTool.initialize (traceObject, reflectionStrings);

        let resultObject = container.resolve (ResultObject);

        let mongoClient = new MongoClient (await this.propertiesModule.get ('integration.mongo.host'));
        await mongoClient.connect ();

        let mongoDatabase = mongoClient.db (await this.propertiesModule.get ('integration.mongo.database'));
        await mongoDatabase.dropCollection (await this.propertiesModule.get ('integration.mongo.collection'));
        await mongoDatabase.createCollection (await this.propertiesModule.get ('integration.mongo.collection'));

        await mongoClient.close ();

        resultObject.setResult (ExceptionTool.SUCCESSFUL ());

        //logTool.finalize ();

        return resultObject;

    }

}