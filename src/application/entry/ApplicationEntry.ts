import 'reflect-metadata';

import {container, inject, injectable} from 'tsyringe';

import childProcess from 'child_process';
import express from 'express';
import expressWs from 'express-ws';
import localTunnel from 'localtunnel';
import superagent from 'superagent';

import {MessengerController} from '../channel/MessengerController';
import {TelegramController} from '../channel/TelegramController';
import {WhatsAppController} from '../channel/WhatsAppController';

import {BackendController} from '../website/BackendController';
import {FrontendController} from '../website/FrontendController';
import {ScheduleController} from '../website/ScheduleController';
import {DefaultController} from '../website/DefaultController';

import {CommonsTool} from '../toolkit/CommonsTool';
import {LogTool} from '../toolkit/LogTool';
import {PropertiesTool} from '../toolkit/PropertiesTool';
import {RegistryTool} from '../toolkit/RegistryTool';

import {JsonObject} from '../object/JsonObject';

@injectable ()
export class ApplicationEntry {

    private readonly expressApplication: express.Application;
    private readonly expressWsInstance: expressWs.Instance;

    constructor (
        @inject (MessengerController) private messengerController: MessengerController,
        @inject (TelegramController) private telegramController: TelegramController,
        @inject (WhatsAppController) private whatsAppController: WhatsAppController,
        @inject (DefaultController) private defaultController: DefaultController,
        @inject (BackendController) private backendController: BackendController,
        @inject (FrontendController) private frontendController: FrontendController,
        @inject (ScheduleController) private scheduleController: ScheduleController,
        @inject (LogTool) private logTool: LogTool,
        @inject (PropertiesTool) private propertiesTool: PropertiesTool,
    ) {
        this.expressApplication = express ();
        this.expressWsInstance = expressWs (this.expressApplication);
    }

    public async initialize (): Promise<void> {

        const stackStringArray = CommonsTool.getStackStringArray ();

        this.logTool.initialize (stackStringArray);
        this.logTool.comment ('Application:', 'Starting');
        this.logTool.finalize ();

        await this.engineInformation (this.logTool.trace ());

        await this.environmentInformation (this.logTool.trace ());

        await this.channelControllers ();

        await this.websiteControllers ();

        this.logTool.comment ('Application:', 'Started');
        this.logTool.finalize ();

    }

    private async engineInformation (traceObject: JsonObject): Promise<void> {

        const stackStringArray = CommonsTool.getStackStringArray ();

        const versionsStringMap = {
            'Node': childProcess.execSync ('node -v').toString ().trim ().slice (1),
            'Pnpm': childProcess.execSync ('pnpm -v').toString ().trim (),
            'Typescript': childProcess.execSync ('tsc --version').toString ().replace ('Version ', '').trim ()
        };

        for (const [keyString, valueString] of Object.entries (versionsStringMap)) {

            this.logTool.initialize (stackStringArray, traceObject, 2);
            this.logTool.comment (keyString + ':', valueString);
            this.logTool.finalize ();

        }

    }

    private async environmentInformation (traceObject: JsonObject): Promise<void> {

        const stackStringArray = CommonsTool.getStackStringArray ();

        this.logTool.initialize (stackStringArray, traceObject, 2);
        this.logTool.comment ('Version:', CommonsTool.getApplicationVersion ());
        this.logTool.finalize ();

        let portString = await this.propertiesTool.get ('system.port');

        let siteString = await this.propertiesTool.get ('system.site');

        const environmentString = process.argv[2].slice (2);

        switch (environmentString) {

            case 'dev':

                await this.startDevelopmentEnvironment (stackStringArray, traceObject, portString, siteString);

                break;

            case 'prd':

                await this.startProductionEnvironment (stackStringArray, traceObject, portString, siteString);

                break;

        }

    }

    private async startDevelopmentEnvironment (stackStringArray: string[], traceObject: JsonObject, portString: string, siteString: string): Promise<void> {

        this.logTool.initialize (stackStringArray, traceObject, 2);
        this.logTool.comment ('Environment:', 'DEVELOPMENT');
        this.logTool.finalize ();

        await new Promise<void> ((callbackFunction) => {

            this.expressApplication.listen (portString, async () => {

                this.logTool.initialize (stackStringArray, traceObject, 2);
                this.logTool.comment ('Private host:', siteString);
                this.logTool.finalize ();

                callbackFunction ();

            })
        });

        let addressString = '';

        if (await this.propertiesTool.get ('system.tunnel.enable')) {

            try {

                const subdomainString = (await this.propertiesTool.get ('application.name') + await this.propertiesTool.get ('application.domain')).toLowerCase ().replace ('.', '');

                const developmentTunnel = await localTunnel ({
                    port: Number (portString),
                    subdomain: subdomainString
                });

                this.logTool.initialize (stackStringArray, traceObject, 2);
                this.logTool.comment ('Tunnel host:', developmentTunnel.url);
                this.logTool.finalize ();

                addressString = await superagent.get (await this.propertiesTool.get ('integration.public')).then (responseObject => responseObject.body.ip);

                this.logTool.initialize (stackStringArray, traceObject, 2);
                this.logTool.comment ('Public address:', addressString);
                this.logTool.finalize ();

            } catch (exception) {

                this.logTool.initialize (stackStringArray, traceObject, 2);
                this.logTool.exception ();
                this.logTool.comment ('Tunnel host:', 'Failed to start tunnel');
                this.logTool.finalize ();

            }

        }

    }

    private async startProductionEnvironment (stackStringArray: string[], traceObject: JsonObject, portString: string, siteString: string): Promise<void> {

        this.logTool.initialize (stackStringArray, traceObject);
        this.logTool.comment ('Environment:', 'PRODUCTION');
        this.logTool.finalize ();

        await new Promise<void> ((callbackFunction) => {

            this.expressApplication.listen (portString, async () => {

                this.logTool.initialize (stackStringArray, traceObject, 2);
                this.logTool.comment ('Private host:', siteString);
                this.logTool.finalize ();

                callbackFunction ();

            })
        });

    }

    private async channelControllers (): Promise<void> {

        await this.messengerController.initialize (this.expressApplication);

        await this.telegramController.initialize (this.expressApplication);

        await this.whatsAppController.initialize (this.expressApplication, this.expressWsInstance);

    }

    private async websiteControllers (): Promise<void> {

        await this.defaultController.initialize (this.expressApplication);

        await this.backendController.initialize (this.expressApplication);

        await this.frontendController.initialize (this.expressApplication);

        await this.scheduleController.initialize ();

    }

}

async function applicationEntry () {

    await RegistryTool.initialize ().then ();

    const applicationEntry = container.resolve (ApplicationEntry);
    applicationEntry.initialize ().then ();

}

applicationEntry ().then ();