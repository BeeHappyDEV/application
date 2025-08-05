import 'newrelic';
import 'reflect-metadata';

import {container, inject, injectable} from 'tsyringe';

import childProcess from 'child_process';
import express from 'express';
import expressWs from 'express-ws';
import localTunnel from 'localtunnel';
import superagent from 'superagent';

import {MongoDbModule} from '../middleware/MongoDbModule';
import {NaturalModule} from '../middleware/NaturalModule';
import {PostgresModule} from '../middleware/PostgresModule';

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

import {ApplicationConstants} from '../constants/ApplicationConstants';

@injectable ()
export class ApplicationEntry {

    private readonly expressApplication: express.Application;
    private readonly expressWsInstance: expressWs.Instance;

    constructor (
        @inject ('LogToolFactory') private logToolFactory: () => LogTool,
        @inject (MongoDbModule) private mongoDbModule: MongoDbModule,
        @inject (NaturalModule) private naturalModule: NaturalModule,
        @inject (PostgresModule) private postgresModule: PostgresModule,
        @inject (MessengerController) private messengerController: MessengerController,
        @inject (TelegramController) private telegramController: TelegramController,
        @inject (WhatsAppController) private whatsAppController: WhatsAppController,
        @inject (DefaultController) private defaultController: DefaultController,
        @inject (BackendController) private backendController: BackendController,
        @inject (FrontendController) private frontendController: FrontendController,
        @inject (ScheduleController) private scheduleController: ScheduleController,
        @inject (PropertiesTool) private propertiesTool: PropertiesTool,
    ) {
        this.expressApplication = express ();
        this.expressWsInstance = expressWs (this.expressApplication);
    }

    public async initialize (): Promise<void> {

        const logTool = this.logToolFactory ();
        logTool.OK (ApplicationConstants.LABEL_APPLICATION, ApplicationConstants.STATUS_STARTING);

        await this.middlewareInformation (logTool.getTrace ());
/*
        let aaa: Record<string, any> = {};
        aaa = await this.naturalModule.getResponse ("cuanto debo este mes");
        console.log ('-> ', aaa.preprocessed);
        console.log ('   ', aaa.intent);
        console.log ('   ', aaa.response.message);
        console.log ();
        aaa = await this.naturalModule.getResponse ("quien es mi agente de cuentas");
        console.log ('-> ', aaa.preprocessed);
        console.log ('   ', aaa.intent);
        console.log ('   ', aaa.response.message);
        console.log ();
        aaa = await this.naturalModule.getResponse ("a que hora cierran la oficina");
        console.log ('-> ', aaa.preprocessed);
        console.log ('   ', aaa.intent);
        console.log ('   ', aaa.response.message);
        console.log ();
        aaa = await this.naturalModule.getResponse ("necesito el correo de soporte");
        console.log ('-> ', aaa.preprocessed);
        console.log ('   ', aaa.intent);
        console.log ('   ', aaa.response.message);
        console.log ();
        aaa = await this.naturalModule.getResponse ("hola que tal");
        console.log ('-> ', aaa.preprocessed);
        console.log ('   ', aaa.intent);
        console.log ('   ', aaa.response.message);
        console.log ();
        aaa = await this.naturalModule.getResponse ("háblame del clima en la luna");
        console.log ('-> ', aaa.preprocessed);
        console.log ('   ', aaa.intent);
        console.log ('   ', aaa.response.message);
        console.log ();
        aaa = await this.naturalModule.getResponse ("tienes el telefono del ejecutivo?");
        console.log ('-> ', aaa.preprocessed);
        console.log ('   ', aaa.intent);
        console.log ('   ', aaa.response.message);
        console.log ();
*/
        await this.engineInformation (logTool.getTrace ());

        await this.environmentInformation (logTool.getTrace ());

        await this.channelInformation (logTool.getTrace ());

        await this.websiteInformation (logTool.getTrace ());

        logTool.OK (ApplicationConstants.LABEL_APPLICATION, ApplicationConstants.STATUS_STARTED);

    }

