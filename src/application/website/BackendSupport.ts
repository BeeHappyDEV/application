import fsExtra from "fs-extra";

import ExceptionTool from "../toolkit/ExceptionTool";
import JsonObject from "../object/JsonObject";
import LogTool from "../toolkit/LogTool";
import PostgresTool from "../toolkit/PostgresTool";
import PropertiesTool from "../toolkit/PropertiesTool";
import ReflectionTool from "../toolkit/ReflectionTool";
import ResultObject from "../object/ResultObject";
import ServiceTool from "../toolkit/ServiceTool";

class BackendSupport {

    private static instance: BackendSupport;

    public static getInstance () {

        if (!this.instance) {

            this.instance = new BackendSupport ();

        }

        return this.instance;

    }

    private constructor () {
    }

    public async readMainFile (traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        let paramsObject = new JsonObject ();
        paramsObject.set ("txt_file", "index.txt");
        paramsObject.set ("txt_path", "./src/database/");

        let contentBuffer = fsExtra.readFileSync (paramsObject.get ("txt_path") + paramsObject.get ("txt_file"));
        let contentString = contentBuffer.toString ();
        let linesString = contentString.split (/\r?\n/);

        for (let offsetNumber = 0; offsetNumber < linesString.length; offsetNumber++) {

            let lineString = linesString[offsetNumber].trim ();

            if (lineString.startsWith ("/*") || lineString.startsWith ("--") || lineString === "") {

                continue;

            }

            paramsObject.set ("txt_folder", lineString);

            await this.readFolderFile (paramsObject, logTool.trace ());

        }

        logTool.finalize ();

    }

    private async readFolderFile (paramsObject: JsonObject, traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        paramsObject.set ("txt_folder", paramsObject.get ("txt_folder").split ("/") [0] + "/");

        let contentBuffer = fsExtra.readFileSync (paramsObject.get ("txt_path") + paramsObject.get ("txt_folder") + paramsObject.get ("txt_file"));
        let contentString = contentBuffer.toString ();
        let linesString = contentString.split (/\r?\n/);

        for (let offsetNumber = 0; offsetNumber < linesString.length; offsetNumber++) {

            let lineString = linesString[offsetNumber].trim ();

            if (lineString.startsWith ("/*") || lineString.startsWith ("--") || lineString === "") {

                continue;

            }

            paramsObject.set ("txt_script", lineString);

            await this.readScriptFile (paramsObject, logTool.trace ());

        }

        logTool.comment ("Folder:", paramsObject.get ("txt_folder").split ("/") [0]);
        logTool.finalize ();

    }

    private async readScriptFile (paramsObject: JsonObject, traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        let contentBuffer = fsExtra.readFileSync (paramsObject.get ("txt_path") + paramsObject.get ("txt_folder") + paramsObject.get ("txt_script"));
        let contentString = contentBuffer.toString ();

        paramsObject.set ("txt_content", contentString);

        try {

            let postgresTool = PostgresTool.getInstance ();
            await postgresTool.execute (paramsObject, logTool.trace ());

        } catch (exception) {

            logTool.exception ();

        }

        logTool.comment ("File:", paramsObject.get ("txt_folder") + paramsObject.get ("txt_script"));
        logTool.finalize ();

    }

