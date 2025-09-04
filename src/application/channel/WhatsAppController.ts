import {inject, injectable} from 'tsyringe';

import {LogTool} from '../toolkit/LogTool';
import {PropertiesTool} from '../toolkit/PropertiesTool';

import {WhatsAppService} from './WhatsAppService';
import {container} from "tsyringe";

@injectable ()
export class WhatsAppController {

    private initializedBoolean = false;

    constructor (
        @inject ('LogToolFactory') private logToolFactory: () => LogTool,
        @inject (PropertiesTool) private propertiesTool: PropertiesTool,
        @inject (WhatsAppService) private whatsAppService: WhatsAppService
    ) {
    }

    public async initialize (): Promise<void> {

        const propertyArray = Array (await this.propertiesTool.get ('channel.whatsapp.instances'));

        for (const propertyEntry of propertyArray [0]) {

            console.log (propertyEntry.name + ' - ' + propertyEntry.phone);

            const whatsAppService = container.resolve (WhatsAppService);

            await whatsAppService.initialize (propertyEntry.phone);
            await whatsAppService.connect ();

            this.initializedBoolean = true;

        }

    }

    public async isInitialized (): Promise<boolean> {

        return this.initializedBoolean;

    }

}