    private async middlewareInformation (traceObject: Record<string, any>): Promise<void> {

        const logTool = this.logToolFactory ();
        logTool.setTrace (traceObject);

        if (await this.mongoDbModule.isInitialized ()) {

            logTool.OK (ApplicationConstants.MODULE_MONGODB, ApplicationConstants.STATUS_INITIALIZED);

        } else {

            logTool.ERR (ApplicationConstants.MODULE_MONGODB, ApplicationConstants.STATUS_NOT_INITIALIZED);

        }

        if (await this.postgresModule.isInitialized ()) {

            logTool.OK (ApplicationConstants.MODULE_POSTGRES, ApplicationConstants.STATUS_INITIALIZED);

        } else {

            logTool.ERR (ApplicationConstants.MODULE_POSTGRES, ApplicationConstants.STATUS_NOT_INITIALIZED);

        }

        if (await this.naturalModule.isInitialized ()) {

            logTool.OK (ApplicationConstants.MODULE_NATURAL, ApplicationConstants.STATUS_INITIALIZED);

        } else {

            logTool.ERR (ApplicationConstants.MODULE_NATURAL, ApplicationConstants.STATUS_NOT_INITIALIZED);

        }

    }

    private async engineInformation (traceObject: Record<string, any>): Promise<void> {

        const logTool = this.logToolFactory ();
        logTool.setTrace (traceObject);

        const versionsStringMap = {
            [ApplicationConstants.LABEL_NODE]: childProcess.execSync ('node -v').toString ().trim ().slice (1),
            [ApplicationConstants.LABEL_PNPM]: childProcess.execSync ('pnpm -v').toString ().trim (),
            [ApplicationConstants.LABEL_TYPESCRIPT]: childProcess.execSync ('tsc --version').toString ().replace (ApplicationConstants.LABEL_VERSION + ' ', '').trim ()
        };

        for (const [keyString, valueString] of Object.entries (versionsStringMap)) {

            logTool.OK (keyString, valueString);

        }

    }

    private async environmentInformation (traceObject: Record<string, any>): Promise<void> {

        const logTool = this.logToolFactory ();
        logTool.setTrace (traceObject);

        logTool.OK (ApplicationConstants.LABEL_VERSION, CommonsTool.getApplicationVersion ());

        let portString = await this.propertiesTool.get ('system.port');

        let siteString = await this.propertiesTool.get ('system.site');

        const environmentString = process.argv [2].slice (2);

        switch (environmentString) {

            case ApplicationConstants.LABEL_DEVELOPMENT:

                await this.startDevelopmentEnvironment (logTool.getTrace (), portString, siteString);

                break;

            case ApplicationConstants.LABEL_PRODUCTION:

                await this.startProductionEnvironment (logTool.getTrace (), portString, siteString);

                break;

        }

    }

