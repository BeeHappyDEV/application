import fsExtra from 'fs-extra';
import crypto from "crypto";

export class CommonsTool {

    public static getApplicationVersion (): string {

        const packageJson = JSON.parse (fsExtra.readFileSync ('package.json', 'utf-8'));

        return packageJson.version;

    }

    public static getSafeStringify (jsonObject: any): string {

        return JSON.stringify (jsonObject, (_key, value) => {

            if (typeof value === 'bigint') {

                return {__type: 'BigInt', value: value.toString ()};

            }

            return value;

        });

    }

    public static getToCamelCase (candidateString: string): string {

        if (!candidateString) {

            return '';

        }

        if (candidateString === candidateString.toUpperCase ()) {

            return candidateString.toLowerCase ();

        }

        return candidateString
            .replace (/[-_\s]+(.)?/g, (_, coincidenceString) => coincidenceString ? coincidenceString.toUpperCase () : '')
            .replace (/^(.)/, (_, coincidenceString) => coincidenceString.toLowerCase ());

    }

    public static getToPascalCase (candidateString: string): string {

        if (!candidateString) {

            return '';

        }

        if (candidateString === candidateString.toUpperCase ()) {

            return candidateString.charAt (0) + candidateString.slice (1).toLowerCase ();

        }

        return candidateString
            .replace (/[-_\s]+(.)?/g, (_, coincidenceString) => coincidenceString ? coincidenceString.toUpperCase () : '')
            .replace (/^(.)/, (_, coincidenceString) => coincidenceString.toUpperCase ());

    }

    public static getMD5 (candidateString: string): string {

        return crypto.createHash ('md5').update (candidateString).digest ('hex').match (/.{1,4}/g)!.join ('-');

    }

}