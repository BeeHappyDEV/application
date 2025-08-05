import {container, DependencyContainer} from 'tsyringe';

import {DiscordModule} from '../middleware/DiscordModule';
import {MongoDbModule} from '../middleware/MongoDbModule';
import {NaturalModule} from '../middleware/NaturalModule';
import {PostgresModule} from '../middleware/PostgresModule';
import {WebserviceModule} from '../middleware/WebserviceModule';

import {MessengerController} from '../channel/MessengerController';
import {MessengerService} from '../channel/MessengerService';
import {TelegramController} from '../channel/TelegramController';
import {TelegramService} from '../channel/TelegramService';
import {WhatsAppController} from '../channel/WhatsAppController';
import {WhatsAppService} from '../channel/WhatsAppService';

import {BackendController} from '../website/BackendController';
import {BackendService} from '../website/BackendService';
import {DefaultController} from '../website/DefaultController';
import {FrontendController} from '../website/FrontendController';
import {FrontendService} from '../website/FrontendService';
import {ScheduleController} from '../website/ScheduleController';
import {ScheduleService} from '../website/ScheduleService';

import {LogTool} from './LogTool';
import {PropertiesTool} from './PropertiesTool';

export class RegistryTool {

    public static async initialize (): Promise<void> {

        await this.registerToolkit ();
        this.registerMiddlewares ();
        this.registerWebsite ();
        this.registerChannels ();

    }

    private static async registerToolkit (): Promise<void> {

        const propertiesTool = container.resolve (PropertiesTool);
        await propertiesTool.initialize ();
        container.register (PropertiesTool, {useValue: propertiesTool});

        container.register ('LogToolFactory', {

            useFactory: (dependencyContainer: DependencyContainer): () => LogTool => {

                return (): LogTool => {

                    return dependencyContainer.resolve (LogTool);

                };

            }

        });

        const postgresModule = container.resolve (PostgresModule);
        const mongoDbModule = container.resolve (MongoDbModule);
        const naturalModule = container.resolve (NaturalModule);

        await Promise.all ([
            await postgresModule.initialize (),
            await mongoDbModule.initialize (),
            await naturalModule.initialize ()
        ]);

        container.register (PostgresModule, {useValue: postgresModule});
        container.register (MongoDbModule, {useValue: mongoDbModule});
        container.register (NaturalModule, {useValue: naturalModule});

    }

    private static registerMiddlewares (): void {

        container.registerSingleton (this.getToken (DiscordModule), DiscordModule);
        container.registerSingleton (this.getToken (MongoDbModule), MongoDbModule);
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

    private static getToken<T> (clazz: new (...args: any[]) => T): symbol {

        return Symbol.for (clazz.name);

    }

}