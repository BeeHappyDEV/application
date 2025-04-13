import {MongoClient} from "mongodb";

import ExceptionTool from "../toolkit/ExceptionTool";
import JsonObject from "../object/JsonObject";
import LogTool from "../toolkit/LogTool";
import PropertiesTool from "../toolkit/PropertiesTool";
import {ReflectionTool} from "../toolkit/ReflectionTool";
import ResultObject from "../object/ResultObject";

class MongoTool {

    private static instance: MongoTool;

    public static getInstance () {

        if (!this.instance) {

            this.instance = new MongoTool ();

        }

        return this.instance;

    }

    private constructor () {
    }

    public async insertMetric (logObject: JsonObject) {

        let mongoClient = new MongoClient (await PropertiesTool.get ("integration.mongo.host"));
        await mongoClient.connect ();

        let mongoDatabase = await mongoClient.db (await PropertiesTool.get ("integration.mongo.database"));

        let mongoCollection = await mongoDatabase.collection (await PropertiesTool.get ("integration.mongo.metrics"));

        await mongoCollection.insertOne (logObject.all ());

        await mongoClient.close ();

    }

    public async insertTrace (logObject: JsonObject) {

        let mongoClient = new MongoClient (await PropertiesTool.get ("integration.mongo.host"));
        await mongoClient.connect ();

        let mongoDatabase = await mongoClient.db (await PropertiesTool.get ("integration.mongo.database"));

        let mongoCollection = await mongoDatabase.collection (await PropertiesTool.get ("integration.mongo.traces"));

        await mongoCollection.insertOne (logObject.all ());

        await mongoClient.close ();

    }

    public async rebuild (traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        let resultObject = new ResultObject ();

        let mongoClient = new MongoClient (await PropertiesTool.get ("integration.mongo.host"));
        await mongoClient.connect ();

        let mongoDatabase = mongoClient.db (await PropertiesTool.get ("integration.mongo.database"));
        await mongoDatabase.dropCollection (await PropertiesTool.get ("integration.mongo.collection"));
        await mongoDatabase.createCollection (await PropertiesTool.get ("integration.mongo.collection"));

        await mongoClient.close ();

        resultObject.result (ExceptionTool.SUCCESSFUL ());

        logTool.finalize ();

        return resultObject;

    }

}

export default MongoTool;