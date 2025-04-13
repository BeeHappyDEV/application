import "reflect-metadata";

import {container, inject, singleton} from "tsyringe";

import childProcess from "child_process";
import express from "express";
import localTunnel from "localtunnel";
import superagent from "superagent";

import JsonObject from "./object/JsonObject";
import LogTool from "./toolkit/LogTool";
import PropertiesTool from "./toolkit/PropertiesTool";
import {ReflectionTool} from "./toolkit/ReflectionTool";

import {BackendController} from "./website/BackendController";
import {FrontendController} from "./website/FrontendController";
import {ScheduleController} from "./website/ScheduleController";

@singleton ()
export class Launcher {

    private readonly expressApplication: express.Application;

    constructor (
        @inject (BackendController) private backendController: BackendController,
        @inject (FrontendController) private frontendController: FrontendController,
        @inject (ScheduleController) private scheduleController: ScheduleController
    ) {

        this.expressApplication = express ();

    }

    public async initialize () {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings);
        logTool.comment ("Application:", "Starting");
        logTool.finalize ();

        await this.loadConfiguration ();
        await this.loadWebsite ();
        await this.engineInformation (logTool.trace ());
        await this.environmentInformation (logTool.trace ());

        logTool = new LogTool ();
        logTool.initialize (reflectionStrings);
        logTool.comment ("Application:", "Started");
        logTool.finalize ();

    }

    private async loadConfiguration () {

        this.expressApplication.set ("view engine", "ejs");
        this.expressApplication.set ("views", "src/presentation/");

        this.expressApplication.use (express.json ())
        this.expressApplication.use (express.static ("src/resources/"));
        this.expressApplication.use (express.urlencoded ({extended: true}));

    }

    private async loadWebsite () {

        await this.backendController.execute (this.expressApplication);

        await this.frontendController.execute (this.expressApplication);

        await this.scheduleController.execute ();

    }

    private async engineInformation (traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);
        logTool.comment ("Node:", childProcess.execSync ("node -v").toString ().trim ().slice (1));
        logTool.finalize ();

        logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);
        logTool.comment ("Yarn:", childProcess.execSync ("yarn -v").toString ().trim ());
        logTool.finalize ();

        logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);
        logTool.comment ("Npm:", childProcess.execSync ("npm -v").toString ().trim ());
        logTool.finalize ();

        logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);
        logTool.comment ("Typescript:", childProcess.execSync ("tsc --version").toString ().replace ("Version ", "").trim ());
        logTool.finalize ();

    }

    private async environmentInformation (traceObject: JsonObject) {

        let reflectionStrings = ReflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (reflectionStrings, traceObject);
        logTool.comment ("Version:", await PropertiesTool.get ("application.version"));
        logTool.finalize ();

        let privatePort = process.env.PORT || await PropertiesTool.get ("system.port");

        let privateHost = await PropertiesTool.get ("system.host");

        if (privatePort != "80") {

            privateHost = privateHost + ":" + privatePort;

        }

        let environmentString = process.argv [2].slice (2);

        switch (environmentString) {

            case "dev":

                logTool = new LogTool ();
                logTool.initialize (reflectionStrings, traceObject);
                logTool.comment ("Environment:", "DEVELOPMENT");
                logTool.finalize ();

                logTool = new LogTool ();
                logTool.initialize (reflectionStrings, traceObject);

                this.expressApplication.listen (privatePort);

                logTool.comment ("Private host:", privateHost);
                logTool.finalize ();

                if (await PropertiesTool.get ("system.tunnel.enable") === true) {

                    logTool = new LogTool ();
                    logTool.initialize (reflectionStrings, traceObject);

                    let subdomainString = await PropertiesTool.get ("application.name") + await PropertiesTool.get ("application.domain");
                    subdomainString = subdomainString.toString ().toLowerCase ().replace (".", "");

                    let tunnel = await localTunnel ({port: privatePort, subdomain: subdomainString});

                    logTool.comment ("Tunnel host:", tunnel.url);
                    logTool.finalize ();

                    logTool = new LogTool ();
                    logTool.initialize (reflectionStrings, traceObject);

                    let superAgent = superagent.get (await PropertiesTool.get ("integration.public"));

                    let serviceObject = await superAgent.then ();

                    logTool.comment ("Service address:", serviceObject.body.ip);
                    logTool.finalize ();

                }

                break;

            case "prd":

                logTool = new LogTool ();
                logTool.initialize (reflectionStrings, traceObject);
                logTool.comment ("Environment:", "PRODUCTION");
                logTool.finalize ();

                logTool = new LogTool ();
                logTool.initialize (reflectionStrings, traceObject);

                this.expressApplication.listen (privatePort);

                logTool.comment ("Public host:", await PropertiesTool.get ("system.host"));
                logTool.finalize ();

                break;

        }

    }

}

const launcher = container.resolve (Launcher);
launcher.initialize ().then ();