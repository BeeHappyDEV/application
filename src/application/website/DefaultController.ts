import {injectable} from 'tsyringe';

import express from 'express';
//import {inject} from "tsyringe";
//import {PropertiesTool} from "../toolkit/PropertiesTool";

@injectable ()
export class DefaultController {

    constructor (
        //@inject (PropertiesTool) private propertiesTool: PropertiesTool
    ) {
    }

    public async initialize (expressApplication: express.Application): Promise<void> {

        expressApplication.set ('view engine', 'ejs');
        expressApplication.set ('views', 'src/presentation/');
        expressApplication.use (express.json ());
        expressApplication.use (express.urlencoded ({extended: true}));
        expressApplication.use (express.static ('src/resources/'));

/*        const auth0String = await this.propertiesTool.get ('integration.auth0.domain');

        expressApplication.use ((expressRequest: express.Request, expressResponse: express.Response, expressNextFunction: express.NextFunction): void => {

            const hostString = expressRequest.headers.host?.toLowerCase ();

            if (hostString?.includes (auth0String)) {

                expressResponse.status (404).end ();

                return;

            }

            expressNextFunction ();

        });*/

    }

}