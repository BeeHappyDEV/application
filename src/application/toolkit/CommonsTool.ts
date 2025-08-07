import fsExtra from 'fs-extra';

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

    public static getToHumanize (candidateString: string): string {

        candidateString = candidateString
            .replace (/[-.]/g, ' ')
            .replace (/([A-Z])/g, ' $1')
            .replace (/\s+/g, ' ')
            .trim ();

        candidateString = candidateString.toLowerCase ()
            .replace (/\b\w/g, char => char.toUpperCase ());

        candidateString = candidateString.replace (/Whats App/g, 'Whatsapp')
            .replace (/\s+/g, ' ');

        return candidateString;

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

    public static getBase26 (lengthNumber: number): string {

        const charString = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        const randomValues = new Uint32Array (lengthNumber);

        crypto.getRandomValues (randomValues);

        return Array.from (randomValues, value =>

            charString[value % charString.length]

        ).join ('');

    }

    public static getBase52 (lengthNumber: number): string {

        const charString = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

        const randomValues = new Uint32Array (lengthNumber);

        crypto.getRandomValues (randomValues);

        return Array.from (randomValues, value =>

            charString[value % charString.length]

        ).join ('');

    }

    public static getBase62 (lengthNumber: number): string {

        const charString = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';

        const randomValues = new Uint32Array (lengthNumber);

        crypto.getRandomValues (randomValues);

        return Array.from (randomValues, value =>

            charString[value % charString.length]

        ).join ('');

    }

}