    public async reloadDollarIndicators (traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        let headersObject = null;

        let paramsObject = new JsonObject ();
        paramsObject.del ("jsn_data");
        paramsObject.set ("apikey", await PropertiesTool.get ("scheduler.indicators.token"));
        paramsObject.set ("formato", "json");

        let resultObject = new ResultObject ();

        try {

            let serviceTool = ServiceTool.getInstance ();
            let serviceObject = await serviceTool.get (await PropertiesTool.get ("scheduler.indicators.host.dollar") + "/" + new Date ().getFullYear ().toString (), headersObject, paramsObject, null, logTool.trace ());
            serviceObject.set ("outgoing", serviceObject.get (["outgoing", "Dolares"]));
            serviceObject.rename ("Fecha", "date");
            serviceObject.rename ("Valor", "value");

            paramsObject.del ("apikey");
            paramsObject.del ("formato");
            paramsObject.set ("jsn_data", serviceObject.get ("outgoing"));
            paramsObject.set ("txt_function", "backend_update_dollar_values");

            let postgresTool = PostgresTool.getInstance ();
            await postgresTool.execute (paramsObject, logTool.trace ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    public async reloadEuroIndicators (traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        let headersObject = null;

        let paramsObject = new JsonObject ();
        paramsObject.del ("jsn_data");
        paramsObject.set ("apikey", await PropertiesTool.get ("scheduler.indicators.token"));
        paramsObject.set ("formato", "json");

        let resultObject = new ResultObject ();

        try {

            let serviceTool = ServiceTool.getInstance ();
            let serviceObject = await serviceTool.get (await PropertiesTool.get ("scheduler.indicators.host.euro") + "/" + new Date ().getFullYear ().toString (), headersObject, paramsObject, null, logTool.trace ());
            serviceObject.set ("outgoing", serviceObject.get (["outgoing", "Euros"]));
            serviceObject.rename ("Fecha", "date");
            serviceObject.rename ("Valor", "value");

            paramsObject.del ("apikey");
            paramsObject.del ("formato");
            paramsObject.set ("jsn_data", serviceObject.get ("outgoing"));
            paramsObject.set ("txt_function", "backend_update_euro_values");

            let postgresTool = PostgresTool.getInstance ();
            await postgresTool.execute (paramsObject, logTool.trace ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    public async reloadFomentUnitIndicators (traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        let headersObject = null;

        let paramsObject = new JsonObject ();
        paramsObject.del ("jsn_data");
        paramsObject.set ("apikey", await PropertiesTool.get ("scheduler.indicators.token"));
        paramsObject.set ("formato", "json");

        let resultObject = new ResultObject ();

        try {

            let serviceTool = ServiceTool.getInstance ();
            let serviceObject = await serviceTool.get (await PropertiesTool.get ("scheduler.indicators.host.foment_unit") + "/" + new Date ().getFullYear ().toString (), headersObject, paramsObject, null, logTool.trace ());
            serviceObject.set ("outgoing", serviceObject.get (["outgoing", "UFs"]));
            serviceObject.rename ("Fecha", "date");
            serviceObject.rename ("Valor", "value");

            paramsObject.del ("apikey");
            paramsObject.del ("formato");
            paramsObject.set ("jsn_data", serviceObject.get ("outgoing"));
            paramsObject.set ("txt_function", "backend_update_foment_unit_values");

            let postgresTool = PostgresTool.getInstance ();
            await postgresTool.execute (paramsObject, logTool.trace ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

    public async reloadMonthlyTaxUnitIndicators (traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);

        let headersObject = null;

        let paramsObject = new JsonObject ();
        paramsObject.del ("jsn_data");
        paramsObject.set ("apikey", await PropertiesTool.get ("scheduler.indicators.token"));
        paramsObject.set ("formato", "json");

        let resultObject = new ResultObject ();

        try {

            let serviceTool = ServiceTool.getInstance ();
            let serviceObject = await serviceTool.get (await PropertiesTool.get ("scheduler.indicators.host.monthly_tax_unit") + "/" + new Date ().getFullYear ().toString (), headersObject, paramsObject, null, logTool.trace ());
            serviceObject.set ("outgoing", serviceObject.get (["outgoing", "UTMs"]));
            serviceObject.rename ("Fecha", "date");
            serviceObject.rename ("Valor", "value");

            paramsObject.del ("apikey");
            paramsObject.del ("formato");
            paramsObject.set ("jsn_data", serviceObject.get ("outgoing"));
            paramsObject.set ("txt_function", "backend_update_monthly_tax_unit_values");

            let postgresTool = PostgresTool.getInstance ();
            await postgresTool.execute (paramsObject, logTool.trace ());

        } catch (exception) {

            resultObject.result (ExceptionTool.APPLICATION_EXCEPTION (reflectionStrings));

            logTool.exception ();

        }

        logTool.response (resultObject);
        logTool.finalize ();

        return resultObject;

    }

}

export default BackendSupport;