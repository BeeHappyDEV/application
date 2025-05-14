import 'reflect-metadata';

import {container, inject, injectable} from 'tsyringe';

import childProcess from 'child_process';
import express from 'express';
import expressWs from 'express-ws';
import localTunnel from 'localtunnel';
import superagent from 'superagent';

import {MessengerController} from './channel/MessengerController';
import {TelegramController} from './channel/TelegramController';
import {WhatsAppController} from './channel/WhatsAppController';
import {BackendController} from './website/BackendController';
import {DocumentController} from './website/DocumentController';
import {FrontendController} from './website/FrontendController';
import {ScheduleController} from './website/ScheduleController';
import {PropertiesModule} from './middleware/PropertiesModule';
import {CommonsTool} from './toolkit/CommonsTool';
import {LogTool} from './toolkit/LogTool';
import {RegistryTool} from './toolkit/RegistryTool';
import {JsonObject} from './object/JsonObject';

@injectable ()
export class LauncherEntry {

    private readonly expressApplication: express.Application;
    private readonly expressWsInstance: expressWs.Instance;

    constructor (
        @inject (MessengerController) private messengerController: MessengerController,
        @inject (TelegramController) private telegramController: TelegramController,
        @inject (WhatsAppController) private whatsAppController: WhatsAppController,
        @inject (BackendController) private backendController: BackendController,
        @inject (DocumentController) private documentController: DocumentController,
        @inject (FrontendController) private frontendController: FrontendController,
        @inject (ScheduleController) private scheduleController: ScheduleController,
        @inject (PropertiesModule) private propertiesModule: PropertiesModule
    ) {
        this.expressApplication = express ();
        this.expressWsInstance = expressWs (this.expressApplication);
        propertiesModule.initialize ().then ();
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

        let hostString = '';

        let portString = '';

        const environmentString = process.argv[2].slice (2);

        switch (environmentString) {

            case 'dev':

                hostString = await this.propertiesModule.get ('system.host');

                portString = process.env.PORT || await this.propertiesModule.get ('system.port');

                if (portString !== '80') {

                    hostString += ':' + portString;

                }

                await this.startDevelopmentEnvironment (stackStrings, traceObject, portString, hostString);

                break;

            case 'prd':

                hostString = await superagent.get (await this.propertiesModule.get ('integration.public')).then (responseObject => responseObject.body.ip);

                portString = process.env.PORT || await this.propertiesModule.get ('system.port');

                if (portString !== '80') {

                    hostString += ':' + portString;

                }

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

        if (await this.propertiesModule.get ('system.tunnel.enable')) {

            try {

                const subdomainString = (await this.propertiesModule.get ('application.name') + await this.propertiesModule.get ('application.domain')).toLowerCase ().replace ('.', '');

                const developmentTunnel = await localTunnel ({
                    port: Number (portString),
                    subdomain: subdomainString
                });

                logTool.initialize (stackStrings, traceObject, 2);
                logTool.comment ('Tunnel host:', developmentTunnel.url);
                logTool.finalize ();

                const addressString = await superagent.get (await this.propertiesModule.get ('integration.public')).then (responseObject => responseObject.body.ip);

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

        await new Promise<void> ((callback) => {

            this.expressApplication.listen (portString, async () => {

                logTool.initialize (stackStrings, traceObject, 2);
                logTool.comment ('Private host:', hostString);
                logTool.finalize ();

                callback ();

            })
        });

    }

    private async channelComponents (): Promise<void> {

        await this.messengerController.initialize (this.expressApplication);
        await this.telegramController.initialize (this.expressApplication);
        await this.whatsAppController.initialize (this.expressApplication, this.expressWsInstance);

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
        await this.documentController.initialize (this.expressApplication);
        await this.frontendController.initialize (this.expressApplication);
        await this.scheduleController.initialize ();

    }

}

RegistryTool.initialize ().then ();

const launcherEntry = container.resolve (LauncherEntry);
launcherEntry.initialize ().then ();