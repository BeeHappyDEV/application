import {container, DependencyContainer} from 'tsyringe';

import {LogTool} from './LogTool';
import {PropertiesTool} from './PropertiesTool';

import {DiscordModule} from '../middleware/DiscordModule';
import {MongoDbModule} from '../middleware/MongoDbModule';
import {NaturalModule} from '../middleware/NaturalModule';
import {PostgresModule} from '../middleware/PostgresModule';
import {WebserviceModule} from '../middleware/WebserviceModule';

import {GatewayController} from '../channel/GatewayController';
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
import {ExampleController} from "../channel/ExampleController";

export class RegistryTool {

    public static classRecord: Record<string, any> = {};

    public static async initialize (): Promise<void> {

        await this.registerToolkit ();
        this.registerMiddlewares ();
        this.registerWebsite ();
        this.registerChannels ();

    }

    public static async getClass<T> (classString: string): Promise<T> {

        const classObject = this.classRecord [classString];

        return container.resolve (classObject) as T;
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

        RegistryTool.registerSingletonClass (DiscordModule);
        RegistryTool.registerSingletonClass (MongoDbModule);
        RegistryTool.registerSingletonClass (WebserviceModule);

    }

    private static registerWebsite (): void {

        RegistryTool.registerSingletonClass (DefaultController);
        RegistryTool.registerSingletonClass (BackendController);
        RegistryTool.registerSingletonClass (BackendService);
        RegistryTool.registerSingletonClass (FrontendController);
        RegistryTool.registerSingletonClass (FrontendService);
        RegistryTool.registerSingletonClass (ScheduleController);
        RegistryTool.registerSingletonClass (ScheduleService);

    }

    private static registerChannels (): void {

        RegistryTool.registerSingletonClass (GatewayController);
        RegistryTool.registerSingletonClass (MessengerController);
        RegistryTool.registerSingletonClass (MessengerService);
        RegistryTool.registerSingletonClass (TelegramController);
        RegistryTool.registerSingletonClass (TelegramService);
        RegistryTool.registerSingletonClass (WhatsAppController);
        RegistryTool.registerPrototypeClass (WhatsAppService);
        RegistryTool.registerSingletonClass (ExampleController);

    }

    private static registerPrototypeClass<T> (clazz: new (...args: any []) => T): void {

        container.register (Symbol.for (clazz.name), clazz);

        this.classRecord [clazz.name] = clazz;

    }

    private static registerSingletonClass<T> (clazz: new (...args: any []) => T): void {

        container.registerSingleton (Symbol.for (clazz.name), clazz);

        this.classRecord [clazz.name] = clazz;

    }

}