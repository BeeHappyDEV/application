import {inject, injectable} from 'tsyringe';

import express from 'express';

import {MessengerService} from './MessengerService';
import {PropertiesModule} from '../middleware/PropertiesModule';

@injectable ()
export class MessengerController {

    constructor (
        @inject (MessengerService) private messengerService: MessengerService,
        @inject (PropertiesModule) private propertiesModule: PropertiesModule
    ) {
        propertiesModule.initialize ().then ();
    }

    // @ts-ignore
    public async initialize (expressApplication: typeof express.application): Promise<void> {

        await this.propertiesModule.get ('');
        await this.messengerService.anyMethod ();

    }

}