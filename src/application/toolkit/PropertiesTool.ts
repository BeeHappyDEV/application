import {injectable} from 'tsyringe';

import fsExtra from 'fs-extra';
import jsYaml from 'js-yaml';
import superagent from "superagent";

@injectable ()
export class PropertiesTool {

    private propertiesRecord: any = null;

    public async initialize (): Promise<void> {

        let fileString = './src/configuration/config.yml';

        const applicationRecord = jsYaml.load (fsExtra.readFileSync (fileString, 'utf8'), {}) as Record<string, any>;

        const environmentString = process.argv [2].slice (2);

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

        const environmentRecord = jsYaml.load (fsExtra.readFileSync (fileString, 'utf8'), {}) as Record<string, any>;

        this.propertiesRecord = this.mergePropertiesRecords (applicationRecord, environmentRecord);

        let hostString = '';

        const portString = process.env.PORT || this.propertiesRecord ['system'] ['port'];

        switch (environmentString) {

            case 'dev':

                hostString = this.propertiesRecord ['system'] ['host'];

                break;

            case 'qas':

                hostString = this.propertiesRecord ['system'] ['host'];

                break;

            case 'prd':

                hostString = await superagent.get (this.propertiesRecord ['integration'] ['public']).then (responseObject => responseObject.body.ip);

                break;

        }

        if (portString == '80') {

            this.propertiesRecord ['system'] ['site'] = hostString;

        } else {

            this.propertiesRecord ['system'] ['site'] = hostString + ':' + portString;

        }

    }

    private mergePropertiesRecords (applicationRecord: Record<string, any>, environmentRecord: Record<string, any>): Record<string, any> {

        const resultRecord = {...applicationRecord};

        for (const keyString in environmentRecord) {

            if (environmentRecord.hasOwnProperty (keyString)) {

                if (applicationRecord.hasOwnProperty (keyString)) {

                    resultRecord [keyString] = this.mergePropertiesRecords (applicationRecord [keyString], environmentRecord [keyString]);

                } else {

                    resultRecord [keyString] = environmentRecord [keyString];

                }

            }

        }

        return resultRecord;

    }

    public async get (propertyString: string): Promise<string> {

        await this.initialize ();

        const keyArray = propertyString.split ('.');

        let valueString = this.propertiesRecord;

        for (const keyString of keyArray) {

            if (!valueString || typeof valueString !== 'object' || !valueString.hasOwnProperty (keyString)) {

                return '';

            }

            valueString = valueString [keyString];

        }

        return valueString;

    }

}