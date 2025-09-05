import {container, inject, injectable} from 'tsyringe';

import {PropertiesTool} from '../toolkit/PropertiesTool';

import {WhatsAppService} from './WhatsAppService';

@injectable ()
export class WhatsAppController {

    private instanceRecord: Record<string, any> = [];

    constructor (
        @inject (PropertiesTool) private propertiesTool: PropertiesTool
    ) {
    }

    public async initialize (): Promise<void> {

        const propertyArray = Array (await this.propertiesTool.get ('channel.whatsapp.instances'));

        for (const propertyEntry of Object.values (propertyArray [0])) {

            const propertyRecord: Record<string, any> = propertyEntry as unknown as Record<string, any>;

            const instanceRecord: Record<string, any> = {};
            instanceRecord.nameString = propertyRecord.name;
            instanceRecord.numberString = propertyRecord.number;

            const whatsAppService = container.resolve (WhatsAppService);
            await whatsAppService.initialize (instanceRecord);

            instanceRecord.initializedBoolean = await whatsAppService.isInitialized ();

            this.instanceRecord.push (instanceRecord);

        }

    }

    public async isInitialized (): Promise<Record<string, any>> {

        return this.instanceRecord;

    }

}