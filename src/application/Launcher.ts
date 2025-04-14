import "reflect-metadata";

import {container, inject, singleton} from "tsyringe";
import childProcess from "child_process";
import express from "express";
import localTunnel from "localtunnel";
import superagent from "superagent";
import {PropertiesTool} from "./toolkit/PropertiesTool";
import {LogTool} from "./toolkit/LogTool";
import {ReflectionTool} from "./toolkit/ReflectionTool";
import JsonObject from "./object/JsonObject";

@singleton ()
export class Launcher {

    private readonly expressApplication: express.Application;

    constructor (
        @inject (PropertiesTool) private readonly propertiesTool: PropertiesTool,
        @inject (ReflectionTool) private readonly reflectionTool: ReflectionTool
    ) {
        this.expressApplication = express ();
    }

    public async initialize (): Promise<void> {

        const reflectionStrings = this.reflectionTool.getMethodName ();

        let logTool = new LogTool ();
        logTool.initialize (null, reflectionStrings);
        logTool.comment ("Application:", "Starting");
        logTool.finalize ();

        await this.propertiesTool.load ();

        await Promise.all ([
            this.loadConfiguration (),
            this.engineInformation (logTool.trace ()),
            this.environmentInformation (logTool.trace ()),
            this.loadWebsite ()
        ]);

        logTool = new LogTool ();
        logTool.initialize (null, reflectionStrings);
        logTool.comment ("Application:", "Started");
        logTool.finalize ();

    }

    private async loadConfiguration (): Promise<void> {

        this.expressApplication.set ("view engine", "ejs");
        this.expressApplication.set ("views", "src/presentation/");
        this.expressApplication.use (express.json ());
        this.expressApplication.use (express.static ("src/resources/"));
        this.expressApplication.use (express.urlencoded ({extended: true}));

    }

    private async loadWebsite () {
        /*
                await Promise.all ([
                    this.backendController.execute (this.expressApplication),
                    this.frontendController.execute (this.expressApplication),
                    this.scheduleController.execute ()
                ]);
        */
    }

    private async engineInformation (traceObject: JsonObject): Promise<void> {

        const reflectionStrings = this.reflectionTool.getMethodName ();

        const logTool = new LogTool ();
        logTool.initialize (traceObject, reflectionStrings);

        const versionsMap = {
            "Node": childProcess.execSync ("node -v").toString ().trim ().slice (1),
            "Yarn": childProcess.execSync ("yarn -v").toString ().trim (),
            "Npm": childProcess.execSync ("npm -v").toString ().trim (),
            "Typescript": childProcess.execSync ("tsc --version").toString ().replace ("Version ", "").trim ()
        };

        for (const [keyString, valueString] of Object.entries (versionsMap)) {

            logTool.comment (keyString + ":", valueString);
            logTool.finalize ();

        }

    }

    private async environmentInformation (traceObject: JsonObject): Promise<void> {

        const reflectionStrings = this.reflectionTool.getMethodName ();

        const logTool = new LogTool ();
        logTool.initialize (traceObject, reflectionStrings);

        try {

            const versionString = await this.propertiesTool.require ("application.version");

            logTool.comment ("Version:", versionString);
            logTool.finalize ();

            let hostString = await this.propertiesTool.require ("system.host");

            const portString = process.env.PORT || await this.propertiesTool.get ("system.port");

            if (portString !== "80") {

                hostString += ":" + portString;

            }

            const environmentString = process.argv[2].slice (2);

            switch (environmentString) {

                case "dev":

                    await this.startDevelopmentEnvironment (logTool, traceObject, reflectionStrings, portString, hostString);

                    break;

                case "prd":

                    await this.startProductionEnvironment (logTool, traceObject, reflectionStrings, portString, hostString);

                    break;

            }

        } catch (error) {

            logTool.comment ("Error:", "Failed to load environment information");
            logTool.exception ();
            logTool.finalize ();

        }

    }

    private async startDevelopmentEnvironment (logTool: LogTool, traceObject: JsonObject, reflectionStrings: string[], portString: string, hostString: string): Promise<void> {

        logTool.initialize (traceObject, reflectionStrings);
        logTool.comment ("Environment:", "DEVELOPMENT");
        logTool.finalize ();

        this.expressApplication.listen (portString, () => {

            logTool.initialize (traceObject, reflectionStrings);
            logTool.comment ("Private host:", hostString);
            logTool.finalize ();

        });

        if (await this.propertiesTool.get ("system.tunnel.enable", true)) {

            try {

                const subdomainString = (await this.propertiesTool.require ("application.name") + await this.propertiesTool.require ("application.domain")).toLowerCase ().replace (".", "");

                const developmentTunnel = await localTunnel ({
                    port: Number (portString),
                    subdomain: subdomainString
                });

                logTool.initialize (traceObject, reflectionStrings);
                logTool.comment ("Tunnel host:", developmentTunnel.url);
                logTool.finalize ();

                const addressString = await superagent.get (await this.propertiesTool.require ("integration.public")).then (responseObject => responseObject.body.ip);

                logTool.initialize (traceObject, reflectionStrings);
                logTool.comment ("Public address:", addressString);
                logTool.finalize ();

            } catch (error) {

                logTool.initialize (traceObject, reflectionStrings);
                logTool.exception ();
                logTool.comment ("Tunnel host:", "Failed to start tunnel");
                logTool.finalize ();

            }

        }

    }

    private async startProductionEnvironment (logTool: LogTool, traceObject: JsonObject, reflectionStrings: string[], portString: string, hostString: string): Promise<void> {

        logTool.initialize (traceObject, reflectionStrings);
        logTool.comment ("Environment:", "PRODUCTION");
        logTool.finalize ();

        this.expressApplication.listen (portString, () => {

            logTool.initialize (traceObject, reflectionStrings);
            logTool.comment ("Public host:", hostString);
            logTool.finalize ();

        });

    }

}

const launcher = container.resolve (Launcher);
launcher.initialize ().then ();