    private async startDevelopmentEnvironment (traceObject: Record<string, any>, portString: string, siteString: string): Promise<void> {

        const logTool = this.logToolFactory ();
        logTool.setHardTrace (traceObject);

        logTool.OK (ApplicationConstants.LABEL_ENVIRONMENT, ApplicationConstants.ENVIRONMENT_DEVELOPMENT);

        await new Promise<void> ((callbackFunction): void => {

            this.expressApplication.listen (portString, async () => {

                logTool.OK (ApplicationConstants.LABEL_PRIVATE_HOST, siteString);

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

                logTool.OK (ApplicationConstants.LABEL_TUNNEL_HOST, developmentTunnel.url);

                addressString = await superagent.get (await this.propertiesTool.get ('integration.public')).then (responseObject => responseObject.body.ip);

                logTool.OK (ApplicationConstants.LABEL_PUBLIC_ADDRESS, addressString);

            } catch (exception) {

                logTool.ERR (ApplicationConstants.LABEL_TUNNEL_HOST, ApplicationConstants.STATUS_TUNNEL_FAILED);

            }

        }

    }

    private async startProductionEnvironment (traceObject: Record<string, any>, portString: string, siteString: string): Promise<void> {

        const logTool = this.logToolFactory ();
        logTool.setHardTrace (traceObject);

        logTool.OK (ApplicationConstants.LABEL_ENVIRONMENT, ApplicationConstants.ENVIRONMENT_PRODUCTION);

        await new Promise<void> ((callbackFunction) => {

            this.expressApplication.listen (portString, async () => {

                logTool.OK (ApplicationConstants.LABEL_PRIVATE_HOST, siteString);

                callbackFunction ();

            })
        });

    }

    private async channelInformation (traceObject: Record<string, any>): Promise<void> {

        const logTool = this.logToolFactory ();
        logTool.setTrace (traceObject);

        await this.messengerController.initialize (this.expressApplication);

        if (await this.messengerController.isInitialized ()) {

            logTool.OK (ApplicationConstants.CHANNEL_MESSENGER, ApplicationConstants.STATUS_INITIALIZED);

        } else {

            logTool.ERR (ApplicationConstants.CHANNEL_MESSENGER, ApplicationConstants.STATUS_NOT_INITIALIZED);

        }

        await this.telegramController.initialize (this.expressApplication);

        if (await this.telegramController.isInitialized ()) {

            logTool.OK (ApplicationConstants.CHANNEL_TELEGRAM, ApplicationConstants.STATUS_INITIALIZED);

        } else {

            logTool.ERR (ApplicationConstants.CHANNEL_TELEGRAM, ApplicationConstants.STATUS_NOT_INITIALIZED);

        }

        await this.whatsAppController.initialize (this.expressApplication, this.expressWsInstance);

        if (await this.whatsAppController.isInitialized ()) {

            logTool.OK (ApplicationConstants.CHANNEL_WHATSAPP, ApplicationConstants.STATUS_INITIALIZED);

        } else {

            logTool.ERR (ApplicationConstants.CHANNEL_WHATSAPP, ApplicationConstants.STATUS_NOT_INITIALIZED);

        }

    }

    private async websiteInformation (traceObject: Record<string, any>): Promise<void> {

        const logTool = this.logToolFactory ();
        logTool.setTrace (traceObject);

        await this.defaultController.initialize (this.expressApplication);

        if (await this.defaultController.isInitialized ()) {

            logTool.OK (ApplicationConstants.WEBSITE_DEFAULT, ApplicationConstants.STATUS_INITIALIZED);

        } else {

            logTool.ERR (ApplicationConstants.WEBSITE_DEFAULT, ApplicationConstants.STATUS_NOT_INITIALIZED);

        }

        await this.backendController.initialize (this.expressApplication);

        if (await this.backendController.isInitialized ()) {

            logTool.OK (ApplicationConstants.WEBSITE_BACKEND, ApplicationConstants.STATUS_INITIALIZED);

        } else {

            logTool.ERR (ApplicationConstants.WEBSITE_BACKEND, ApplicationConstants.STATUS_NOT_INITIALIZED);

        }

        await this.frontendController.initialize (this.expressApplication);

        if (await this.frontendController.isInitialized ()) {

            logTool.OK (ApplicationConstants.WEBSITE_FRONTEND, ApplicationConstants.STATUS_INITIALIZED);

        } else {

            logTool.ERR (ApplicationConstants.WEBSITE_FRONTEND, ApplicationConstants.STATUS_NOT_INITIALIZED);

        }

        await this.scheduleController.initialize ();

        if (await this.scheduleController.isInitialized ()) {

            logTool.OK (ApplicationConstants.WEBSITE_SCHEDULE, ApplicationConstants.STATUS_INITIALIZED);

        } else {

            logTool.ERR (ApplicationConstants.WEBSITE_SCHEDULE, ApplicationConstants.STATUS_NOT_INITIALIZED);

        }

    }

}

async function applicationEntry (): Promise<void> {

    await RegistryTool.initialize ();

    const applicationEntry = container.resolve (ApplicationEntry);
    await applicationEntry.initialize ();

}

applicationEntry ().then ();