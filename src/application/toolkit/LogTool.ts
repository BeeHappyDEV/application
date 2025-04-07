import crypto from "crypto";
import express from "express";
import kleur from "kleur";
import url from "url";

import JsonObject from "../object/JsonObject";
import MongoTool from "../toolkit/MongoTool";
import ObservabilityTool from "../toolkit/ObservabilityTool";
import ResultObject from "../object/ResultObject";

class LogTool {

    private logObject = new JsonObject ();

    public initialize (reflectionStrings: String[], traceObject?: JsonObject) {

        let observabilityTool = ObservabilityTool.getInstance ();

        this.logObject.set ("metrics", observabilityTool.before ());
        this.logObject.set ("exception", false);
        this.logObject.set ("carry", false);
        this.logObject.set ("starting", Date.now ());
        this.logObject.set ("offset", crypto.randomUUID ().split ("-").join (""));
        this.logObject.set ("class", reflectionStrings [0]);
        this.logObject.set ("method", reflectionStrings [1]);

        switch (reflectionStrings [2]) {

            case "frontend":
            case "backend":
            case "schedule":

                this.logObject.set ("source", reflectionStrings [2]);

                break;

            case "launcher":

                this.logObject.set ("source", "start");

                break;

            default:

                this.logObject.set ("source", "tool");

        }

        if (traceObject === undefined) {

            this.logObject.set ("depth", 1);
            this.logObject.set ("thread", crypto.randomUUID ().split ("-").join (""));

        } else {

            let depthNumber = Number (traceObject.get ("depth"));

            this.logObject.set ("depth", Number (depthNumber + 1));
            this.logObject.set ("thread", traceObject.get ("thread"));

        }

        return this.logObject;

    }

    public contextualize (expressRequest: typeof express.request) {

        if (Object.keys (expressRequest.query).length !== 0) {

            let depthNumber = Number (expressRequest.query ["depth"]);

            this.logObject.set ("depth", depthNumber + 1);
            this.logObject.set ("thread", expressRequest.query ["thread"] || {});

        }

    }

    public request (expressRequest: typeof express.request) {

        let urlObject = url.parse (expressRequest.url, true);

        this.logObject.set ("verb", expressRequest.method);

        if (urlObject.pathname != null) {

            this.logObject.set ("url", urlObject.pathname);

        }

        if (Object.keys (urlObject.query).length > 0) {

            this.logObject.set ("query", urlObject.query);

        }

        if (Object.keys (expressRequest.params).length !== 0) {

            let arrayObject = [];

            for (let [keyString, valueString] of Object.entries (expressRequest.params)) {

                arrayObject.push ({
                    key: keyString,
                    value: valueString
                });

            }

            this.logObject.set ("params", arrayObject);

        }

    }

    public response (resultObject: ResultObject) {

        if (resultObject.getCarry () == true) {

            this.logObject.set ("carry", true);

        } else {

            this.logObject.set ("carry", false);

        }

        if (resultObject.hasOutgoing ()) {

            let redirectString = resultObject.getRedirect ();
            let renderString = resultObject.getRender ();
            let statusString = resultObject.getStatus ();

            if (redirectString != null) {

                this.logObject.set ("redirect", redirectString);

            }

            if (renderString != null) {

                this.logObject.set ("render", renderString);

            }

            if (redirectString == null && renderString == null) {

                this.logObject.set ("status", statusString);

            }

        }

    }

    public resource (resourceString: String) {

        this.logObject.set ("resource", resourceString);

    }

    public exception () {

        this.logObject.set ("carry", true);
        this.logObject.set ("exception", true);

    }

    public comment (commentString: String, highlightString: String, exceptionBoolean?: Boolean) {

        if (exceptionBoolean) {

            this.logObject.set ("carry", true);

        }

        this.logObject.set ("comment", commentString);
        this.logObject.set ("highlight", highlightString);

    }

    public websocket (expressRequest: typeof express.request) {

        this.logObject.set ("verb", "TCP");
        this.logObject.set ("url", expressRequest.url);

        if (Object.keys (expressRequest.params).length !== 0) {

            this.logObject.set ("request", expressRequest.params);

        }

    }

    public trace () {

        let traceObject = new JsonObject ();

        traceObject.set ("thread", this.logObject.get ("thread"));
        traceObject.set ("depth", this.logObject.get ("depth"));
        traceObject.set ("method", this.logObject.get ("method"));

        return traceObject;

    }

