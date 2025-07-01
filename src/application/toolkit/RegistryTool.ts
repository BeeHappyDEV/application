import {container} from 'tsyringe';

import {DiscordModule} from 'src/application/middleware/DiscordModule';
import {MongoDbModule} from 'src/application/middleware/MongoDbModule';
import {PostgresModule} from 'src/application/middleware/PostgresModule';
import {WebserviceModule} from 'src/application/middleware/WebserviceModule';

import {MessengerController} from 'src/application/channel/MessengerController';
import {MessengerService} from 'src/application/channel/MessengerService';
import {TelegramController} from 'src/application/channel/TelegramController';
import {TelegramService} from 'src/application/channel/TelegramService';
import {WhatsAppController} from 'src/application/channel/WhatsAppController';
import {WhatsAppService} from 'src/application/channel/WhatsAppService';

import {BackendController} from 'src/application/website/BackendController';
import {BackendService} from 'src/application/website/BackendService';
import {DefaultController} from 'src/application/website/DefaultController';
import {FrontendController} from 'src/application/website/FrontendController';
import {FrontendService} from 'src/application/website/FrontendService';
import {ScheduleController} from 'src/application/website/ScheduleController';
import {ScheduleService} from 'src/application/website/ScheduleService';

import {LogTool} from 'src/application/toolkit/LogTool';
import {PropertiesTool} from 'src/application/toolkit/PropertiesTool';

import {JsonObject} from 'src/application/object/JsonObject';
import {ResultObject} from 'src/application/object/ResultObject';

export class RegistryTool {

    public static async initialize (): Promise<void> {

        await this.registerToolkit ();

        this.registerMiddlewares ();
        this.registerWebsite ();
        this.registerChannels ();
        this.registerObjects ();

    }

    private static async registerToolkit (): Promise<void> {

        const propertiesTool = new PropertiesTool ();
        await propertiesTool.initialize ();

        container.register (PropertiesTool, {useValue: propertiesTool});

        container.register ('LogFactory', {useClass: LogTool});

        container.register (LogTool, {
            useFactory: (container) => container.resolve<LogTool> ('LogFactory')
        });

    }

    private static registerMiddlewares (): void {

        container.registerSingleton (this.getToken (DiscordModule), DiscordModule);
        container.registerSingleton (this.getToken (MongoDbModule), MongoDbModule);
        container.registerSingleton (this.getToken (PostgresModule), PostgresModule);
        container.registerSingleton (this.getToken (WebserviceModule), WebserviceModule);

    }

    private static registerWebsite (): void {

        container.registerSingleton (this.getToken (DefaultController), DefaultController);
        container.registerSingleton (this.getToken (BackendController), BackendController);
        container.registerSingleton (this.getToken (BackendService), BackendService);
        container.registerSingleton (this.getToken (FrontendController), FrontendController);
        container.registerSingleton (this.getToken (FrontendService), FrontendService);
        container.registerSingleton (this.getToken (ScheduleController), ScheduleController);
        container.registerSingleton (this.getToken (ScheduleService), ScheduleService);

    }

    private static registerChannels (): void {

        container.registerSingleton (this.getToken (MessengerController), MessengerController);
        container.registerSingleton (this.getToken (MessengerService), MessengerService);
        container.registerSingleton (this.getToken (TelegramController), TelegramController);
        container.registerSingleton (this.getToken (TelegramService), TelegramService);
        container.registerSingleton (this.getToken (WhatsAppController), WhatsAppController);
        container.registerSingleton (this.getToken (WhatsAppService), WhatsAppService);

    }

    private static registerObjects (): void {

        container.register (this.getToken (JsonObject), JsonObject);
        container.register (this.getToken (ResultObject), ResultObject);

    }

    private static getToken<T> (clazz: new (...args: any[]) => T): string {

        return 'I' + clazz.name;

    }

}