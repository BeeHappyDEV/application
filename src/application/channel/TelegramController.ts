import {inject, injectable} from 'tsyringe';

import express from 'express';

import {TelegramService} from './TelegramService';
import {PropertiesModule} from '../middleware/PropertiesModule';

@injectable ()
export class TelegramController {

    constructor (
        @inject (TelegramService) private telegramService: TelegramService,
        @inject (PropertiesModule) private propertiesModule: PropertiesModule
    ) {
        propertiesModule.initialize ().then ();
    }

    // @ts-ignore
    public async initialize (expressApplication: typeof express.application): Promise<void> {

        await this.propertiesModule.get ('');
        await this.telegramService.anyMethod ();

    }

}