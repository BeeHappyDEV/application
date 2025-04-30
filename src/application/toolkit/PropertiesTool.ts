import {injectable} from 'tsyringe';

import fsExtra from 'fs-extra';
import jsYaml from 'js-yaml';

@injectable ()
export class PropertiesTool {

    private propertiesObject: any = {};

    public async initialize (): Promise<void> {

        let fileString = './src/configuration/config.yml';

        const applicationObject = jsYaml.load (fsExtra.readFileSync (fileString, 'utf8'), {});

        switch (process.argv[2].slice (2)) {

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

    public async get (propertyString: string): Promise<any> {

        await this.initialize ();

        const keyStrings = propertyString.split ('.');

        let valueObject = this.propertiesObject;

        for (const keyString of keyStrings) {

            if (!valueObject || typeof valueObject !== 'object' || !valueObject.hasOwnProperty (keyString)) {

                return null;

            }

            valueObject = valueObject[keyString];

        }

        return valueObject;

    }

}