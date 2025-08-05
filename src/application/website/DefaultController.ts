import {injectable} from 'tsyringe';

import express from 'express';

@injectable ()
export class DefaultController {

    private initializedBoolean = false;

    public async initialize (expressApplication: express.Application): Promise<void> {

        expressApplication.set ('view engine', 'ejs');
        expressApplication.set ('views', 'src/presentation/');
        expressApplication.use (express.json ());
        expressApplication.use (express.urlencoded ({extended: true}));
        expressApplication.use (express.static ('src/resources/'));

        this.initializedBoolean = true;

    }

    public async isInitialized (): Promise<boolean> {

        return this.initializedBoolean;

    }

}