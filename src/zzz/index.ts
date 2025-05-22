import 'reflect-metadata';

import {container, inject, injectable} from "tsyringe";

import {DatabaseService} from './database/DatabaseService';
import {ApplicationService} from './application/ApplicationService';

@injectable ()
export class LauncherEntry {

    constructor (
        @inject (ApplicationService) private applicationService: ApplicationService,
        @inject (DatabaseService) private databaseService: DatabaseService
    ) {
    }

    public async initialize (): Promise<void> {

        console.log ('Iniciando generación de documentación...');

        await this.applicationService.process ();

        await this.databaseService.process ();

        console.log ('Documentación generada exitosamente');

    }

}

const launcherEntry = container.resolve (LauncherEntry);
launcherEntry.initialize ().then ();