    public finalize () {

        this.logObject.set ("ending", Date.now ());
        this.logObject.set ("interval", ((new Date (this.logObject.get ("ending")).getTime () - new Date (this.logObject.get ("starting")).getTime ()) / 1000).toFixed (3));

        let daD1 =  new Date (Number (this.logObject.get ("starting")));

        let yyD1 = daD1.getFullYear ();
        let mmD1 = String (daD1.getMonth () + 1).padStart (2, '0');
        let ddD1 = String (daD1.getDate ()).padStart (2, '0');
        let hhD1 = String (daD1.getHours ()).padStart (2, '0');
        let miD1 = String (daD1.getMinutes ()).padStart (2, '0');
        let ssD1 = String (daD1.getSeconds ()).padStart (2, '0');
        let msD1 = String (daD1.getMilliseconds ()).padStart (3, '0');

        let tiD1 = "";
        tiD1 = tiD1 + yyD1 + "-";
        tiD1 = tiD1 + mmD1 + "-";
        tiD1 = tiD1 + ddD1 + " ";
        tiD1 = tiD1 + hhD1 + ":";
        tiD1 = tiD1 + miD1 + ":";
        tiD1 = tiD1 + ssD1 + ".";
        tiD1 = tiD1 + msD1;

        this.logObject.set ("starting", tiD1);

        let daD2 =  new Date (Number (this.logObject.get ("ending")));

        let yyD2 = daD2.getFullYear ();
        let mmD2 = String (daD2.getMonth () + 1).padStart (2, '0');
        let ddD2 = String (daD2.getDate ()).padStart (2, '0');
        let hhD2 = String (daD2.getHours ()).padStart (2, '0');
        let miD2 = String (daD2.getMinutes ()).padStart (2, '0');
        let ssD2 = String (daD2.getSeconds ()).padStart (2, '0');
        let msD2 = String (daD2.getMilliseconds ()).padStart (3, '0');

        let tiD2 = "";
        tiD2 = tiD2 + yyD2 + "-";
        tiD2 = tiD2 + mmD2 + "-";
        tiD2 = tiD2 + ddD2 + " ";
        tiD2 = tiD2 + hhD2 + ":";
        tiD2 = tiD2 + miD2 + ":";
        tiD2 = tiD2 + ssD2 + ".";
        tiD2 = tiD2 + msD2;

        this.logObject.set ("ending", tiD2);

        let captionString = "";
        captionString = captionString + kleur.magenta (this.logObject.get ("thread")) + " [";

        if (this.logObject.get ("exception")) {

            this.logObject.set ("status", "ERR");

            captionString = captionString + kleur.red ("ERR") + "] [";

        } else {

            if (this.logObject.get ("carry") == true) {

                this.logObject.set ("status", "NOK");

                captionString = captionString + kleur.yellow ("NOK") + "] [";

            } else {

                this.logObject.set ("status", "OK");

                captionString = captionString + kleur.green ("OK ") + "] [";

            }

        }

        this.logObject.del ("carry");
        this.logObject.del ("exception");

        captionString = captionString + kleur.cyan (this.logObject.get ("interval")) + "] [";
        captionString = captionString + kleur.cyan (this.logObject.get ("depth")) + "] ";
        captionString = captionString + this.logObject.get ("class") + ".";
        captionString = captionString + this.logObject.get ("method");

        let continueBoolean = true;

        if (this.logObject.get ("comment") != null || this.logObject.get ("highlight") != null) {

            captionString = captionString + " - " + (this.logObject.get ("comment") + " " + kleur.blue (this.logObject.get ("highlight")).trim ());

            continueBoolean = false;

        }

        if (continueBoolean) {

            if (this.logObject.get ("class").endsWith ("Controller")) {

                if (this.logObject.get ("params") != null) {

                    let paramsString = "{";

                    for (const paramObject of this.logObject.get ("params")) {

                        paramsString = paramsString + paramObject.key + ": ";
                        paramsString = paramsString + paramObject.value + ", ";

                    }

                    paramsString = paramsString.slice (0, paramsString.length - 2);
                    paramsString = paramsString + "}";

                    captionString = captionString + " - Params: " + kleur.blue (paramsString);

                }

                if (this.logObject.get ("redirect") != null) {

                    captionString = captionString + " - Redirect: " + kleur.blue (this.logObject.get ("redirect"));

                }

                if (this.logObject.get ("render") != null) {

                    captionString = captionString + " - View: " + kleur.blue (this.logObject.get ("render"));

                }

                if (this.logObject.get ("redirect") == null && this.logObject.get ("render") == null) {

                    let outgoingString = JSON.stringify (this.logObject.get ("outgoing"));

                    if (outgoingString == null) {

                        outgoingString = "void";

                    }

                    captionString = captionString + " - Return: " + kleur.blue (outgoingString);

                }

            }

            if (this.logObject.get ("class").endsWith ("PostgresTool")) {

                if (this.logObject.get ("resource") != null) {

                    captionString = captionString + " - Function: " + kleur.blue (this.logObject.get ("resource"));

                }

            }

            if (this.logObject.get ("class").endsWith ("ServiceTool")) {

                captionString = captionString + " - Endpoint: " + kleur.blue (this.logObject.get ("resource"));

            }

        }

        this.logObject.set ("interval", parseFloat (this.logObject.get ("interval")));

        console.log (captionString);

        let observabilityTool = ObservabilityTool.getInstance ();
        observabilityTool.after (this.logObject);

        let mongoTool = MongoTool.getInstance ();
        mongoTool.insertTrace (this.logObject).then ();

    }

}

export default LogTool;