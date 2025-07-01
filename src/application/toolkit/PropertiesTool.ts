import {injectable} from 'tsyringe';

import fsExtra from 'fs-extra';
import jsYaml from 'js-yaml';
import superagent from "superagent";

@injectable ()
export class PropertiesTool {

    private propertiesObject: any = null;

    public async initialize (): Promise<void> {

        let fileString = './src/configuration/config.yml';

        const applicationObject = jsYaml.load (fsExtra.readFileSync (fileString, 'utf8'), {});

        const environmentString = process.argv[2].slice (2);

        switch (environmentString) {

            case 'dev':

                fileString = './src/configuration/config.dev.yml';

                break;

            case 'qas':

                fileString = './src/configuration/config.qas.yml';

                break;

            case 'prd':

                fileString = './src/configuration/config.prd.yml';

                break;

        }

        const environmentObject = jsYaml.load (fsExtra.readFileSync (fileString, 'utf8'), {});

        this.propertiesObject = this.mergePropertiesObjects (applicationObject, environmentObject);

        let hostString = '';

        const portString = process.env.PORT || this.propertiesObject['system']['port'];

        switch (environmentString) {

            case 'dev':

                hostString = this.propertiesObject['system']['host'];

                break;

            case 'qas':

                hostString = this.propertiesObject['system']['host'];

                break;

            case 'prd':

                hostString = await superagent.get (this.propertiesObject['integration']['public']).then (responseObject => responseObject.body.ip);

                break;

        }

        if (portString == '80') {

            this.propertiesObject['system']['site'] = hostString;

        } else {

            this.propertiesObject['system']['site'] = hostString + ':' + portString;

        }

    }

    private mergePropertiesObjects (applicationObject: any, environmentObject: any): any {

        const result = {...applicationObject};

        for (const keyString in environmentObject) {

            if (environmentObject.hasOwnProperty (keyString)) {

                if (applicationObject.hasOwnProperty (keyString)) {

                    result[keyString] = this.mergePropertiesObjects (applicationObject[keyString], environmentObject[keyString]);

                } else {

                    result[keyString] = environmentObject[keyString];

                }

            }

        }

        return result;

    }

    public async get (propertyString: string): Promise<string> {

        await this.initialize ();

        const keyArray = propertyString.split ('.');

        let valueString = this.propertiesObject;

        for (const keyString of keyArray) {

            if (!valueString || typeof valueString !== 'object' || !valueString.hasOwnProperty (keyString)) {

                return '';

            }

            valueString = valueString[keyString];

        }

        return valueString;

    }

}