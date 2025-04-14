import {inject, singleton} from "tsyringe";

import {MongoClient} from "mongodb";

import ExceptionTool from "../toolkit/ExceptionTool";
import JsonObject from "../object/JsonObject";
import {LogTool} from "./LogTool";
import {PropertiesTool} from "./PropertiesTool";
import {ReflectionTool} from "./ReflectionTool";
import ResultObject from "../object/ResultObject";

@singleton ()
export class MongoTool {

    constructor (
        @inject (PropertiesTool) private propertiesTool: PropertiesTool
    ) {}
/*
    public async insertMetric (logObject: JsonObject) {

        let mongoClient = new MongoClient (await this.propertiesTool.get ("integration.mongo.host"));
        await mongoClient.connect ();

        let mongoDatabase = await mongoClient.db (await this.propertiesTool.get ("integration.mongo.database"));

        let mongoCollection = await mongoDatabase.collection (await this.propertiesTool.get ("integration.mongo.metrics"));

        await mongoCollection.insertOne (logObject.all ());

        await mongoClient.close ();

    }
*/
    public async insertTrace (logObject: JsonObject) {

        let mongoClient = new MongoClient (await this.propertiesTool.get ("integration.mongo.host"));
        await mongoClient.connect ();

        let mongoDatabase = await mongoClient.db (await this.propertiesTool.get ("integration.mongo.database"));

        let mongoCollection = await mongoDatabase.collection (await this.propertiesTool.get ("integration.mongo.traces"));

        await mongoCollection.insertOne (logObject.all ());

        await mongoClient.close ();

    }

    public async rebuild (traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (traceObject, reflectionStrings);

        let resultObject = new ResultObject ();

        let mongoClient = new MongoClient (await this.propertiesTool.get ("integration.mongo.host"));
        await mongoClient.connect ();

        let mongoDatabase = mongoClient.db (await this.propertiesTool.get ("integration.mongo.database"));
        await mongoDatabase.dropCollection (await this.propertiesTool.get ("integration.mongo.collection"));
        await mongoDatabase.createCollection (await this.propertiesTool.get ("integration.mongo.collection"));

        await mongoClient.close ();

        resultObject.result (ExceptionTool.SUCCESSFUL ());

        logTool.finalize ();

        return resultObject;

    }

}