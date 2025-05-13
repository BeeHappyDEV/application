import 'reflect-metadata';

import {container} from 'tsyringe';

import {MessengerController} from '../channel/MessengerController';
import {MessengerService} from '../channel/MessengerService';
import {TelegramController} from '../channel/TelegramController';
import {TelegramService} from '../channel/TelegramService';
import {WhatsAppController} from '../channel/WhatsAppController';
import {WhatsAppService} from '../channel/WhatsAppService';
import {BackendController} from '../website/BackendController';
import {BackendService} from '../website/BackendService';
import {FrontendController} from '../website/FrontendController';
import {FrontendService} from '../website/FrontendService';
import {ScheduleController} from '../website/ScheduleController';
import {ScheduleService} from '../website/ScheduleService';
import {JsonObject} from '../object/JsonObject';
import {ResultObject} from '../object/ResultObject';
import {PostgresModule} from "../middleware/PostgresModule";

export class RegistryTool {

    public static async initialize (): Promise<void> {

        container.registerSingleton (PostgresModule);

        container.registerSingleton (MessengerController);
        container.registerSingleton (MessengerService);
        container.registerSingleton (TelegramController);
        container.registerSingleton (TelegramService);
        container.registerSingleton (WhatsAppController);
        container.registerSingleton (WhatsAppService);

        container.registerSingleton (BackendController);
        container.registerSingleton (BackendService);
        container.registerSingleton (FrontendController);
        container.registerSingleton (FrontendService);
        container.registerSingleton (ScheduleController);
        container.registerSingleton (ScheduleService);

        container.register (JsonObject, JsonObject);
        container.register (ResultObject, ResultObject);

    }

}