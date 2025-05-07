import 'reflect-metadata';

import {container, inject, injectable} from 'tsyringe';

import childProcess from 'child_process';
import express from 'express';
import localTunnel from 'localtunnel';
import superagent from 'superagent';

import {BackendController} from './website/BackendController';
import {FrontendController} from './website/FrontendController';
import {ScheduleController} from './website/ScheduleController';
//import {WhatsAppController} from './channel/WhatsAppController';
import {CommonsTool} from './toolkit/CommonsTool';
import {LogTool} from './toolkit/LogTool';
import {PropertiesTool} from './toolkit/PropertiesTool';
import {JsonObject} from './object/JsonObject';

import expressWs from 'express-ws';

@injectable ()
export class Launcher {

    private readonly expressApplication: express.Application;
    private readonly expressWsInstance: expressWs.Instance;

    constructor (
        @inject (BackendController) private backendController: BackendController,
        @inject (FrontendController) private frontendController: FrontendController,
        @inject (ScheduleController) private scheduleController: ScheduleController,
        //@inject (WhatsAppController) private whatsAppController: WhatsAppController,
        @inject (PropertiesTool) private propertiesTool: PropertiesTool
    ) {
        this.expressApplication = express ();
        //this.expressWsInstance = expressWs (this.expressApplication);
        this.expressWsInstance = expressWs (express ());
        console.log(this.expressWsInstance);
        propertiesTool.initialize ().then ();
    }

    public async initialize (): Promise<void> {

        const stackStrings = await CommonsTool.getStackStrings ();

        const logTool = container.resolve (LogTool);
        logTool.initialize (stackStrings);
        logTool.comment ('Application:', 'Starting');
        logTool.finalize ();

        await this.engineInformation (logTool.trace ());
        await this.environmentInformation (logTool.trace ());
        await this.channelComponents ();
        await this.staticComponents ();
        await this.dynamicComponents ();

        logTool.comment ('Application:', 'Started');
        logTool.finalize ();

    }

    private async engineInformation (traceObject: JsonObject): Promise<void> {

        const stackStrings = await CommonsTool.getStackStrings ();

        const versionsMap = {
            'Node': childProcess.execSync ('node -v').toString ().trim ().slice (1),
            'Yarn': childProcess.execSync ('yarn -v').toString ().trim (),
            'Npm': childProcess.execSync ('npm -v').toString ().trim (),
            'Typescript': childProcess.execSync ('tsc --version').toString ().replace ('Version ', '').trim ()
        };

        for (const [keyString, valueString] of Object.entries (versionsMap)) {

            const logTool = container.resolve (LogTool);
            logTool.initialize (stackStrings, traceObject, 2);
            logTool.comment (keyString + ':', valueString);
            logTool.finalize ();

        }

    }

    private async environmentInformation (traceObject: JsonObject): Promise<void> {

        const stackStrings = await CommonsTool.getStackStrings ();

        const logTool = container.resolve (LogTool);
        logTool.initialize (stackStrings, traceObject, 2);
        logTool.comment ('Version:', await CommonsTool.getApplicationVersion ());
        logTool.finalize ();

        let hostString = await this.propertiesTool.get ('system.host');

        const portString = process.env.PORT || await this.propertiesTool.get ('system.port');

        if (portString !== '80') {

            hostString += ':' + portString;

        }

        const environmentString = process.argv[2].slice (2);

        switch (environmentString) {

            case 'dev':

                await this.startDevelopmentEnvironment (stackStrings, traceObject, portString, hostString);

                break;

            case 'prd':

                await this.startProductionEnvironment (stackStrings, traceObject, portString, hostString);

                break;

        }

    }

    private async startDevelopmentEnvironment (stackStrings: string[], traceObject: JsonObject, portString: string, hostString: string): Promise<void> {

        const logTool = container.resolve (LogTool);
        logTool.initialize (stackStrings, traceObject, 2);
        logTool.comment ('Environment:', 'DEVELOPMENT');
        logTool.finalize ();

        await new Promise<void> ((callback) => {

            this.expressApplication.listen (portString, async () => {

                logTool.initialize (stackStrings, traceObject, 2);
                logTool.comment ('Private host:', hostString);
                logTool.finalize ();

                callback ();

            })
        });

        if (await this.propertiesTool.get ('system.tunnel.enable')) {

            try {

                const subdomainString = (await this.propertiesTool.get ('application.name') + await this.propertiesTool.get ('application.domain')).toLowerCase ().replace ('.', '');

                const developmentTunnel = await localTunnel ({
                    port: Number (portString),
                    subdomain: subdomainString
                });

                logTool.initialize (stackStrings, traceObject, 2);
                logTool.comment ('Tunnel host:', developmentTunnel.url);
                logTool.finalize ();

                const addressString = await superagent.get (await this.propertiesTool.get ('integration.public')).then (responseObject => responseObject.body.ip);

                logTool.initialize (stackStrings, traceObject, 2);
                logTool.comment ('Public address:', addressString);
                logTool.finalize ();

            } catch (exception) {

                logTool.initialize (stackStrings, traceObject, 2);
                logTool.exception ();
                logTool.comment ('Tunnel host:', 'Failed to start tunnel');
                logTool.finalize ();

            }

        }

    }

    private async startProductionEnvironment (stackStrings: string[], traceObject: JsonObject, portString: string, hostString: string): Promise<void> {

        const logTool = container.resolve (LogTool);
        logTool.initialize (stackStrings, traceObject);
        logTool.comment ('Environment:', 'PRODUCTION');
        logTool.finalize ();

        await new Promise<void> (() => {

            this.expressApplication.listen (portString, () => {

                logTool.initialize (stackStrings, traceObject);
                logTool.comment ('Public host:', hostString);
                logTool.finalize ();

            });

        });

    }

    private async channelComponents (): Promise<void> {

        //await this.whatsAppController.initialize (this.expressApplication, this.expressWsInstance);

    }

    private async staticComponents (): Promise<void> {

        this.expressApplication.set ('view engine', 'ejs');
        this.expressApplication.set ('views', 'src/presentation/');
        this.expressApplication.use (express.json ());
        this.expressApplication.use (express.static ('src/resources/'));
        this.expressApplication.use (express.urlencoded ({extended: true}));

    }

    private async dynamicComponents (): Promise<void> {

        await this.backendController.initialize (this.expressApplication);
        await this.frontendController.initialize (this.expressApplication);
        await this.scheduleController.initialize ();

    }

}

const launcher = container.resolve (Launcher);
launcher.initialize ().then ();